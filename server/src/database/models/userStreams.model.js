/**
 * User: abhijit.baldawa
 *
 * This module exposes methods to interact with the DB
 */

const
    inMemoryDbArr = require('../mock_db/inMemoryDb'),
    {formatPromiseResult} = require('../../utils/index.utils');

/**
 * @method PUBLIC
 *
 * This method returns the userStream object based on provided userId
 *
 * @param {Object} args
 * @param {String} args.userId userId to query
 *
 * @returns {Promise<{userId: <String>, noOfStreams: <Number>}>}
 */
async function getUserStreamObj( args = {} ) {
    const
        {userId} = args;

    if( !userId ) {
        throw Error("Missing userId");
    }

    for( const userStreamObj of inMemoryDbArr ) {
        if( userStreamObj.userId === userId ) {
            return userStreamObj;
        }
    }
}

/**
 * @method PUBLIC
 *
 * This method increments/decrements noOfStreams for a user based on 'args.decrement' flag
 *
 * @param {Object} args
 * @param {String} args.userId userId whose noOfStreams needs to be updated
 * @param {Boolean} [args.decrement] If present means decrease the count of noOfStreams else increase. Default = false
 *
 * @returns {Promise<{userId: <String>, noOfStreams: <Number>}>}
 */
async function updateConcurrentUserStreams( args = {} ) {
    const
        {userId, decrement = false } = args;

    let
        err,
        userObj;

    if( !userId ) {
        throw Error("Missing userId");
    }

    [err, userObj] = await formatPromiseResult( getUserStreamObj( {userId} ) );

    if(err) {
        throw err;
    }

    if( userObj ) {
        if(decrement) {
            userObj.noOfStreams = (userObj.noOfStreams > 0) ? userObj.noOfStreams - 1 : 0;
        } else {
            userObj.noOfStreams++;
        }

        return userObj;
    }
}

module.exports = {
    getUserStreamObj,
    updateConcurrentUserStreams
};