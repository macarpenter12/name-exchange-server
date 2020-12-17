const express = require('express')
const router = express.Router()

const family = require('./family')
const draw = require('./draw')

router.use('/family', family)
router.use('./draw', draw)

module.exports = router
