const express = require('express');
const apiPerson = express.Router();

const db = require('../util/db');
const handleError = require('../util/handleError');

apiPerson.get('/:personId', async (req, res) => {
    try {
        let person = await db('person')
            .where({ id: req.params.personId })
            .first();
        res.send(person);
    } catch (err) {
        handleError(err, res);
    }
});

apiPerson.post('/', async (req, res) => {
    try {
        const person = {
            familyId: req.body.familyId,
            name: req.body.firstName,
        };

        await db('person')
            .insert(person);
        res.send(person);
    }
    catch (err) {
        handleError(err, res);
    }
});

apiPerson.put('/:personId', async (req, res) => {
    try {
        const person = {
            id: req.body.personId,
            familyId: req.body.familyId,
            name: req.body.firstName,
        };

        await db('person')
            .where({ id: req.params.personId })
            .first()
            .update(person);
        res.send(person);
    }
    catch (err) {
        handleError(err, res);
    }
});

module.exports = apiPerson;
