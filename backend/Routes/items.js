import { Router } from "express";
import pool from "../db.js";

const router = Router();


/*---------------------------- 
    FETCH FUNCTIONS
-----------------------------*/

router.get("/", async (req, res) => {
  const { main, category } = req.query;

  try {
    let query = '';
    const params = [];
    
    // Main view queries
    if (main === 'main') {
      query = `
        SELECT 
          i.item_id, 
          i.name, 
          i.category, 
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
        FROM items i
        WHERE 1=1`;
      
      if (category !== 'all') {
        query += ` AND i.category ILIKE $1`;
        params.push(`%${category}%`);
      }
      
      query += ` ORDER BY i.item_id`;
    }
    
    // Liked items view
    else if (main === 'liked') {
      query = `
        SELECT 
          i.item_id, 
          i.name, 
          i.category, 
          i.liked,
          i.created_at::date AS date, 
          i.created_at::time AS time,
          (SELECT json_build_object(
            'info_id', inf.info_id,
            'qty', inf.qty,
            'cost', inf.cost,
            'details', inf.details
          ) FROM infos inf 
          WHERE inf.item_id = i.item_id 
          LIMIT 1) AS info,
          json_build_object(
            'date', o.created_at::date,
            'time', o.created_at::time
          ) AS order_info
        FROM items i 
        LEFT JOIN orders o ON o.item_id = i.item_id
        WHERE i.liked = true`;
      
      if (category !== 'all') {
        query += ` AND i.category ILIKE $1`;
        params.push(`%${category}%`);
      }
      
      query += ` ORDER BY i.created_at ASC`;
    }
    
    // Ordered items view
    else if (main === 'ordered') {
      query = `
        SELECT 
          i.item_id, 
          i.name, 
          i.category, 
          i.liked,
          i.created_at::date AS date, 
          i.created_at::time AS time,
          (SELECT json_build_object(
            'cost', inf.cost,
            'details', inf.details
          ) FROM infos inf 
          WHERE inf.info_id = o.info_id) AS info,
          json_build_object(
            'order_id', o.order_id,
            'order_qty', o.order_qty,
            'date', o.created_at::date,
            'time', o.created_at::time
          ) AS order_info
        FROM items i 
        LEFT JOIN orders o ON o.item_id = i.item_id
        WHERE o.order_id IS NOT NULL`;
      
      if (category !== 'all') {
        query += ` AND i.category ILIKE $1`;
        params.push(`%${category}%`);
      }
      
      query += ` ORDER BY o.created_at ASC`;
    }
    
    // Default query if no main specified
    else {
      query = `
        SELECT 
          i.item_id, 
          i.name, 
          i.category, 
          i.liked,
          (SELECT th.image FROM thumbnails th 
            WHERE th.item_id = i.item_id 
            LIMIT 1) AS thumbnail
        FROM items i
        ORDER BY i.item_id
        LIMIT 50`;
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No items found' });
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Unable to fetch items:', error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/:id', async (req, res) => {

  try {
    const { id } = req.params;

    const query = `      
    SELECT 
        i.item_id,
        i.name,
        i.category,
        i.liked,
        i.created_at,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'image_id', th.image_id,
              'image', th.image
            )
          ) FILTER (WHERE th.image_id IS NOT NULL),
          '[]'
        ) AS thumbnails,

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
      WHERE i.item_id = $1
      GROUP BY i.item_id;`;

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

//remove order
router.delete('/order/:id', async (req,res)=>{
    try {
        const { id } = req.params;
        const update = await pool.query(`
            DELETE FROM orders
            WHERE item_id=main;
        `, [id]);
        res.status(200).json(update.rows);
        console.log("Updated");
        
    } catch (error) {
        res.status(500).json({error: 'Failed to like / unlike of item'})
    }
})



//main && category='all'
const hold1 = `SELECT i.item_id, i.name, i.category, i.liked,
            (SELECT th.image FROM thumbnails th WHERE th.item_id=i.item_id 
            ORDER BY th.item_id LIMIT 1) AS thumbnail,
            (SELECT json_build_object(
                'info_id', inf.info_id,
                'qty', inf.qty,
                'cost', inf.cost,
                'details', inf.details
            ) FROM infos inf WHERE inf.item_id=i.item_id ORDER BY inf.info_id LIMIT 1 ) AS info,
            LEFT JOIN orders o ON o.item_id=i.item_id
            GROUP BY i.item_id`;

// main && category !='all'
const hold2 = `SELECT i.item_id, i.name, i.category, i.liked,
            (SELECT th.image FROM thumbnails th WHERE th.item_id=i.item_id 
            ORDER BY th.item_id LIMIT 1) AS thumbnail,
            (SELECT json_build_object(
                'info_id', inf.info_id,
                'qty', inf.qty,
                'cost', inf.cost,
                'details', inf.details
            ) FROM infos inf WHERE inf.item_id=i.item_id ORDER BY inf.info_id LIMIT 1 ) AS info,
            FROM items i 
            LEFT JOIN infos inf ON inf.item_id=i.item_id
            WHERE i.category ILIKE '%audio%' `;


// const updateThumbnails = (`UPDATE thumbnails
//             SET image = COALESCE(main, image)
//             WHERE item_id =category;`,
//             [image, id]);

// const updateInfos = (`UPDATE infos
//             SET qty=COALESCE(main, qty), cost=COALESCE(category, cost), details=COALESCE($3, details)
//             WHERE item_id =$4;`,
//             [qty, cost, details, id]);



export default router;