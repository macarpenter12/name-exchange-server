const mongoose = require('mongoose')
const Person = require('./person')

const familySchema = new mongoose.Schema({
  name: String,
  members: [ Person ]
})

const FamilyModel = mongoose.model('Family', familySchema)

/*
 * getFamilyByName: calls Mongoose/MongoDB to retrieve a family entity given the family name.
 *  arguments:
 *    familyName: the name of the family to find in the database.
 *
 *  return: the family from the database matching the given name.
 */
const getFamilyByName = async (familyName) => {
  try {
    let family = await Family.findOne({ name: familyName })
    return family
  }
  catch (err) {
    throw err
  }
}

function chooseRandomMember(members) {
  return members[Math.floor(Math.random * members.length)]
}

module.exports = {
  FamilyModel,
  getFamilyByName,
  chooseRandomMember
}
