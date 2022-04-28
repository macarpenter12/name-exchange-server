const PORT_NUMBER = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api/', require('./api/'));

app.listen(PORT_NUMBER);
console.log('Server listening on port', PORT_NUMBER);


// app.post('/api/draw/:familyName', async (req, res) => {
//   // TODO: Sort the members by the number of restrictions they have before drawing...
//   // TODO: Remove recipients from all rmap entries (for...in) after each selection...

//   try {
//     const rmap = getRmapByFamilyName(req.params.familyName);
//     let family = getFamilyByName(req.params.familyName);

//     // Initialize the set of chosen members. Index by member name for O(1) lookup.
//     let chosenMembers = {};
//     family.members.forEach(member => {
//       chosenMembers[member.name] = false;
//     });

//     // Draw a name for each member
//     family.members.forEach(member => {
//       const availableMembers = rmap[member.name];
//       // Choose a random recipient from the list of available recipients.
//       // If that recipient has been chosen already, choose another random recipient.
//       let recipient;
//       do {
//         recipient = chooseRandomMember(availableMembers);
//       } while (chosenMembers[recipient.name]);
//       member.assignment = recipient.name;
//     });

//     res.status(200).send(family);
//   }
//   catch (err) {
//     handleError(err, res);
//   }
// });



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *    Helper functions
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 * getFamilyByName: calls Mongoose/MongoDB to retrieve a family entity given the family name.
 *  arguments:
 *    familyName: the name of the family to find in the database.
 *
 *  return: the family from the database matching the given name.
 */
// async function getFamilyByName(familyName) {
//   try {
//     let family = await Family.findOne({ name: familyName });
//     return family;
//   }
//   catch (err) {
//     throw err;
//   }
// };

// async function getRmapByFamilyName(familyName) {
//   try {
//     const rmap = await RMap.findOne({ 'familyName': familyName });
//     return rmap;
//   }
//   catch (err) {
//     throw err;
//   }
// }

/*
 * updateRmap: reinitizalizes the RMap for a given family, updating the listed restrictions given
 *    the "restrictions" property of the given family.
 *  arguments:
 *    familyName: the name of the family, whose RMap should be updated.
 * 
 *  return: returns the updated RMap object.
 */
// async function updateRmap(familyName) {
//   try {
//     const family = getFamilyByName(familyName);
//     let rmap = {
//       'familyName': familyName,
//       members: {}
//     };
    
//     // Add all members to RMap
//     family.members.forEach(member => {
//       rmap[member.name] = members;
//     });

//     // Remove recipients from map according to restrictions
//     family.restrictions.forEach(restriction => {
//       rmap[restriction.giver].filter(member => {
//         member.name !== restriction.recipient;
//       });
//     })

//     const rmapQuery = { 'familyName': familyName };
//     await RMap.updateOne(rmapQuery, rmap);
//     return rmap;
//   }
//   catch (err) {
//     throw err;
//   }
// }

// function chooseRandomMember(members) {
//   return members[Math.floor(Math.random * members.length)];
// }
