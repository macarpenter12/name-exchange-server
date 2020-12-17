const DB_ADDRESS = 'mongodb://localhost:27017/name-exchange'
const mongoose = require('mongoose')

const Family = require('./family')
const RMap = require('./rmap')

const initMongoose = () => {
  mongoose.connect(DB_ADDRESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

module.exports = {
  initMongoose,
  Family,
  RMap
}
