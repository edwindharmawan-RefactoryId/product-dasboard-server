const transaction = require('express').Router()

const { getItemTransactions } = require('../controllers/transaction.controller')

transaction.get('/transactions/:id', getItemTransactions)

module.exports = transaction