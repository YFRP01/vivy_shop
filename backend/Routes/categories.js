import { Router } from "express";
import pool from '../db.js'

const router = Router()


router.get("/", async (req, res)=>{
    try {
        const result = await pool.query(`
            SELECT category_id, category_name FROM categories ORDER BY category_name ASC
            `);
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json(`Unable to fetch categories: ${error.message}`)
    }
})


export default router