/**
 * User: abhijit.baldawa
 */

const
    express = require('express'),
    request = require('supertest'),
    userStreamsRouter = require('../../src/routes/userStreams.routes'),
    userId = '5c45c32f58cf65b0e40c1f7f',
    invalidUser = 123;

describe('Testing REST endpoints (Integration)', function() {
    let
        app;

    beforeEach(function() {
        app = express();
        app.use('/', userStreamsRouter);
    });

    describe('POST /canWatch/:userId', function() {
        it( `POST /canWatch/${invalidUser} -> Should return 404 error along with error message for invalid userId `,  function(done) {
           request(app.listen())
                .post(`/canWatch/${invalidUser}`)
                .expect(404)
                .expect({ canWatch: false, message: `userId: ${invalidUser} not found` })
                .end(done)
        } );

        it( `POST /canWatch/${userId} -> Should return 200 for a valid user for first stream`,  function(done) {
            request(app.listen())
                .post(`/canWatch/${userId}`)
                .expect(200)
                .expect({ canWatch: true })
                .end(done)
        } );

        it( `POST /canWatch/${userId} -> Should return 200 for a valid user for second concurrent stream`,  function(done) {
            request(app.listen())
                .post(`/canWatch/${userId}`)
                .expect(200)
                .expect({ canWatch: true })
                .end(done)
        } );

        it( `POST /canWatch/${userId} -> Should return 200 for a valid user for third concurrent stream`,  function(done) {
            request(app.listen())
                .post(`/canWatch/${userId}`)
                .expect(200)
                .expect({ canWatch: true })
                .end(done)
        } );

        it( `POST /canWatch/${userId} -> Should return 403 along with error message for stream exceeding limit of 3 concurrent streams`,  function(done) {
            request(app.listen())
                .post(`/canWatch/${userId}`)
                .expect(403)
                .expect({ canWatch: false, message: `Concurrent stream limit exceeded. Only 3 concurrent streams are allowed` })
                .end(done)
        } );
    });


    describe('POST /stopWatching/:userId', function() {
        it( `POST /stopWatching/${invalidUser} -> Should return 404 error along with error message for invalid userId `,  function(done) {
           request(app.listen())
                .post(`/stopWatching/${invalidUser}`)
                .expect(404)
                .expect(`userId: ${invalidUser} not found`)
                .end(done)
        } );

        it( `POST /stopWatching/${userId} -> Should return 200 for a valid user and returns a userStreamObj with userStreamObj.noOfStreams = 2`,  function(done) {
            request(app.listen())
                .post(`/stopWatching/${userId}`)
                .expect(200)
                .expect({ userId, noOfStreams: 2 })
                .end(done)
        } );

        it( `POST /stopWatching/${userId} -> Should return 200 for a valid user and returns a userStreamObj with userStreamObj.noOfStreams = 1`,  function(done) {
            request(app.listen())
                .post(`/stopWatching/${userId}`)
                .expect(200)
                .expect({ userId, noOfStreams: 1 })
                .end(done)
        } );

        it( `POST /stopWatching/${userId} -> Should return 200 for a valid user and returns a userStreamObj with userStreamObj.noOfStreams = 0`,  function(done) {
            request(app.listen())
                .post(`/stopWatching/${userId}`)
                .expect(200)
                .expect({ userId, noOfStreams: 0 })
                .end(done)
        } );
    });
});