const express = require('express');
const apiFamily = express.Router();

const db = require('../db/db');
const handleError = require('../util/handleError');


apiFamily.get('/:familyId', async (req, res) => {
    try {
        const family = await db('family')
            .where({ 'id': req.params.familyId })
            .first();
        const members = await db('person')
            .where({ 'familyId': req.params.familyId });
        res.send({ family,members });
    } catch (err) {
        handleError(err, res);
    }
});

apiFamily.post('/:familyId', async (req, res) => {
    try {
        const family = {
            id: req.params.familyId,
            name: req.body.familyName,
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

module.exports = apiFamily;
