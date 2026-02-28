import { Router } from "express";
import pool from "../db.js";

const router = Router();


router.get("/", async(req, res)=>{
    try {
        const response = await pool.query(`
            SELECT * FROM sources `)
        res.status(200).json(response.rows)
    } catch (error) {
        res.status(500).json(`Unable to create the source: ${error.message}`)
    }
})

router.post("/developer", async(req, res)=>{
    try {
        const {source} = req.body;
        const response = await pool.query(`
            INSERT INTO sources (source) VALUES ($1) RETURNING * `, [source])
        res.status(200).json(response.rows[0])
    } catch (error) {
        res.status(500).json(`Unable to create the source: ${error.message}`)
    }
})

export default router