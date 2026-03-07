import { Router } from "express";
import { upload } from "../config/multer.js";
import pool from "../db.js";
import { BASE_IMAGE_URL } from "../api.js";

const router = Router()

router.get("/", async(req, res)=>{
    try {
        const response = await pool.query(`SELECT * FROM thumbnails WHERE is_active = true`)
        res.status(200).json(response.rows)        
    } catch (error) {
        res.status(500).json(`Unablee to get thumbnails: ${error.message}`)
    }
})

router.get("/developer/:item_id", async(req, res)=>{
    try {
        const {item_id} = req.params
        const response = await pool.query(`SELECT * FROM thumbnails WHERE item_id=$1 AND is_active = true`, [item_id])
        res.status(200).json(response.rows)        
    } catch (error) {
        res.status(500).json(`Unable to get thumbnails of the item: ${error.message}`)
    }
})

router.post("/developer", upload.single("image"), async(req, res)=>{
    try {
        const {item_id} = req.body
        const imageFile = req.file
        if(!imageFile) return res.status(400).json("No image uploaded")
        const imagePath = `${BASE_IMAGE_URL}/uploads/categories/${imageFile.filename}`
        const response = await pool.query(`
            INSERT INTO thumbnails (image, item_id) 
            VALUES ($1, $2) RETURNING *`, [imagePath, item_id])
        res.status(200).json(response.rows[0])
    } catch (error) {
        res.status(500).json(`Unable to create thumbnail: ${error.message}`)
    }
})

//edit thumbnail
router.put('/thumbnail/:id',async (req,res)=>{
    try {
        const {id} = req.params
        const {image} = req.body
        const result = await pool.query(`UPDATE thumbnails
            SET image = COALESCE($1, image)
            WHERE image_id = $2 RETURNING *`, [image, id])
        res.status(200).json(response.rows[0])
    } catch (error) {
        res.send(500).json(`Unable to edit thumbnail:` + error.message)
    }
})

export default router