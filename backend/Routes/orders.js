import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res)=>{
    const {item_id} = req.body
    try {
        const result = await pool.query(``)
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json("Unable to get orders")
        console.log(("Unable to get orders"));
        
    }
})

router.get("/:id", async (req, res)=>{
    const {id} = req.params
    try {
        const result = await pool.query(``,[id])
        if (result.rows.length === 0) {
            res.status(404).json(`The order doesn't exist}`)
            console.log("The order doesn't exist");
        } else res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json("Unable to get the order")
        console.log(("Unable to get the order"));
        
    }
})

  
router.post("/", async (req, res)=>{
    const {item_id, info_id, order_qty} = req.body;
    try {
        const create = await pool.query(`
            INSERT INTO orders (item_id, info_id, order_qty)
            VALUES ($1, $2, $3) RETURNING *`,[item_id, info_id, order_qty])
        res.status(200).json(create.rows[0])
    } catch (error) {
        res.status(500).json(`Unable to create order: ${error.message}`)
    }
})

router.put("/:id", async (req, res)=>{
    const {id} = req.params
    const {info_id, order_qty} = req.body
    try {
        const edit = await pool.query(`
            UPDATE orders 
            SET info_id=COALESCE($1, info_id),
            order_qty=COALESCE($2, order_qty)
            where order_id=$3 RETURNING *`,[info_id, order_qty, id ]
        )
        if(edit.length === 0 ){
            return res.status(404).json(`The element doesn't exists`)
        };
        console.log(`Successfully Updated`);
        
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