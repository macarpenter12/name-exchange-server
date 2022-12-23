const express = require('express');
const apiRestriction = express.Router();

const db = require('../db/db');
const handleError = require('../util/handleError');

apiRestriction.post('/', async (req, res) => {
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
