const express = require('express');
const apiFamily = express.Router();

const db = require('../util/db');
const handleError = require('../util/handleError');


apiFamily.get('/:familyId', async (req, res) => {
    try {
        let family = await db('family')
            .where({ id: req.params.familyId })
            .first();
        res.send(family);
    } catch (err) {
        handleError(err, res);
    }
});

apiFamily.post('/', async (req, res) => {
    try {
        const family = {
            name: req.body.familyName
        };

        await db('family').insert(family);
        res.send(family);
    }
    catch (err) {
        handleError(err, res);
    }
});

apiFamily.put('/:familyId', async (req, res) => {
    try {
        const family = {
            id: req.body.familyId,
            name: req.body.familyName,
        };

        await db('family')
            .update(family)
            .where({ id: req.params.familyId })
            .first();
        res.send(family);
    }
    catch (err) {
        handleError(err, res);
    }
});

apiFamily.get('/:familyId/members', async (req, res) => {
    try {
        let familyMembers = await db('family')
            .select('person.*')
            .join('person', 'family.id', '=', 'person.familyId')
            .where({ 'family.id': req.params.familyId });
        res.send(familyMembers);
    } catch (err) {
        handleError(err, res);
    }
});

module.exports = apiFamily;
