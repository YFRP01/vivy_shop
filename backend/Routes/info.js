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

export default router