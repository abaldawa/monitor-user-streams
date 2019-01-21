/**
 * User: abhijit.baldawa
 */
const
    express = require('express'),
    app = express(),
    userStreamsRouter = require('./routes/userStreams.routes'),
    {httpServer} = require('./config/serverConfig'),
    logger = require('./logger/index.logger');


/**
 * Immediately invoking async method which does all the standard server startup routine.
 */
(async () =>{
    let
        err,
        result;

    // --------------------- 1. Add all the required express middleware ---------------------
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/', userStreamsRouter);
    // ---------------------------- 1. END -------------------------------------------------

    // -------------------- 2. initialize database -----------------------------------------
    /**
     * Because we are using in-memory DB there is not DB client in this case.
     */
    // -------------------- 2. END --------------------------------------------------------


    // ------------------- 3. Start Http Server -------------------------------------------
    await new Promise((resolve, reject) => {
            app.listen(httpServer.port, () => {
                resolve();
            });
          });

    logger.info(`Server is listening on port = ${httpServer.port}`);
    // -------------------- 3. END -------------------------------------------------------
})();