/**
 * User: abhijit.baldawa
 */

const
    UserStreamsModel = require('../../../../src/database/models/userStreams.model'),
    userId = '5c45c32f58cf65b0e40c1f7f';

let
    userStreamObj;

describe('userStreams.model Testing', function() {
    describe('#getUserStreamObj()', function() {
        it( `Should throw error if 'userId' is not passed`, async function() {
            try{
                await UserStreamsModel.getUserStreamObj({});
            } catch(e) {
                expect(e).to.be.an('Error');
                expect(e.message).to.equal('Missing userId');
            }
        } );

        it( `Should return undefined for invalid 'userId'`, async function() {
            const userObj = await UserStreamsModel.getUserStreamObj({userId: '123'});
            expect(userObj).to.equal(undefined);
        } );

        it( `Should return user stream object for valid 'userId'`, async function() {
            const userObj = await UserStreamsModel.getUserStreamObj({userId});

            expect(userObj).to.be.an('object');
            expect(userObj).to.have.property( 'userId').that.is.a('string');
            expect(userObj).to.have.property( 'noOfStreams').that.is.a('number');

            userStreamObj = userObj;
        } );
    });

    describe('#updateConcurrentUserStreams()', function() {
        it( `Should throw error if 'userId' is not passed`, async function() {
            try{
                await UserStreamsModel.updateConcurrentUserStreams({});
            } catch(e) {
                expect(e).to.be.an('Error');
                expect(e.message).to.equal('Missing userId');
            }
        } );

        it( `Should return undefined for invalid 'userId'`, async function() {
            const userObj = await UserStreamsModel.updateConcurrentUserStreams({userId: '123'});
            expect(userObj).to.equal(undefined);
        } );

        it( `Should increment the 'noOfStreams' property for valid userId`, async function() {
            const userObj = await UserStreamsModel.updateConcurrentUserStreams({userId});

            expect(userObj).to.be.an('object');
            expect(userObj).to.have.property( 'userId').that.is.a('string');
            expect(userObj).to.have.property( 'noOfStreams').that.is.a('number');
            expect(userObj).to.have.property( 'noOfStreams').to.equal(1);
        } );

        it( `Should decrement the 'noOfStreams' property for valid userId if 'args.decrement' = true`, async function() {
            const userObj = await UserStreamsModel.updateConcurrentUserStreams({userId, decrement: true});

            expect(userObj).to.be.an('object');
            expect(userObj).to.have.property( 'userId').that.is.a('string');
            expect(userObj).to.have.property( 'noOfStreams').that.is.a('number');
            expect(userObj).to.have.property( 'noOfStreams').to.equal(0);
        } );
    });
});