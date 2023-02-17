const cors = require('cors')
const express = require('express');

const item = require('./routers/item.router');
const transaction = require('./routers/transaction.router')

const app = express()

require('dotenv').config();

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
	res.send('hello')
})

app.use(express.urlencoded({ extended:true }))
app.use(express.json())
app.use(cors())

app.use(item)
app.use(transaction)

app.listen(port, () => {
	console.log(`connected on http://localhost:${port}`);
})
