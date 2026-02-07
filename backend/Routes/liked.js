import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async(req, res)=>{
    try {
        const getAll = await pool.query(
            `SELECT 
		i.item_id,
		i.name,
		i.liked,
		(SELECT
        json_build_object(
		'qty',inf.qty,
		'cost',inf.cost,
		'details',inf.details) FROM infos inf LIMIT 1)
		 AS info,
		(SELECT json_build_object(
		 'qty', o.order_qty,
		 'info_id', o.info_id
		 ) 
		 FROM orders o WHERE o.item_id=i.item_id LIMIT 1) AS order
        FROM items i
        WHERE i.liked=true
        ORDER BY i.created_At ASC
	`
        )
        res.status(200).json(getAll.rows)
    } catch (error) {
        res.status(500).json(`Unable to fetch the liked items: ${error.message}`)
    }
})
//update liked
router.put('/:id', async (req,res)=>{
    try {
        const { id } = req.params;
        const {liked} = req.body

        if(liked === null || liked === undefined){
            res.send(400).json({error: "Provide liked status"})
        }

        const update = await pool.query(`
            UPDATE items 
            SET liked = NOT $1, liked_at = NOW()
            WHERE item_id=$2 RETURNING item_id, name, liked
        `, [liked, id]);
        if(update.length === 0){
            res.status(404).json("The elemnt doesn't exist")
        }
        res.status(200).json(update.rows[0]);
        console.log("Updated");
        
    } catch (error) {
        res.status(500).json({error: 'Failed to like / unlike of item'})
    }
})



export default router