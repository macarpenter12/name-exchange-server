const express = require('express')
const router = express.Router()

const handleError = require('../helpers/handleError')
const { Family, RMap } = require('../dao')
const { FamilyModel, getFamilyByName } = Family
const { updateRmap } = RMap

router.get(':familyName', async (req, res) => {
  try {
    let family = await getFamilyByName(req.params.familyName)
    res.send({ 'family': family })
  }
  catch (err) { handleError(err, res) }
})

router.post('/', async (req, res) => {
  try {
    const family = new Family({
      name: req.body.family.name,
      members: [],
      restrictions: []
    })
    await family.save()
    res.send({ 'family': family })
  }
  catch (err) { handleError(err, res) }
})

router.put(':familyName', async (req, res) => {
  try {
    const familyQuery = { name: req.params.familyName }
    await FamilyModel.updateOne(familyQuery, req.body.family)
    updateRmap(req.params.familyName)
    res.status(200).send('Successfully updated', req.body.family.name, 'family.')
  }
  catch (err) { handleError(err, res) }
})

module.exports = router
