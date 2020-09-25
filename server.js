const PORT_NUMBER = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const DB_ADDRESS = 'mongodb://localhost:27017/name-exchange';
const mongoose = require('mongoose');
mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const familySchema = new mongoose.Schema({
  name: String,
  members: [{
    name: String,
    assignment: String
  }],
  restrictions: [{
    giver: String,
    recipient: String
  }]
});

const restrictionMapSchema = new mongoose.Schema({
  familyName: String,
  members: {}
});

const Family = mongoose.model('Family', familySchema);

app.listen(PORT_NUMBER);
console.log('Server listening on port', PORT_NUMBER);

/*
 * A Restriction Map (RMap) contains keys representing members of a family known as "givers"
 * who will be assigned to give a gift to another person and "recipients" who will be assigned
 * to receive a gift from the corresponding giver.
 * 
 * This map allows for O(1) lookup of restrictions, rather than searching the family
 * object every time a selection is being made.
 */
const RMap = mongoose.model('RMap', restrictionMapSchema);



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *    CRUD operations for family entities
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

app.get('/api/family/:familyName', async (req, res) => {
  try {
    let family = await getFamilyByName(req.params.familyName);
    res.send({ 'family': family });
  }
  catch (err) { handleError(err, res); }
});

app.post('/api/family/', async (req, res) => {
  try {
    console.log('/api/family/');
    console.log(req.body);
    const family = new Family(req.body.family);
    await family.save();
    res.send({ 'family': family });
  }
  catch (err) { handleError(err, res); }
});

app.put('/api/family/:familyName', async (req, res) => {
  try {
    const familyQuery = { name: req.params.familyName };
    await Family.updateOne(familyQuery, req.body.family);
    updateRmap(req.params.familyName);
    res.status(200).send('Successfully updated', req.body.family.name, 'family.');
  }
  catch (err) { handleError(err, res); }
});



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *    Name draw function
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

 /*
  * 
  */
app.post('/api/draw/:familyName', async (req, res) => {
  // TODO: Sort the members by the number of restrictions they have before drawing...
  // TODO: Remove recipients from all rmap entries (for...in) after each selection...

  try {
    const rmap = getRmapByFamilyName(req.params.familyName);
    let family = getFamilyByName(req.params.familyName);

    // Initialize the set of chosen members. Index by member name for O(1) lookup.
    let chosenMembers = {};
    family.members.forEach(member => {
      chosenMembers[member.name] = false;
    });

    // Draw a name for each member
    family.members.forEach(member => {
      const availableMembers = rmap[member.name];
      // Choose a random recipient from the list of available recipients.
      // If that recipient has been chosen already, choose another random recipient.
      let recipient;
      do {
        recipient = chooseRandomMember(availableMembers);
      } while (chosenMembers[recipient.name]);
      member.assignment = recipient.name;
    });

    res.status(200).send(family);
  }
  catch (err) {
    handleError(err, res);
  }
});



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
async function getFamilyByName(familyName) {
  try {
    let family = await Family.findOne({ name: familyName });
    return family;
  }
  catch (err) {
    throw err;
  }
};

async function getRmapByFamilyName(familyName) {
  try {
    const rmap = await RMap.findOne({ 'familyName': familyName });
    return rmap;
  }
  catch (err) {
    throw err;
  }
}

/* 
 * initRmap: creates a new RMap for the given family.
 *  arguments:
 *    familyName: the name of the family to create an RMap for.
 * 
 *  return: sends an HTTP response using the Node response object indicating the operation's success
 *  or failure.
 */
async function initRmap(familyName) {
  try {
    const family = getFamilyByName(familyName);
    let rmap = new RMap({ 'familyName': familyName });


    await rmap.save();
    res.status(200).send('Successfully initialized restriction map.');
  }
  catch (err) {
    throw err;
  }
};

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
    const family = getFamilyByName(familyName);
    let rmap = {
      'familyName': familyName,
      members: {}
    };
    
    // Add all members to RMap
    family.members.forEach(member => {
      rmap[member.name] = members;
    });

    // Remove recipients from map according to restrictions
    family.restrictions.forEach(restriction => {
      rmap[restriction.giver].filter(member => {
        member.name !== restriction.recipient;
      });
    })

    const rmapQuery = { 'familyName': familyName };
    await RMap.updateOne(rmapQuery, rmap);
    return rmap;
  }
  catch (err) {
    throw err;
  }
}

function chooseRandomMember(members) {
  return members[Math.floor(Math.random * members.length)];
}


/*
 * handleError: defines the default behavior for handling internal exceptions.
 *  arguments:
 *    err: the exception that was thrown.
 *    res: the Node response object, which will be used to return a HTTP response.
 * 
 *  return: sends an HTTP response through the given Node response object.
 */
function handleError(err, res) {
  console.log(err);
  res.status(500).send(err.message);
}
