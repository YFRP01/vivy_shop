import { Router } from "express";
import pool from '../db.js'
import { upload } from "../config/multer.js";


const router = Router()


router.get("/", async (req, res)=>{
    try {
        const result = await pool.query(`
            SELECT category_id, category_name, image FROM categories ORDER BY category_name ASC
            `);
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json(`Unable to fetch categories: ${error.message}`)
    }
})

router.get("/developer", async (req, res)=>{
    try {
        const {category, search} = req.query
        const params = []
        let query = `
            SELECT cat.category_id, cat.category_name, cat.image, 
            cat.created_at::time AS time, cat.created_at::date AS date,
                COALESCE (
                    json_agg(
                        json_build_object(
                            'item_id', i.item_id,
                            'name', i.name,
                            'category', cat.category_name,
                            'date', i.created_at::date,
                            'time', i.created_at::time
                        ) ORDER BY i.name ASC
                ) FILTER (WHERE i.item_id IS NOT NULL), 
                '[]' 
                ) AS item
                FROM categories cat 
                LEFT JOIN items i ON cat.category_id = i.category_id
                `    

    if(search || category !=='all'){
        query+=` WHERE
		(cat.category_name ILIKE $1) `
    }
    if(search && category === 'all'){
        params.push(`%${search}%`)
    }
    if(search && category !=='all'){
        query+=`
		AND (cat.category_name ILIKE $2) `
        params.push(`%${search}%`, `%${category}%`)
    }
    if(!search && category !=='all'){
        params.push(`%${category}%`)
    }
    
    query+= ` GROUP BY cat.category_id ORDER BY cat.created_at DESC  `
    
    const response = await pool.query(query, params)
    res.status(200).json(response.rows)

    } catch (error) {
        res.status(500).json(`Unable to fetch categories: ${error.message}`)
    }
})

router.post("/developer", upload.single("image"), async(req, res)=>{
    try {
        const {name} = req.body
        const imageFile = req.file
        const imagePath = `/uploads/categories/${imageFile.filename}`
        if(!name){
            return res.status(400).json("Insert name!")
        }
        if(!imageFile){
            return res.status(400).json("Insert image!")
         }
        const response = await pool.query(`INSERT 
            INTO categories (category_name, image) VALUES ($1, $2) RETURNING * `,
            [name.trim(), imagePath]
        )
        res.status(201).json(response.rows[0])
    } catch (error) {
        res.status(500).json(`Unable to post the item: ${error.message}`)
    }
})


export default router