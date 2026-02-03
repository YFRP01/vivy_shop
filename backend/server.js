import express from 'express'
import cors from 'cors'
import itemRoutes from "./routes/items.js"
import likedRoutes from "./Routes/liked.js"
import ordersRoutes from "./Routes/orders.js"

import dotenv from 'dotenv'
dotenv.config();

const PORT=5001;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Good morning')
})

app.use("/api/items", itemRoutes)
app.use("/api/liked", likedRoutes)
app.use("/api/orders", ordersRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is listening at port ${PORT}`);
    
})