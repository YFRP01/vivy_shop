import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.post("/", async (req, res)=>{
    const {item_id, info_id, order_qty} = req.body;
    
    try {
        const checkQuery = await pool.query(`
        SELECT 1
        FROM items WHERE item_id=$1
    `, [item_id])
        if(checkQuery.rows.lenth === 0) {
            res.json(`No such item exists in the database!`)
        }

        const create = await pool.query(`
            INSERT INTO orders (item_id, info_id, order_qty)
            VALUES ($1, $2, $3) RETURNING *`,[item_id, info_id, order_qty])

        res.status(200).json(create.rows[0])
    } catch (error) {
        res.status(500).json(`Unable to create order: ${error.message}`)
    }
})

router.put("/:order_id", async (req, res)=>{
    const {order_id} = req.params
    const {info_id, order_qty} = req.body
    try {
        
        const edit = await pool.query(`
            UPDATE orders 
            SET info_id=$1,
            order_qty=$2
            where order_id=$3 RETURNING * `,[info_id, order_qty,order_id ]
        )
        if(edit.lenth === 0 ){
            return res.status(404).json(`The element doesn't exists`)
        };
        res.status(200).json(edit.rows[0])
    } catch (error) {
        res.status(500).json(`Unable to edit order: ${error.message}`)
    }
})

router.delete("/:order_id", async (req,res)=>{
    const {order_id}= req.params
    try {
        const deleteQuery = await pool.query(`
        DELETE FROM orders WHERE order_id=$1;`,[order_id])
    
    if(deleteQuery.lenth === 0){
        res.status(404).json(`The order doesn't exist`)
    }
    res.status(200).json(deleteQuery.rows[0]
    )
    } catch (error) {
        res.send(500).json(`Unable to edit order: ${error.message}`)
    }
})



export default router