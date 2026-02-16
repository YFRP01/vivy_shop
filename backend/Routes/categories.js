import { Router } from "express";
import pool from '../db.js'

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
        const {category} = req.query
        const cat = []
        let holdQuery = `
            SELECT cat.category_id, cat.category_name,
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
                JOIN items i ON cat.category_id = i.category_id
                `    
    if(category && category !== 'all'){
        cat.push(`%${category}%`)
        holdQuery += ` WHERE cat.category_name ILIKE $1 `
    }
    
    holdQuery+= ` GROUP BY cat.category_id ORDER BY cat.created_at DESC  `
    
    const response = await pool.query(holdQuery, cat)
    res.status(200).json(response.rows)

    } catch (error) {
        res.status(500).json(`Unable to fetch categories: ${error.message}`)
    }
})



export default router