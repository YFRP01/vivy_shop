import { Router } from "express";
import pool from "../db.js";

const router = Router();


/*---------------------------- 
    FETCH FUNCTIONS
-----------------------------*/

router.get("/", async (req, res) => {
  const { category, search } = req.query;
  try {
    let query = '';
    let params = []
    
    // Main view queries
      query = `
        SELECT 
            i.item_id, 
            i.name,
            (SELECT c1.category_name FROM categories c1 
            WHERE i.category_id = c1.category_id) AS category, 
            i.liked,
            (SELECT th.image FROM thumbnails th 
            WHERE th.item_id = i.item_id 
            ORDER BY th.image_id LIMIT 1) AS thumbnail,
            (SELECT json_build_object(
            'info_id', inf.info_id,
            'qty', inf.qty,
            'cost', inf.cost,
            'details', inf.details
            ) FROM infos inf 
            WHERE inf.item_id = i.item_id 
              LIMIT 1) AS info
            FROM items i        `

    if(search){
        query+=` LEFT JOIN infos inf2 ON inf2.item_id=i.item_id `
    }
    if(search && category === 'all'){
        query+=` WHERE
		(i.name ILIKE $1 OR i.description ILIKE $1
		OR inf2.details ILIKE $1
		OR i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $1 )
		) `
        params.push(`%${search}%`)
    }
    if(search && category !=='all'){
        query+=`
        WHERE
		(i.name ILIKE $1 OR i.description ILIKE $1
		OR inf2.details ILIKE $1
		)
		AND (i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $2 )) `
        params.push(`%${search}%`, `%${category}%`)
    }
    if(!search && category !=='all'){
        query+=` WHERE (i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $1 )) `
        params.push(`%${category}%`)
    }

    query += `GROUP BY i.item_id ORDER BY i.created_at `;
     
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Unable to fetch items:', error.message);
    res.status(500).json(`Unable to get items for category="${category}" and search="${search}": ${error.message}`);
  }
});


router.get("/developer", async (req, res)=>{
  try {
    const {category, search} = req.query
    const params = []
    let query = ''
    query = `
        SELECT i.item_id, i.name, i.source, i.description, i.source, 
        i.created_at::DATE AS date,
        i.created_at::TIME AS time,
        (SELECT th.image FROM thumbnails th WHERE th.item_id = i.item_id LIMIT 1) AS image,
        (SELECT cat.category_name FROM categories cat WHERE cat.category_id =  i.category_id) AS category
        FROM items i `;
    if(search){
        query+=` LEFT JOIN infos inf2 ON inf2.item_id=i.item_id `
    }
    if(search && category === 'all'){
        query+=` WHERE
		(i.name ILIKE $1 OR i.description ILIKE $1
		OR inf2.details ILIKE $1
		OR i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $1 )
		) `
        params.push(`%${search}%`)
    }
    if(search && category !=='all'){
        query+=`
        WHERE
		(i.name ILIKE $1 OR i.description ILIKE $1
		OR inf2.details ILIKE $1
		)
		AND (i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $2 )) `
        params.push(`%${search}%`, `%${category}%`)
    }
    if(!search && category !=='all'){
        query+=` WHERE (i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $1 )) `
        params.push(`%${category}%`)
    }

    query += `GROUP BY i.item_id ORDER BY i.created_at `;
    const response = await pool.query(query, params)
    if(response.length === 0){ return res.status(404).json(`No math found`)}
    res.status(200).json(response.rows)
  } catch (error) {
    res.status(500).json(`Unable to get developer items: ${error.message}`)
  }
})

