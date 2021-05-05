// API menggunakan express JS
const express = require('express')
const app = express()
const PORT = 4000
const fs = require('fs')

app.use(express.json()) // untuk menangkap data dari req body url

app.get('/', (req, res) => {
    res.status(200).send('<h1>Intro Express API</h1>')
})

const { productsRouter } = require('./routers')
app.use('/products', productsRouter)


// app.get('/products', (req, res) => {
//     let products = JSON.parse(fs.readFileSync('./data/products.json'))
//     res.status(200).send(products)
// })

app.post('/products', (req, res) => {
    let products = JSON.parse(fs.readFileSync('./data/products.json'))
    console.log(req.body)
    req.body.id = products.length + 1
    products.push(req.body)

    fs.writeFileSync('./data/products.json', JSON.stringify(products))
    res.status(200).send(products)
})

app.delete('/products/:id', (req, res) => {
    let products = JSON.parse(fs.readFileSync('./data/products.json'))
    let idx = products.findIndex(item => item.id == req.params.id)
    if (idx < 0) {
        res.status(500).send('Product unavailable')
    }

    // Menghapus data
    products.splice(idx, 1)

    fs.writeFileSync('./data/products.json', JSON.stringify(products))
    res.status(200).send(products)
})

app.listen(PORT, () => console.log("Server Running :", PORT))