const express = require('express');
const api = express.Router();

api.use('/family/', require('./family'));
api.use('/person/', require('./person'));
api.use('/restriction', require('./restriction'));
api.use('/draw', require('./drawNames'));

module.exports = api;
