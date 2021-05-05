const fs = require('fs')

module.exports = {
    getProducts: (req, res) => {
        let products = JSON.parse(fs.readFileSync('./data/products.json'))
        res.status(200).send(products)
    }
}