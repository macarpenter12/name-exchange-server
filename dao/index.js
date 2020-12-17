const { initMongoose, Family, RMap } = require('./mongoose-dao')

module.exports = {
  init: initMongoose,
  Family,
  RMap
}
