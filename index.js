const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotEnv = require('dotenv').config()
const port =  process.env.port || 5000
const cors = require('cors');
const cookieParser = require('cookie-parser')
const {connectRedis} = require('./utils/redisClient')

connectRedis()


app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true  
}));
app.use(cookieParser())
app.use(express.json())
const userRouter = require('./routes/userRoutes')

app.use('/user',userRouter)

mongoose.connect(process.env.mongo_url)
.then(()=>{console.log('DB connected')})

app.listen(port,()=>{
    console.log(`server running port:${port}.....`)
})
