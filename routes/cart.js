const express = require('express');
const router = express.Router();

const {placeOrder,validateOrder} = require('../controllers/cart');
router.route('/').post(placeOrder)
router.route('/validate').post(validateOrder);

module.exports = router;