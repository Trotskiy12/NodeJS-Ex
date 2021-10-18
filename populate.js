// динамическое добавление данных в бд
require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProducts = require('./products.json')


const start = async () => {
    try{
        await connectDB('mongodb+srv://daniil:z6uxe4ZomN4V1WEZ@cluster0.2xchy.mongodb.net/STORE_API?retryWrites=true&w=majority')
        await Product.deleteMany()
        await Product.create(jsonProducts)
        console.log('Success')
        process.exit(0)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

start()