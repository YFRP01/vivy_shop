import {Router} from 'express'
import pool from '../db.js'

const router = Router()

//get first info
router.get('/', async(req, res)=>{
    try {
        const query = await pool.query(`
            select info_id, qty, cost, details from infos WHERE is_active = true LIMIT 1;
    `)
    res.status(200).json(query.rows)
    } catch (error) {
        res.status(500).json(`Unable to fetch the first info`)
    }
})

// get infos by item id
router.get("/item/:item_id", async(req, res)=>{
    try {
        const {item_id} = req.params
        const response = await pool.query(`SELECT * FROM infos WHERE item_id = $1 AND is_active = true`, [item_id])
        if(!response.rows.length > 0 ) return res.status(404).json("The info doesn't exist")
        res.status(200).json(response.rows)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


//get an info with info_id
router.get('/:info_id', async(req, res)=>{
    const {info_id} = req.params
    try {
        const query = await pool.query(`
            SELECT * from infos WHERE info_id = $1 AND is_active = true
    `, [info_id])
    res.status(200).json(query.rows)
    } catch (error) {
        res.status(500).json(`Unable to fetch the info: ${error.message}`)
    }
})

router.post("/developer", async(req, res)=>{
    try {
        const {qty, cost, details, item_id} = req.body
        const response = await pool.query(`
            INSERT INTO infos (qty, cost, details, item_id) 
            VALUES ($1, $2, $3, $4) RETURNING *` , [qty, cost, details, item_id])
        res.status(200).json(response.rows[0])
    } catch (error) {
        res.status(500).json(`Unable to create info: ${error.message}`)
    }
})

router.put("/developer/:info_id", async(req, res)=>{
    try {
        const {info_id} = req.params
        const {qty, cost, details} = req.body
        const response = await pool.query(`
            UPDATE infos SET qty = COALESCE($1, qty), cost = COALESCE($2, cost), 
            details = COALESCE($3, details)
            WHERE info_id = $4 RETURNING *` , [qty, cost, details, info_id])
        res.status(200).json(response.rows[0])
    } catch (error) {
        res.status(500).json(`Unable to edit info: ${error.message}`)
    }
})

router.delete("/developer/:info_id", async(req, res)=>{
    try {
        const {info_id, item_id} = req.params
        const checkExistance = await pool.query(`
            SELECT 1 FROM infos WHERE info_id = $1 AND is_active = true`,[info_id])    
        if(checkExistance.rows.length < 1){
            return res.status(404).json(`The info doesn't exist`)
        }
        await pool.query(`
            DELETE FROM infos
            WHERE info_id = $1 AND item_id=$2` , [info_id, item_id])
        res.status(200).json("Successfully Deleted")
    } catch (error) {
        res.status(500).json(`Unable to delete the info: ${error.message}`)
    }
})


export default router