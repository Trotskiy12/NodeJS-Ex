require('dotenv').config()
require('express-async-errors')
// async errors



const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.json())

// routers

app.get('/', (req,res)=> {
    res.send('<h1>Hello from Store API</h1><a href="/api/v1/products">Products Route</a>')  
})

app.use('/api/v1/products', productsRouter)

// products store

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try{
        // connect to MongoDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listenning port ${port} ....`))
    } catch (error){
        console.log(error)
    }
}

start()

// console.log('04 Store API')
