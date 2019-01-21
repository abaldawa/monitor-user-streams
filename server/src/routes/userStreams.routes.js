/**
 * User: abhijit.baldawa
 *
 * This module is a standard express router config file
 */

const
    express = require('express'),
    router = express.Router(),
    UserStreamsController = require('../controller/userStreams.controller');

router.post('/canWatch/:userId', [
    UserStreamsController.canWatch
]);

router.post('/stopWatching/:userId', [
    UserStreamsController.stopWatching
]);

module.exports = router;
