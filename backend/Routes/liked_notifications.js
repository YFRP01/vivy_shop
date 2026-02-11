import { Router } from "express";
import pool from "../db.js";

const router = Router();


//get notif length
router.get("/", async(req, res)=>{
    try {
        const response = await pool.query(`
            SELECT COUNT(*) AS count FROM liked_notif;`)
        res.status(200).json(response.rows)
    } catch (error) {
        res.status(500).json(`Unable to get newly updated notifications: ${error.message}`)
    }
})

router.delete("/", async(req, res)=>{
    try {
        const response = await pool.query(`
            DELETE FROM liked_notif;`)
        res.status(200).json(response.rows)
    } catch (error) {
        res.status(500).json(`Unable to truncate the table liked notifications: ${error.message}`)
    }
})


export default router;