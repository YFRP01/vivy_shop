import express from 'express'
import path from "path"
import cors from 'cors'
import itemRoutes from "./routes/items.js"
import likedRoutes from "./Routes/liked.js"
import ordersRoutes from "./Routes/orders.js"
import categoriesRoutes from "./Routes/categories.js"
import infoRoutes from "./routes/info.js"
import likedNotifRoutes from "./routes/liked_notifications.js"

import dotenv from 'dotenv'
dotenv.config();

const PORT=5001;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"))

app.get('/', (req,res)=>{
    res.send('Good morning')
})

app.use("/api/items", itemRoutes)
app.use("/api/liked", likedRoutes)
app.use("/api/orders", ordersRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/infos", infoRoutes)
app.use("/api/liked_notifications", likedNotifRoutes)


app.listen(PORT, ()=>{
    console.log(`Server is listening at port ${PORT}`);
    
})