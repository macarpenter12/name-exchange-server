const _ = require('lodash');

const express = require('express');
const apiDrawNames = express.Router();

const db = require('../db/db');
const handleError = require('../util/handleError');


apiDrawNames.post('/:familyId', async (req, res) => {
    try {
        const allMembers = await db('person')
            .where({ familyId: req.params.familyId });
        const allRestrictions = await db('restriction')
            .where({ familyId: req.params.familyId });
        
        // populate members
        const members = {};
        for (let giver of allMembers) {
            members[giver.id] = [];
            for (let receiver of allMembers) {
                if (giver.id !== receiver.id) {
                    members[giver.id].push(receiver.id);
                }
            }
        }

        // remove restricted combinations
        for (let restriction of allRestrictions) {
            _.remove(members[restriction.giverId], e => e === restriction.receiverId);
        }

        // create assignments
        // order from least available assignments to most to maximize chance of success
        let solution = {};
        let orderedGivers = Object.keys(members).sort((a, b) => {
            return members[a].length - members[b].length;
        });
        for (let giver of orderedGivers) {
            let receivers = members[giver];
            if (receivers.length === 0) {
                throw 'Hit a dead end. Try a few more times, or try removing restrictions to improve chances of success.';
            }

            // randomly assign
            let receiver = receivers[Math.floor(Math.random() * receivers.length)];
            solution[giver] = receiver;

            // remove receiver from other lists so they don't get picked again
            for (let otherGiver in members) {
                _.remove(members[otherGiver], e => e === receiver);
            }
        }

        let memberLookup = {};
        for (let member of allMembers) {
            memberLookup[member.id] = member;
        }

        const result = [];
        for (let giverId in solution) {
            let giver = memberLookup[giverId];
            let receiver = memberLookup[solution[giverId]];
            result.push({
                giver,
                receiver,
            });
        }

        res.send(result);
    } catch (err) {
        handleError(err, res);
    }
});

module.exports = apiDrawNames;
