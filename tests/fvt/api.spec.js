(function() {

    'use strict';

    var utils = require('./utils.js');
    var assert = require('chai').assert;
    var async = require('async');

    /* 
       sometimes due to timeout the database is left with data added by the FVT test cases, in other words the
       FVT does not leave database in the same state it started with. In this case some of the testcases may find
       more row than it expects. I am using async to handle these sutuations  - Umesh P
    */ 

    describe('API', function() {
        this.timeout(10000);
        it('list all policies', function(done) {
            utils.makeRestCall({method: 'GET'}, '/policies', null, function(err, resp, body) {
                //console.log(JSON.stringify(body, null, 4));
                assert(resp.statusCode === 200, 'Unexpected status code: ' + resp.statusCode);
                assert(body.total_rows === 9, "Incorrect total rows: ", body.total_rows);
                done();
            });
        });

        it('add a policy', function(done) {
            var postbody = {name: 'Test Policy', desc: 'Sample desc', baseCost: 5000, perAddTraveler: 5, cancelFee: 150, minDays: 3, perAddDay: 5, levelCare: 3, amount: 10000};
            utils.makeRestCall({method: 'POST', body: postbody}, '/policies', null, function(err, resp, body) {
                //console.log(JSON.stringify(body, null, 4));
                assert(resp.statusCode === 200, 'Unexpected status code: ' + resp.statusCode);
                assert(body.msg === "Successfully created policy", "Incorrect message received: ", body.msg);
                done();
            });
        });

        it('Compute Fabonacci', function(done) {
            utils.makeRestCall({method: 'GET'}, '/fib', null, function(err, resp, body) {
                //console.log(JSON.stringify(body, null, 4));
                assert(resp.statusCode === 200, 'Unexpected status code: ' + resp.statusCode);
                assert(body.msg === "Done with fibonacci of 20: 10946", "Incorrect message received: ", body.msg);
                done();
            });
        });

        it('get policy using id', function(done) {
            utils.getPolicies('Test Policy', function(err, data) {
                if(err) {
                    assert.fail("Failed to get policies using name");
                    done();
                } else {
                    if(data.length === 0) {
                        return done();
                    }
                    async.every(data, function(policy, callback) {
                        utils.makeRestCall({method: 'GET'}, '/policies/' + policy._id, null, function(err, resp, body) {
                            //console.log(JSON.stringify(body, null, 4));
                            if(resp.statusCode === 200) {
                                return callback(true);
                            } else {
                                return callback(false);
                            }
                        });
                    }, function(result) {
                        if(result === false) {
                            assert("failed while getting the policies");
                        }
                        done();
                    });
                }
            });
        });

        it('update policy using id', function(done) {
            utils.get('Test Policy', function(err, data) {
                if(err) {
                    assert.fail("Failed to get policies using name");
                    done();
                } else {
                    if(data.length === 0) {
                        return done();
                    }
                    async.every(data, function(policy, callback) {
                        policy.additional = "Something new";
                        utils.makeRestCall({method: 'PUT', body: item}, '/policies/' + policy._id, null, function(err, resp, body) {
                            //console.log(JSON.stringify(body, null, 4));
                            if( (resp.statusCode === 200) && (body.additional === 'Something new') ) {
                                return callback(true);
                            } else {
                                return callback(false);
                            }
                        });
                    }, function(result) {
                        if(result === false) {
                            assert("failed to update a policy");
                        }
                        done();
                    });
                }
            });
        });

        it('delete policy using id', function(done) {
            utils.getItems('Test Policy', function(err, data) {
                if(err) {
                    assert.fail("Failed to get policies using name");
                    done();
                } else {
                    if(data.length === 0) {
                        return done();
                    }
                    async.every(data, function(policy, callback) {
                        utils.makeRestCall({method: 'DELETE'}, '/policies/' + policy._id, null, function(err, resp, body) {
                            //console.log(JSON.stringify(body, null, 4));
                            if( (resp.statusCode === 200) && (body.msg === "Successfully deleted policy") ) {
                                return callback(true);
                            } else {
                                return callback(false);
                            }
                        });
                    }, function(result) {
                        if(result === false) {
                            assert("failed to delete a policy");
                        }
                        done();
                    });
                }
            });
        });

    });
}());
