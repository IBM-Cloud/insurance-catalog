(function() {

    'use strict';

    var utils = require('./utils.js');
    var assert = require('chai').assert;

    describe('API', function() {
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
                    for(var i = 0; i < data.length; i++) {
                        utils.makeRestCall({method: 'GET'}, '/items/' + data[i]._id, null, function(err, resp, body) {
                            //console.log(JSON.stringify(body, null, 4));
                            assert(resp.statusCode === 200, 'Unexpected status code: ' + resp.statusCode);
                            done();
                        });
                    }
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
                    for(var i = 0; i < data.length; i++) {
                        //console.log("data - ", data);
                        data[i].additional = "Something new";
                        utils.makeRestCall({method: 'PUT', body: data[i]}, '/items/' + data[i]._id, null, function(err, resp, body) {
                            //console.log(JSON.stringify(body, null, 4));
                            assert(resp.statusCode === 200, 'Unexpected status code: ' + resp.statusCode);
                            assert(body.additional = "Something new", "additional element not found or incorrect");
                            done();
                        });
                    }
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
                    for(var i = 0; i < data.length; i++) {
                        utils.makeRestCall({method: 'DELETE'}, '/items/' + data[i]._id, null, function(err, resp, body) {
                            //console.log(JSON.stringify(body, null, 4));
                            assert(resp.statusCode === 200, 'Unexpected status code: ' + resp.statusCode);
                            assert(body.msg === "Successfully deleted item", "Incorrect message received: ", body.msg);
                            done();
                        });
                    }
                }
            });
        });

    });
}());
