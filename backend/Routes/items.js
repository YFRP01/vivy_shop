import { Router } from "express";
import pool from "../db.js";
import { upload } from "../config/multer.js";

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
            WHERE i.category_id = c1.category_id) AS category, i.liked,
            (SELECT th.image FROM thumbnails th WHERE th.item_id = i.item_id ORDER BY th.image_id LIMIT 1) AS thumbnail,
            (SELECT json_build_object(
              'info_id', inf.info_id,
              'qty', inf.qty,
              'cost', inf.cost,
              'details', inf.details
            ) FROM infos inf 
            WHERE inf.item_id = i.item_id AND inf.is_active = true
            LIMIT 1) AS info
            FROM items i LEFT JOIN infos inf2 ON inf2.item_id=i.item_id WHERE 1=1 `

    if(search && category === 'all'){
        query+=` AND
        (i.name ILIKE $1 OR i.description ILIKE $1
        OR inf2.details ILIKE $1
        OR i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $1 )
        ) `
        params.push(`%${search}%`)
    }
    if(search && category !=='all'){
        query+=` AND
        (i.name ILIKE $1 OR i.description ILIKE $1
        OR inf2.details ILIKE $1
        )
        AND (i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $2 )) `
        params.push(`%${search}%`, `%${category}%`)
    }
    if(!search && category !=='all'){
        query+=` AND (i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $1 )) `
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
        SELECT i.item_id, i.name, i.description, 
          (SELECT json_build_object(
            'id', s.source_id,
            'name', s.source_name
          )) AS source,
        i.created_at::DATE AS date,
        i.created_at::TIME AS time,
        (SELECT th.image FROM thumbnails th WHERE th.item_id = i.item_id LIMIT 1) AS images,
        (SELECT json_build_object(
            'id', cat2.category_id,
            'name', cat2.category_name,
            'image', cat2.image
        )) AS category,
        (SELECT json_agg(
          json_build_object(
              'qty', inf.qty,
              'cost', inf.cost,
              'details', inf.details
            )
         ) FROM infos inf WHERE inf.item_id = i.item_id AND inf.is_active = true) AS infos,
        (SELECT json_agg(
          json_build_object(
              'file', th.image,
              'cost', th.image
            )
        ) FROM thumbnails th WHERE th.item_id = i.item_id) AS thumbnails
        FROM items i 
        LEFT JOIN sources s ON s.source_id = i.source_id
        LEFT JOIN infos inf2 ON inf2.item_id=i.item_id
        JOIN categories cat2 ON cat2.category_id = i.category_id WHERE `
        
        if(search){
            if(category === 'all'){
                query+=`
                  (i.name ILIKE $1 OR i.description ILIKE $1
                  OR inf2.details ILIKE $1
                  OR i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $1)) `
                params.push(`%${search}%`)
            } else {query+=`
                (i.name ILIKE $1 OR i.description ILIKE $1
                OR inf2.details ILIKE $1)
                AND (i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $2 )) `
                params.push(`%${search}%`, `%${category}%`)}
        }
        if(!search){
            query+=`1=1 `
            if(category !=='all'){
            query+=`AND (i.category_id IN (SELECT category_id FROM categories WHERE category_name ILIKE $1 )) `
            params.push(`%${category}%`)}
        }

    query += `AND inf2.is_active = true GROUP BY i.item_id, s.source_id, cat2.category_id ORDER BY i.created_at `;
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
      WHERE i.item_id = $1 AND inf.is_active = true
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

//delete item
router.delete("/:item_id", async (req,res)=>{
    const {item_id}= req.params
    try {
        const checkExistance = await pool.query(`SELECT 1 FROM items WHERE item_id=$1`,[item_id])
        if(checkExistance.rows.length === 0){
            return res.status(404).json(`The order doesn't exist`)
        }
        const deleteQuery = await pool.query(`
            DELETE FROM items WHERE item_id=$1;`,[item_id])
        res.status(200).json(deleteQuery.rows[0])
    } catch (error) {
        res.send(500).json(`Unable to delete order: ${error.message}`)
    }
})


