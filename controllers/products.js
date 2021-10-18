const Product = require('../models/product')


const getAllProductsStatic = async (req, res) => {
    // throw new Error('test async errors')
    const products = await Product.find({
        price: { $gt: 30 }
    }).sort('price').select('name price')
    res.status(200).json({ products, nbHits: products.length, })
}

const getAllProducts = async (req, res) => {
    // выводит массив с данными, которые были введены внутри url 
    // http://127.0.0.1:3000/api/v1/products?name=jonh&featured=true
    // { name: 'jonh', featured: 'true' }
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }

    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
        console.log(filters)
        const option = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if(option.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    }


    console.log(queryObject)
    let result = Product.find(queryObject).sort()
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    } else {
        result = result.sort('createAt')
    }

    if (fields) {
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)



    const products = await result
    res.status(200).json({ products, nbHits: products.length, })
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}