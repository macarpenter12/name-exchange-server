const PORT_NUMBER = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const db = require('./db/db');
app.set('db', db);

app.use('/api/', require('./api/'));

app.listen(PORT_NUMBER);
console.log('Server listening on port', PORT_NUMBER);
