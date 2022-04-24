const express = require('express');
const api = express.Router();

api.use('/family/', require('./family'));
api.use('/person/', require('./person'));

module.exports = api;
