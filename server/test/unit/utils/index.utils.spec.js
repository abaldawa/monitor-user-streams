/**
 * User: abhijit.baldawa
 */

const
    utils = require('../../../src/utils/index.utils');

describe('Utils Testing', function() {
    describe("#formatPromiseResult()", function() {
        it("For rejected promise, should resolve successfully to array containing 1 element which would be error from passed in promise", async function() {
            const outputArr = await utils.formatPromiseResult(
                new Promise((resolve, reject) => {
                    setTimeout(reject, 10, "PROMISE_ERROR");
                })
            );

            expect(outputArr).to.be.a('array');
            expect(outputArr).to.have.lengthOf(1);
            expect(outputArr[0]).to.equal("PROMISE_ERROR")
        });

        it("For successful promise, should resolve successfully to array containing 2 elements. First element should be null and second element should be result of passed in promise", async function() {
            const outputArr = await utils.formatPromiseResult(
                new Promise((resolve, reject) => {
                    setTimeout(resolve, 10, "PROMISE_RESPONSE");
                })
            );

            expect(outputArr).to.be.a('array');
            expect(outputArr).to.have.lengthOf(2);
            expect(outputArr[0]).to.equal(null);
            expect(outputArr[1]).to.equal("PROMISE_RESPONSE");
        })
    });
});