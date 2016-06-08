/*eslint-env node, mocha*/
(function() {

    'use strict';

    var rewire = require("rewire");
    var assert = require('chai').assert;
    var sinon = require('sinon');

/*
    var mockcloudant = {
        db: {
            create: function(key, callback) {
                callback( false, "woot" );
            }
        }
    };
*/
    var mockdb = {
        policiesDb: {
            insert: function(body, callback){
                callback(null);
            },
            get: function(id, obj, callback) {
                callback(null, "body");
            }
        },
        populateDB: function() {},
        cloudant: {
            db: {
                create: function(key, callback) {
                    callback( false, "woot" );
                }
            }
        }
    };    
    
    global.cloudantService = {
        credentials: {
            url: "https://abc"
        }
    };

    //var cdb = rewire('../../tests/server/coverage/instrumented/routes/db.js');
    //cdb.__set__('cloudant', mockcloudant);
    //cdb.__set__('policiesDb', mockdb);
    var policies = rewire('../../tests/server/coverage/instrumented/routes/policies.js');
    //policies.__set__('cloudant', mockcloudant);
    policies.__set__('db', mockdb);

    var USE_FASTCACHE = policies.getFastCache();

    // create mock request and response
    var reqMock = {
        params: {
            option: 'create'
        }
    };

    var resMock = {};
    resMock.status = function() { return this;};
    resMock.send = function() {};
    resMock.end = function() {};
    sinon.spy(resMock, "send");
    
    describe('dbOptions Function', function() {
        it('DB created successfully', function() {
            reqMock.params.option = 'create';
            //mockcloudant.db.create = function( key, callback ){
            //    callback( false, '' );  
            //};
            
            policies.dbOptions( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Successfully created database and populated!' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('DB not created - cloudant failure', function() {
            reqMock.params.option = 'create';  
            mockdb.cloudant.db.create = function( key, callback ){
                callback( 'Failed to contact server.', '' );  
            };
            
            policies.dbOptions( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Failed to contact server.' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('DB deleted successfully', function() {  
            reqMock.params.option = 'delete';  
            mockdb.cloudant.db.destroy = function( key, callback ){
                callback( false, '' );  
            };
            
            policies.dbOptions( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Successfully deleted db policies!' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );          
        });
        
        it('DB not deleted - cloudant failure', function() {
            reqMock.params.option = 'delete';
            mockdb.cloudant.db.destroy = function( key, callback ){
                callback( 'Failed to contact server.', '' );  
            };
            
            policies.dbOptions( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error deleting db policies: Failed to contact server.' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });     
    });  
    
    describe('create Function', function() {
        it('Policy created successfully', function() {
            //policies.db.policiesDb.insert = function( key, callback ){
            //    callback( false, '', '' );  
            //};
            
            policies.create( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Successfully created policy' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Policy not created - db error', function() {
            mockdb.policiesDb.insert = function( key, callback ){
                callback('forced error');  
            };
    
            policiesDb.create( reqMock, resMock );        
            assert( resMock.send.lastCall.calledWith( { msg: 'Error on insert, maybe the policy already exists: forced error' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
    });
    
    describe('find Function', function() {
        it('Policy found successfully', function() {
            reqMock.params.id = 'testId';
            mockdb.policiesDb.get = function( id, arg, callback ){
                callback( false, 'test body' );  
            };
            
            policies.find( reqMock, resMock );
            if(USE_FASTCACHE) {
                assert( resMock.send.lastCall.calledWith( {msg:"server error"} ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
            } else {
                assert( resMock.send.lastCall.calledWith( 'test body' ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
            }
        });
        
        it('Policy not found - db error', function() {
            reqMock.params.id = 'testId';
            mockdb.policiesDb.get = function( id, arg, callback ){
                callback( 'forced error', '' );  
            };
            
            policies.find( reqMock, resMock );
            if(USE_FASTCACHE) {
                assert( resMock.send.lastCall.calledWith( {msg:"server error"} ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
            } else {
                assert( resMock.send.lastCall.calledWith( { msg: 'Error: could not find policy: testId' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
            }
        });
    });
    
    describe('list Function', function() {
        it('All Db content listed successfully', function() {
            mockdb.policiesDb.list = function( arg, callback ){
                callback( false, 'test body', 'headers' );  
            };
            
            policies.list( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( 'test body' ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Db content not listed - db error', function() {
            mockdb.policiesDb.list = function( arg, callback ){
                callback( 'forced error', 'test body', 'headers' );  
            };
            
            policies.list( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error listing policies: forced error' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
    });
    
    describe('update Function', function() {
        it('Policy updated successfully', function() {
            reqMock.body = {};
            mockdb.policiesDb.get = function( id, arg, callback ){
                callback( false, { _rev: 'test' } );  
            };
            
            mockdb.policiesDb.insert = function( data, id, callback ){
                callback( false, '', '' );  
            };
            
            policies.update( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Successfully updated policy: {\"_rev\":\"test\"}' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Policy not updated - error on insert', function() {
            reqMock.body = {};
            mockdb.policiesDb.get = function( id, arg, callback ){
                callback( false, { _rev: 'test' } );  
            };
            
            mockdb.policiesDb.insert = function( data, id, callback ){
                callback( 'forced error', '', '' );  
            };
            
            
            policies.update( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error inserting for update: forced error' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Policy not updated - error on get', function() {
            reqMock.body = {};
            mockdb.policiesDb.get = function( id, arg, callback ){
                callback( 'forced error on get', { _rev: 'test' } );  
            };
            
            mockdb.policiesDb.insert = function( data, id, callback ){
                callback( false, '', '' );  
            };
            
            policies.update( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error getting policy for update: forced error on get' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
    });
    
    describe('remove Function', function() {
        it('Policy removed successfully', function() {        
            mockdb.policiesDb.get = function( id, arg, callback ){
                callback( false, 'body' );  
            };
            
            mockdb.policiesDb.destroy = function( id, arg, callback ){
                callback( false, '' );  
            };
            
            policies.remove( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Successfully deleted policy' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Policy not removed - error on destroy', function() {
            mockdb.policiesDb.get = function( id, arg, callback ){
                callback( false, 'body' );  
            };
            
            mockdb.policiesDb.destroy = function( id, arg, callback ){
                callback( 'forced error on destroy', '' );  
            };
            
            policies.remove( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error in delete: forced error on destroy' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Policy not removed - error on get', function() {
            mockdb.policiesDb.get = function( id, arg, callback ){
                callback( 'forced error on get', 'body' );  
            };
            
            mockdb.policiesDb.destroy = function( id, arg, callback ){
                callback( false, '' );
            };
            
            policies.remove( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error getting policy id: forced error on get' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
    });
}());