//get with id
router.get("/developer/:item_id", async(req, res)=>{
    try {
      const {item_id} = req.params
      const response = await pool.query(`
        SELECT i.item_id, i.name, i.description, 
        (SELECT json_build_object(
          'id', s.source_id,
          'name', s.source_name
          )) AS source,
        (SELECT json_build_object(
            'id', cat.category_id,
            'name', cat.category_name, 
            'image', cat.image
        )) AS category,
        (SELECT json_agg(
          json_build_object(
              'qty', inf.qty,
              'cost', inf.cost,
              'details', inf.details
            )
         ) FROM infos inf WHERE inf.item_id = i.item_id AND inf.is_active = true) AS infos,
        (SELECT json_agg(
          json_build_object(
              'file', th.image,
              'cost', th.image
            )
        ) FROM thumbnails th WHERE th.item_id = i.item_id) AS thumbnails
        FROM items i 
        JOIN sources s ON s.source_id = i.source_id 
        JOIN categories cat ON cat.category_id = i.category_id
        WHERE i.item_id = $1
        GROUP BY i.item_id, cat.category_id, s.source_id `,[item_id])

        res.status(200).json(response.rows)
    } catch (error) {
      res.status(500).json(`Unable to get item details: ${error.message}`)
    }
})

router.post("/developer", async(req, res)=>{
  try {
    const {name, description, category_id, source_id} = req.body
    const response = await pool.query(`
      INSERT INTO items (name, description, category_id, source_id)
	    VALUES ($1, $2, $3, $4) RETURNING *`, [name, description, category_id, source_id])
      res.status(201).json(response.rows[0])
  } catch (error) {
    res.status(500).json(`Unable to create items: ${error.message}`)
  }
})

