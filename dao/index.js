const { initMongoose, FamilyModel, PersonModel, RMap } = require('./mongoose-dao')

module.exports = {
  init: initMongoose,
  FamilyModel,
  PersonModel,
  RMap
}
