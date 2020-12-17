const express = require('express')
const router = express.Router()

router.post('/api/draw/:familyName', async (req, res) => {
  // TODO: Sort the members by the number of restrictions they have before drawing...
  // TODO: Remove recipients from all rmap entries (for...in) after each selection...

  try {
    const rmap = getRmapByFamilyName(req.params.familyName)
    let family = getFamilyByName(req.params.familyName)

    // Initialize the set of chosen members. Index by member name for O(1) lookup.
    let chosenMembers = {}
    family.members.forEach(member => {
      chosenMembers[member.name] = false
    })

    // Draw a name for each member
    family.members.forEach(member => {
      const availableMembers = rmap[member.name]
      // Choose a random recipient from the list of available recipients.
      // If that recipient has been chosen already, choose another random recipient.
      let recipient
      do {
        recipient = chooseRandomMember(availableMembers)
      } while (chosenMembers[recipient.name])
      member.assignment = recipient.name
    })

    res.status(200).send(family)
  }
  catch (err) {
    handleError(err, res)
  }
})

module.exports = router
