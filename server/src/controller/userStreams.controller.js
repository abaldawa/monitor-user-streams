/**
 * User: abhijit.baldawa
 *
 * This module exposes userStreams controller method's which are connected to /canWatch and /stopWatching REST endpoints
 */

const
    UserStreamsModel = require('../database/models/userStreams.model'),
    {formatPromiseResult} = require('../utils/index.utils'),
    logger = require('../logger/index.logger');

/**
 * @method PUBLIC
 * @RestApi POST /canWatch/:userId
 *
 * This method checks whether the user with userId can watch a video stream. If number of concurrent streams
 * for this user is <= 3 then the user can watch else the user cannot watch
 *
 * An example output response is as below:
 * {canWatch: <Boolean>}
 *
 * @param {Object} req Express request object
 * @param {string} req.params.userId userId whose number of number of streams needs to be checked.
 * @param {Object} res Express response object
 * @returns {Promise<void>}
 */
async function canWatch( req, res ) {
    const
        {userId} = req.params || {};

    let
        err,
        userObj;

    if( !userId || typeof userId !== "string" ) {
        return res.status(400).json({canWatch: false, message: `Missing 'userId' from the request body.`});
    }

    [err, userObj] = await formatPromiseResult( UserStreamsModel.getUserStreamObj({userId}) );

    if(err) {
        return res.status(500).json({canWatch: false, message: err});
    }

    if(!userObj) {
        return res.status(404).json({canWatch: false, message: `userId: ${userId} not found`});
    }

    if( userObj.noOfStreams < 3 ) {
        [err] = await formatPromiseResult( UserStreamsModel.updateConcurrentUserStreams({userId}) );

        if( err ) {
            return res.status(500).json({canWatch: false, message: err});
        }

        return res.json({canWatch: true})
    }

    return res.status(403).json({canWatch: false, message: `Concurrent stream limit exceeded. Only 3 concurrent streams are allowed`});
}

/**
 * @method PUBLIC
 * @RestApi POST /stopWatching/:userId
 *
 * This method reduces the count of concurrent videos the user with userId is watching.
 *
 * An example output response is as below:
 * {
 *    userId: <String>,
 *    noOfStreams: <Number>
 * }
 *
 * @param {Object} req Express request object
 * @param {string} req.params.userId userId whose number of number of streams needs to be reduced by 1.
 * @param {Object} res Express response object
 * @returns {Promise<void>}
 */
async function stopWatching( req, res ) {
    const
        {userId} = req.params || {};

    let
        err,
        userObj;

    if( !userId || typeof userId !== "string" ) {
        return res.status(400).send(`Missing 'userId' from the request body.`);
    }

    [err, userObj] = await formatPromiseResult(
                             UserStreamsModel.updateConcurrentUserStreams({
                                 userId,
                                 decrement: true
                             })
                           );

    if(err) {
        return res.status(500).send(err);
    }

    if(!userObj) {
        return res.status(404).send(`userId: ${userId} not found`);
    }

    res.json(userObj);
}

module.exports = {
    canWatch,
    stopWatching
};