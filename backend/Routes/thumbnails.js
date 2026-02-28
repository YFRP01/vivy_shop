import { Router } from "express";
import { upload } from "../config/multer.js";
import pool from "../db.js";

const router = Router()

router.get("/", async(req, res)=>{
    try {
        const response = await pool.query(`SELECT * FROM thumbnails`)
        res.status(200).json(response.rows)        
    } catch (error) {
        res.status(500).json(`Unablee to get thumbnails: ${error.message}`)
    }
})

router.post("/developer", upload.single("image"), async(req, res)=>{
    try {
        const {item_id} = req.body
        const imageFile = req.file
        const response = await pool.query(`INSERT INTO thumbnails (image, item_id) VALUES ($1, $2) RETURNING *`, [imageFile, item_id])
        res.status(500).json(response.rows[0])
    } catch (error) {
        res.status(500).json(`Unable to post thumbnails : ${error.message}`)
    }
})

export default router