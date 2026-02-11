import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async(req, res)=>{
    const {category}= req.query
    const params = []
    try {
        let query=`SELECT 
		(SELECT 
			json_build_object(
			'item_id', i.item_id,
			'name', i.name,
			'liked', i.liked,
            'category', i.category
			)) AS item,
		CASE WHEN o.order_id IS NULL THEN false ELSE true END AS order_status,
		CASE WHEN o.order_id IS NULL THEN 
		(SELECT 
			json_build_object(
				'qty',inf1.qty, 
				'cost', inf1.cost,
				'details', inf1.details
				) FROM infos inf1 LIMIT 1)
		ELSE
		(SELECT 
				json_build_object(
					'qty', o.order_qty, 
					'cost', inf2.cost, 
					'details', inf2.details) FROM infos inf2 WHERE o.info_id=inf2.info_id)
		END AS info		
        FROM items i 
		LEFT JOIN orders o ON o.item_id=i.item_id
        WHERE i.liked=true
        
	`
    if(category !== 'all'){
        query+=` AND i.category ILIKE $1`
        params.push(`%${category}%`)
    }

    query+=` ORDER BY i.liked_at DESC`

        const getAll = await pool.query(query, params)
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
            return res.send(400).json({error: "Provide liked status"})
        }

        if(!liked){
            await pool.query(`INSERT INTO liked_notif (item_id) VALUES($1)`,[id])
        } else await pool.query(`DELETE FROM liked_notif WHERE item_id=$1`,[id])
        const update = await pool.query(`
            UPDATE items 
            SET liked = NOT $1, liked_at = NOW()
            WHERE item_id=$2 RETURNING item_id, name, liked
        `, [liked, id]);

        if(update.length === 0){
            res.status(404).json("The elemnt doesn't exist")
        }
        res.status(200).json(update.rows[0]);
        console.log(`${liked? 'Unliked' : 'Liked'}`);
        
    } catch (error) {
        res.status(500).json({error: 'Failed to like / unlike of item'})
    }
})



export default router