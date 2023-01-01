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

        const possibleAssignments = constructPossibleAssignments(allMembers, allRestrictions);
        
        // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
        // multiple implementations here for demonstration purposes
        // change the value of the constant DRAW_TYPE to one of the following to witness that implementation:
        const BASIC = 'basic';
        const DYNAMIC_PROGRAAMING = 'dynamic_programming';

        const DRAW_TYPE = DYNAMIC_PROGRAAMING;

        const assignments = {}
        switch (DRAW_TYPE) {
            case BASIC:
                assignments = basicDraw(possibleAssignments);
                break;
            case DYNAMIC_PROGRAAMING:
                assignments = dynamicProgrammingDraw();
                break;
            default:
                throw 'Choose a valid implementation';
        }
        // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

        res.send({
            success: assignments !== null,
            assignments,
        });
    } catch (err) {
        handleError(err, res);
    }
});

function constructPossibleAssignments(members, restrictions) {
    // populate all possible assignments
    const memberIds = members.map(m => m.id);
    const possibleAssignments = members.reduce((assignments, member) => assignments[member.id] = _.cloneDeep(memberIds), {});

    // remove self-assignments
    for (const [giverId, receiverIds] of Object.entries(possibleAssignments)) {
        _.remove(receiverIds, r => r.id === giverId);
    }

    // remove prohibited assignments
    restrictions.forEach(restriction => {
        _.remove(possibleAssignments[restriction.giverId], receiverId => receiverId === restriction.receiverId);
    });

    return possibleAssignments;
}

// basic algorithm to randomly assign each member to another available member
// tries multiple times to increase chances of success
function basicDraw(possibleAssignments) {
    const NUM_DRAW_ATTEMPTS = 10;
    for (let attempts = 0; attempts < NUM_DRAW_ATTEMPTS; attempts++) {
        const solution = {};
        let validSolution = true;

        for (const [giverId, receiverIds] of Object.entries(possibleAssignments)) {
            if (receiverIds.length === 0) {
                // no receivers are available, so this solution cannot be valid
                validSolution = false;
                break;
            }

            // Choose an available receiver at random
            const randomIndex = Math.floor(Math.random() * receiverIds.length);
            const randomReceiverId = receiverIds[randomIndex];
            solution[giverId] = randomReceiverId;

            for (const giverId of Object.keys(possibleAssignments)) {
                _.remove(possibleAssignments[giverId], receiverId => receiverId === randomReceiverId);
            }
        }

        if (validSolution) return solution;
    }

    // failed to find solution within NUM_DRAW_ATTEMPTS
    return null;
}

// uses dynamic programming strategy to eliminate the easiest choices first, reducing the possible solutions of harder choices
// tries a few times just in case
function dynamicProgrammingDraw(possibleAssignments) {
    const NUM_DRAW_ATTEMPTS = 3;
    for (let attempts = 0; attempts < NUM_DRAW_ATTEMPTS; attempts++) {
        const solution = {};
        let validSolution = true;

        // sort members by available receivers, i.e., most restricted choices first
        const orderedGiverIds = Object.keys(possibleAssignments)
            .sort((a, b) => possibleAssignments[a].length - possibleAssignments[b].length);

        for (const giverId of orderedGiverIds) {
            const receiverIds = possibleAssignments[giverId];
            if (receiverIds.length === 0) {
                // no receivers are available, so this solution cannot be valid
                validSolution = false;
                break;
            }

            // Choose an available receiver at random
            const randomIndex = Math.floor(Math.random() * receiverIds.length);
            const randomReceiverId = receiverIds[randomIndex];
            solution[giverId] = randomReceiverId;

            for (const otherReceiverIds of Object.values(possibleAssignments)) {
                _.remove(otherReceiverIds, receiverId => receiverId === randomReceiverId);
            }
        };

        if (validSolution) return solution;
    }

    // failed to find solution within NUM_DRAW_ATTEMPTS
    return null;
    
}

module.exports = apiDrawNames;
