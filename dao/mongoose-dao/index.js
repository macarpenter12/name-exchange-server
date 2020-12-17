const DB_ADDRESS = 'mongodb://localhost:27017/name-exchange'
const mongoose = require('mongoose')

const FamilyDao = require('./family')
const PersonDao = require('./person')
const RMap = require('./rmap')

const initMongoose = () => {
  mongoose.connect(DB_ADDRESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

module.exports = {
  initMongoose,
  FamilyDao,
  PersonDao,
  RMap
}
