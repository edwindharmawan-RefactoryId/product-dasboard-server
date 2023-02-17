const item = require('express').Router()
const { itemList, createItem, updateItem, deleteItem } = require('../controllers/item.controller')

item.get('/items', itemList)
item.post('/item', createItem)
item.put('/item/:id', updateItem)
item.delete('/item/:id', deleteItem)

module.exports = item