const express = require('express')
const bodyParser = require('body-parser')
const PORT_NUMBER = 3000

const db = require('./dao')

const app = express()
const routes = require('./routes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', routes)

db.init()

app.listen(PORT_NUMBER)
console.log('Server listening on port', PORT_NUMBER)
