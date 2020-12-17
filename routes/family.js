const express = require('express')
const router = express.Router()

const handleError = require('../helpers/handleError')
const { FamilyDao } = require('../dao')
const { FamilyModel, getFamilyByName } = FamilyDao

router.get('/:familyName', async (req, res) => {
  try {
    const family = await getFamilyByName(req.params.familyName)
    res.send({ family: family })
  }
  catch (err) { handleError(err, res) }
})

router.post('/', async (req, res) => {
  try {
    const family = new FamilyModel({
      name: req.body.family.name,
      members: []
    })
    await family.save()
    res.send({ family: family })
  }
  catch (err) { handleError(err, res) }
})

router.post('/:familyName/members', async (req, res) => {
  try {
    const family = await getFamilyByName(req.params.familyName)
    const person = req.body.person
    family.members.push(person)
    await family.save()
    res.send({ family: family })
  }
  catch (err) { handleError(err, res) }
})

module.exports = router
