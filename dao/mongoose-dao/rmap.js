const mongoose = require('mongoose')

/*
 * A Restriction Map (RMap) contains keys representing members of a family known as "givers"
 * who will be assigned to give a gift to another person and "recipients" who will be assigned
 * to receive a gift from the corresponding giver.
 * 
 * This map allows for O(1) lookup of restrictions, rather than searching the family
 * object every time a selection is being made.
 */

const restrictionMapSchema = new mongoose.Schema({
  familyName: String,
  members: {}
})

const RMap = mongoose.model('RMap', restrictionMapSchema)

const getRmapByFamilyName = async (familyName) => {
  try {
    const rmap = await RMap.findOne({ 'familyName': familyName })
    return rmap
  }
  catch (err) {
    throw err
  }
}

/*
 * updateRmap: reinitizalizes the RMap for a given family, updating the listed restrictions given
 *    the "restrictions" property of the given family.
 *  arguments:
 *    familyName: the name of the family, whose RMap should be updated.
 * 
 *  return: returns the updated RMap object.
 */
async function updateRmap(familyName) {
  try {
    const family = getFamilyByName(familyName)
    let rmap = {
      'familyName': familyName,
      members: {}
    }
    
    // Add all members to RMap
    family.members.forEach(member => {
      rmap[member.name] = members
    })

    // Remove recipients from map according to restrictions
    family.restrictions.forEach(restriction => {
      rmap[restriction.giver].filter(member => {
        member.name !== restriction.recipient
      })
    })

    const rmapQuery = { 'familyName': familyName }
    await RMap.updateOne(rmapQuery, rmap)
    return rmap
  }
  catch (err) {
    throw err
  }
}

module.exports = {
  RMap,
  getRmapByFamilyName,
  updateRmap
}
