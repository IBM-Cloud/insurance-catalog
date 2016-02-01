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
        it('list all items', function(done) {
            utils.makeRestCall({method: 'GET'}, '/items', null, function(err, resp, body) {
                //console.log(JSON.stringify(body, null, 4));
                assert(resp.statusCode === 200, 'Unexpected status code: ' + resp.statusCode);
                assert(body.total_rows === 8, "Incorrect total rows: ", body.total_rows);
                done();
            });
        });

        it('add an item', function(done) {
            var postbody = {name: 'Test Table',color: 'tan', quantity: 5, description: 'A Beautiful table.',usaDollarPrice: 180.00, imgsrc:'http://image.jpg'};
            utils.makeRestCall({method: 'POST', body: postbody}, '/items', null, function(err, resp, body) {
                //console.log(JSON.stringify(body, null, 4));
                assert(resp.statusCode === 200, 'Unexpected status code: ' + resp.statusCode);
                assert(body.msg === "Successfully created item", "Incorrect message received: ", body.msg);
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

        it('get item using id', function(done) {
            utils.getItems('Test Table', function(err, data) {
                if(err) {
                    assert.fail("Failed to get items using name");
                    done();
                } else {
                    if(data.length === 0) {
                        return done();
                    }
                    async.every(data, function(item, callback) {
                        utils.makeRestCall({method: 'GET'}, '/items/' + item._id, null, function(err, resp, body) {
                            //console.log(JSON.stringify(body, null, 4));
                            if(resp.statusCode === 200) {
                                return callback(true);
                            } else {
                                return callback(false);
                            }
                        });
                    }, function(result) {
                        if(result === false) {
                            assert("failed while getting the items");
                        }
                        done();
                    });
                }
            });
        });

        it('update item using id', function(done) {
            utils.getItems('Test Table', function(err, data) {
                if(err) {
                    assert.fail("Failed to get items using name");
                    done();
                } else {
                    if(data.length === 0) {
                        return done();
                    }
                    async.every(data, function(item, callback) {
                        item.additional = "Something new";
                        utils.makeRestCall({method: 'PUT', body: item}, '/items/' + item._id, null, function(err, resp, body) {
                            //console.log(JSON.stringify(body, null, 4));
                            if( (resp.statusCode === 200) && (body.additional === 'Something new') ) {
                                return callback(true);
                            } else {
                                return callback(false);
                            }
                        });
                    }, function(result) {
                        if(result === false) {
                            assert("failed to update an item");
                        }
                        done();
                    });
                }
            });
        });

        it('delete item using id', function(done) {
            utils.getItems('Test Table', function(err, data) {
                if(err) {
                    assert.fail("Failed to get items using name");
                    done();
                } else {
                    if(data.length === 0) {
                        return done();
                    }
                    async.every(data, function(item, callback) {
                        utils.makeRestCall({method: 'DELETE'}, '/items/' + item._id, null, function(err, resp, body) {
                            //console.log(JSON.stringify(body, null, 4));
                            if( (resp.statusCode === 200) && (body.msg === "Successfully deleted item") ) {
                                return callback(true);
                            } else {
                                return callback(false);
                            }
                        });
                    }, function(result) {
                        if(result === false) {
                            assert("failed to delete an item");
                        }
                        done();
                    });
                }
            });
        });

    });
}());