router.get('/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const query = `      
    SELECT 
        (SELECT json_build_object(
			'item_id', i.item_id,
        	'name', i.name,
        	'category', c.category_name,
        	'liked', i.liked,
          'description', i.description,
        	'created_at', i.created_at
		) FROM categories c WHERE i.category_id = c.category_id ) AS item,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'image_id', th.image_id,
              'image', th.image
            )
          ) FILTER (WHERE th.image_id IS NOT NULL),
          '[]'
        ) AS thumbnails,
		CASE WHEN o.order_id IS NULL THEN 
		(SELECT json_build_object(
			'order_status', false
		))
		ELSE 
		(SELECT json_build_object(
			'order_status', true,
      'order_id', o.order_id,
			'order_qty', o.order_qty,
			'info_id', o.info_id
		))
		END AS order,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'info_id', inf.info_id,
              'qty', inf.qty,
              'cost', inf.cost,
              'details', inf.details
            )
          ) FILTER (WHERE inf.info_id IS NOT NULL),
          '[]'
        ) AS infos
      FROM items i
      LEFT JOIN thumbnails th ON th.item_id = i.item_id
      LEFT JOIN infos inf ON inf.item_id = i.item_id
	  LEFT JOIN orders o ON o.item_id=i.item_id
      WHERE i.item_id = $1
      GROUP BY i.item_id, o.order_id;`;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//edit items from dev dashboard
router.put('/:id', async (req, res)=>{
    const {id} = req.params;
    const { name, category, source, liked_at, created_at,
        thumbnails, infos
     } = req.query;
     const updateItems = (`UPDATE items 
            SET name = COALESCE(main, name),
            category=COALESCE(category, category), liked = false, source = COALESCE($3, source), 
            created_at = NOW(), liked_at = COALESCE($4, liked_at)
            WHERE item_id =$5;`, 
            [name, category, source, liked_at, id]);
    
    try {
        const result = await pool.query(`

            `,
            [id]);
        res.send(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({error: "Unable to edit item"})
        console.log("Error:"+ error.json);
        
    }
})  
    
//edit thumbnail
router.put('/thumbnail/:id',async (req,res)=>{
    const {id} = req.params;
    const {image} = req.body
    try {
        const result = await pool.query(`UPDATE thumbnails
            SET image = COALESCE(main, image)
            WHERE item_id =category;`,
            [image, id]);
    } catch (error) {
        res.send(500).json(`Unable to edit thumbnail:` + error.message)
    }
})

//edit order
router.put('/order/:id', async (req, res) => {
    const { id } = req.params;
    const { info_id, order_qty } = req.body;

    try {
      
        const result = await pool.query(`
            UPDATE orders 
            SET order_qty = COALESCE(main, order_qty),
            info_id= COALESCE(category, info_id)
            created_at = NOW()
            WHERE order_id = $3
            RETURNING *;`,
             [order_qty, info_id, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

//delete item
router.delete("/:item_id", async (req,res)=>{
    const {item_id}= req.params
    try {
        const checkExistance = await pool.query(`
            SELECT item_id FROM items WHERE item_id=$1`,[item_id])
        const deleteQuery = await pool.query(`
        DELETE FROM items WHERE item_id=$1;`,[item_id])
    
    if(checkExistance.lenth === 0){
        res.status(404).json(`The order doesn't exist`)
        console.log(`The order doesn't exist`);
    } else
    res.status(200).json(deleteQuery.rows[0]
    )
    } catch (error) {
        res.send(500).json(`Unable to delete order: ${error.message}`)
    }
})


// ------------------------------------------
// get developer ItemCards
// ------------------------------------------

router.get("/developer", async (req, res)=>{
  try {
    const {category} = req.query
    const params = []
    let hold = ''
    hold = `
        SELECT i.item_id, i.name, i.source, i.description, i.source, 
        i.created_at::DATE AS date,
        i.created_at::TIME AS time,
        (SELECT th.image FROM thumbnails th WHERE th.item_id = i.item_id LIMIT 1) AS image,
        (SELECT cat.category_name FROM categories cat WHERE cat.category_id =  i.category_id) AS category
        FROM items i `;
        if(category !== 'all'){
          hold+=` WHERE i.category_id IN (
          SELECT category_id FROM categories WHERE category_name ILIKE $1
          ) `;
        params.push(`%${category}%`);
        }
        hold+=` ORDER BY i.created_at DESC`
    const response = await pool.query(hold, params)
    if(response.length === 0){ return res.status(404).json(`No math found`)}
    res.status(200).json(response.rows)
  } catch (error) {
    res.status(500).json(`Unable to get developer items: ${error.message}`)
  }
})


//get with id
router.get("/developer/:item_id", async(req, res)=>{
    try {
      const {item_id} = req.params
      const response = await pool.query(`
        SELECT i.item_id, i.name, i.description, i.source,
        cat.category_name AS category, cat.image AS category_image,
        (SELECT json_agg(
          json_build_object(
              'qty', inf.qty,
              'cost', inf.cost,
              'details', inf.details
            )
          )) AS infos,
        (SELECT json_agg(
          json_build_object(
              'file', th.image,
              'cost', th.image
            )
          )) AS thumbnails
        FROM items i 
        JOIN categories cat ON cat.category_id = i.category_id
        JOIN infos inf ON inf.item_id = i.item_id
        JOIN thumbnails th ON th.item_id = i.item_id
        WHERE i.item_id = $1
        GROUP BY i.item_id, cat.category_id`,[item_id])

        res.status(200).json(response.rows)
    } catch (error) {
      res.status(500).json(`Unable to get item details: ${error.message}`)
    }
})











export default router;