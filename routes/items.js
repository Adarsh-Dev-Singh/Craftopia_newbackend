const express = require('express');
const router = express.Router();

const {cartItems, deleteItem, updateItem, createItem } = require('../controllers/items');
router.route('/').get(cartItems).post(createItem);
router.route('/:id').patch(updateItem).delete(deleteItem);

module.exports = router;