import { Router } from "express";
import pool from "../db.js";

const router = Router();

//update liked
router.put('/:id', async (req,res)=>{
    try {
        const { id } = req.params;
        const update = await pool.query(`
            UPDATE items 
            SET liked = NOT liked, liked_at = NOW()
            WHERE item_id=main;
        `, [id]);
        res.status(200).json(update.rows[0]);
        console.log("Updated");
        
    } catch (error) {
        res.status(500).json({error: 'Failed to like / unlike of item'})
    }
})



export default router