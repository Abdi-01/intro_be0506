const express = require('express')
const { productsController } = require('../controllers')
const router = express.Router()

router.get('/get-data', productsController.getProducts)

module.exports = router