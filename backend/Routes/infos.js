import {Router} from 'express'
import pool from '../db.js'

const router = Router()

//get first info
router.get('/', async(req, res)=>{
    try {
        const query = await pool.query(`
            select info_id, qty, cost, details from infos LIMIT 1;
    `)
    res.status(200).json(query.rows)
    } catch (error) {
        res.status(500).json(`Unable to fetch the first info`)
    }
})

// get infos by item id
router.get("/:item_id", async(req, res)=>{
    try {
        const {item_id} = req.params
        const response = await pool.query(`SELECT * FROM infos WHERE item_id=$1`, [item_id])
        res.status(200).json(response.rows)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


//get an info with info_id
router.get('/:id', async(req, res)=>{
    const {id} = req.params
    try {
        const query = await pool.query(`
            select cost, details from infos  WHERE info_id=$1
    `, [id])
    res.status(200).json(query.rows)
    } catch (error) {
        res.status(500).json(`Unable to fetch the first info`)
    }
})

router.post("/developer", async(req, res)=>{
    try {
        const {qty, cost, details, item_id} = req.body
        const response = await pool.query(`INSERT INTO infos (qty, cost, details, item_id) VALUES ($1, $2, $3, $4) RETURNING *` , [qty, cost, details, item_id])
        res.status(200).json(response.rows[0])
    } catch (error) {
        res.status(500).json(`Unable to post infos: ${error.message}`)
    }
})

export default router