const express = require('express');
const apiRestriction = express.Router();

const db = require('../db/db');
const handleError = require('../util/handleError');


apiRestriction.post('/', async (req, res) => {
    if (req.body.giverId === req.body.receiverId) {
        handleError('Giver and reciever must be different', res, 400);
        return;
    }

    try {

        const restriction = {
            familyId: req.body.familyId,
            giverId: req.body.giverId,
            receiverId: req.body.receiverId,
        };

        await db('restriction')
            .insert(restriction)

        res.send(restriction);
    } catch (err) {
        handleError(err, res);
    }
});

apiRestriction.delete('/', async (req, res) => {
    try {
        await db('restriction')
            .where({
                giverId: req.body.giverId,
                receiverId: req.body.receiverId,
            }).del();

        res.send({ success: true });
    } catch (err) {
        handleError(err, res);
    }
});

module.exports = apiRestriction;
