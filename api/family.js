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
        const restrictionsQuery = await db('restriction')
            .select(
                'restriction.*',
                'giver.firstName as giverFirstName',
                'giver.lastName as giverLastName',
                'receiver.firstName as receiverFirstName',
                'receiver.lastName as receiverLastName' )
            .join('person as giver', 'restriction.giverId', '=', 'giver.id')
            .join('person as receiver', 'restriction.receiverId', '=', 'receiver.id')
            .where({ 'restriction.familyId': req.params.familyId });
        const restrictions = restrictionsQuery.map(e => {
            return {
                giver: {
                    id: e.giverId,
                    firstName: e.giverFirstName,
                    lastName: e.giverLastName,
                },
                receiver: {
                    id: e.receiverId, 
                    firstName: e.receiverFirstName,
                    lastName: e.receiverLastName,
                },
            }});

        res.send({ family, members, restrictions });
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

module.exports = apiFamily;
