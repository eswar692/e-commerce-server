const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotEnv = require('dotenv').config()
const port = 5000 || process.env.port
const cors = require('cors');
const cookieParser = require('cookie-parser')
app.use(cors({
    origin: 'http://localhost:5174', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true  
}));
app.use(cookieParser())
app.use(express.json())

mongoose.connect(process.env.mongo_url)
.then(()=>{console.log('DB connected')})

app.listen(port,()=>{
    console.log('server running .....')
})