//edit items from dev dashboard
router.put('/developer/full/:item_id', upload.array("newImages"), async (req, res)=>{
  const client = await pool.connect()
  const errorMessage = []
    try {
    const {item_id} = req.params
    const {name, description, source_id} = req.body
    let category = req.body.category ? JSON.parse(req.body.category) : null
    const submittedInfos = JSON.parse(req.body.infos || "[]")
    const submittedThumbnails = JSON.parse(req.body.thumbnails || "[]")


    //=============
    //verification
    //=============
    const checkItemExistence = await client.query(`SELECT item_id FROM items WHERE item_id = $1`, [item_id])
    if(checkItemExistence.rows.length === 0) {
      errorMessage.push("Item not found")
      await client.query("ROLLBACK")
      return res.status(404).json("Item not found")
    }
    if(!name) {
      errorMessage.push("Item name required")
      await client.query("ROLLBACK")
      return res.status(400).json("Item name required")
    }
    if(!description) {
      errorMessage.push("Item description required")
      await client.query("ROLLBACK")
      return res.status(400).json("Item description required")
    }
    if(!item_id) {
      errorMessage.push("Item ID required")
      await client.query("ROLLBACK")
      return res.status(400).json("Item ID required")
    }
    if(!source_id) {
      errorMessage.push("Source required")
      await client.query("ROLLBACK")
      return res.status(400).json("Source required")
    }

    //===========
    //connect
    //===========
    await client.query("BEGIN")

    //Handle category
    if(category && !category?.id) {
        if(!category?.image && category?.name) {
          errorMessage.push("Category image required")
          await client.query("ROLLBACK")
          return res.status(409).json("Category image required")
        }
        if(category?.image && !category?.name) {
          errorMessage.push("Category name required")
          await client.query("ROLLBACK")
          return res.status(409).json("Category name required")
        }
        if(!category?.image && !category?.name) {
          errorMessage.push("Category name and image required")
          await client.query("ROLLBACK")
          return res.status(409).json("Category name and image required")
        }
        const existingCategories = await client.query(`SELECT category_id FROM categories WHERE category_name = $1`, [category?.name])
        
        if(existingCategories.rows.length === 0){
          const imagePath = `/uploads/categories/${category?.image}`
          const insertCategory = await client.query(`
            INSERT INTO categories (category_name, image) 
              VALUES ($1, $2) RETURNING category_id AS id, category_name AS name, image`, [category?.name, imagePath])
          category = insertCategory.rows[0]
        }
        else {
          errorMessage.push

          ("Category name already existing")
          await client.query("ROLLBACK")
          return res.status(400).json("Category name already existing")
        }
    }
        
    await client.query(`
        UPDATE items SET 
          name = COALESCE($1, name), 
          description = COALESCE($2, description),
          category_id = COALESCE($3, category_id),
          source_id = COALESCE($4, source_id)
          WHERE item_id = $5`,
      [name, description, category?.id, source_id, item_id])

    //============
    //Handle infos
    //============
    const allInfos = await client.query(`SELECT info_id, qty, cost, details FROM infos WHERE item_id = $1`, [item_id])
    const dbInfosIds = allInfos.rows.map((info)=>info.info_id)
    const submittedInfosIds = submittedInfos.filter((info)=>info.info_id).map((i)=>i.info_id)
    const newlyCreatedInfos = submittedInfos.filter((i)=>!i.info_id || i.info_id !== dbInfosIds(i.info_id))
    const updatedInfos = submittedInfos.filter((info)=> info.info_id  && dbInfosIds.includes(info.info_id))
    const deletedInfos = dbInfosIds.filter((id)=> !submittedInfosIds.includes(id))

    //update info
    for(let info of updatedInfos){
      await client.query(`
        UPDATE infos
        SET qty = COALESCE($1, qty),
        cost = COALESCE($2, cost),
        details = COALESCE($3, details) 
        WHERE info_id = $4`, 
        [info.qty, info.cost, info.details, info.info_id])
    }

    //create info
    for(let info of newlyCreatedInfos){
      await client.query(`INSERT INTO infos (qty, cost, details, item_id) VALUES ($1, $2, $3, $4)`, [info.qty, info.cost, info.details, item_id])
    }

    //delete info
    for(let infoId of deletedInfos){
      await client.query(`UPDATE infos SET is_active = false WHERE info_id = $1`, [infoId])
    }


    //==================
    //Handle thumbnails
    //==================
    const AllThumbnails = await client.query(`SELECT image_id, image FROM thumbnails WHERE item_id = $1`, [item_id])
    const dbThumbnailsIds = AllThumbnails.rows.map((thumb)=>thumb.image_id)
    const submittedThumbnailIds = submittedThumbnails.filter((i)=>i.image_id).map((i)=>i.image_id)
    const newlyCreatedThumb = submittedThumbnails.filter((i)=> !i.image_id || i.image_id !== dbThumbnailsIds.includes(i.image_id))
    const updatedThumb = submittedThumbnails.filter((image)=> image.image_id && dbThumbnailsIds.includes(image.image_id))
    const deletedThumb = dbThumbnailsIds.filter((id)=> !submittedThumbnailIds.includes(id))
    
    //update thumbnails
    for(let thumb of updatedThumb){
      const imagePath = `/uploads/thumbnails/${thumb.image}`
      await client.query(`UPDATE thumbnails SET image = COALESCE($1, image) WHERE image_id = $2`, [imagePath, thumb.image_id])
    }

    //create thumbnails
    for(let thumb of newlyCreatedThumb){
      const imagePath = `/uploads/thumbnails/${thumb.image}`
      await client.query(`INSERT INTO thumbnails (image, item_id) VALUES ($1, $2)`, [imagePath, item_id])
    }

    //delete thumbnails
    for(let thumbId of deletedThumb){
      await client.query(`DELETE FROM thumbnails WHERE image_id = $1`, [thumbId])
    }

    //final result
    await client.query("COMMIT")
    res.status(200).json({
        status: true,
        message: "Item updated successfully",
        type: "submit"
    })

  } catch (error) {
      await client.query("ROLLBACK")

      if(req.files){
        for(let file of req.files){
          const imagePath = path.join(__dirname, "../uploads", file.filename)
          if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath)
            console.log(`Cleaned up image: ${file.filename}`)
          }
        }
      }
      console.log("Error:"+ error.message)
      res.status(500).json({
        status: false,
        details: error.message,
        message: errorMessage
      })
    }
    finally{
      client.release()
    }
})  






export default router;