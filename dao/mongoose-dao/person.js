const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  assignment: String,
  availableAssignments: [String]
})

const PersonModel = mongoose.model('Person', personSchema)

module.exports = {
  PersonModel
}
