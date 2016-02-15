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
        itemsDb: {
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
    //cdb.__set__('itemsDb', mockdb);
    var items = rewire('../../tests/server/coverage/instrumented/routes/items.js');
    //items.__set__('cloudant', mockcloudant);
    items.__set__('db', mockdb);

    var USE_FASTCACHE = items.getFastCache();

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
            
            items.dbOptions( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Successfully created database and populated!' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('DB not created - cloudant failure', function() {
            reqMock.params.option = 'create';  
            mockdb.cloudant.db.create = function( key, callback ){
                callback( 'Failed to contact server.', '' );  
            };
            
            items.dbOptions( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Failed to contact server.' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('DB deleted successfully', function() {  
            reqMock.params.option = 'delete';  
            mockdb.cloudant.db.destroy = function( key, callback ){
                callback( false, '' );  
            };
            
            items.dbOptions( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Successfully deleted db items!' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );          
        });
        
        it('DB not deleted - cloudant failure', function() {
            reqMock.params.option = 'delete';
            mockdb.cloudant.db.destroy = function( key, callback ){
                callback( 'Failed to contact server.', '' );  
            };
            
            items.dbOptions( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error deleting db items: Failed to contact server.' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });     
    });  
    
    describe('create Function', function() {
        it('Item created successfully', function() {
            //items.db.itemsDB.insert = function( key, callback ){
            //    callback( false, '', '' );  
            //};
            
            items.create( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Successfully created item' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Item not created - db error', function() {
            mockdb.itemsDb.insert = function( key, callback ){
                callback('forced error');  
            };
    
            items.create( reqMock, resMock );        
            assert( resMock.send.lastCall.calledWith( { msg: 'Error on insert, maybe the item already exists: forced error' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
    });
    
    describe('find Function', function() {
        it('Item found successfully', function() {
            reqMock.params.id = 'testId';
            mockdb.itemsDb.get = function( id, arg, callback ){
                callback( false, 'test body' );  
            };
            
            items.find( reqMock, resMock );
            if(USE_FASTCACHE) {
                assert( resMock.send.lastCall.calledWith( {msg:"server error"} ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
            } else {
                assert( resMock.send.lastCall.calledWith( 'test body' ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
            }
        });
        
        it('Item not found - db error', function() {
            reqMock.params.id = 'testId';
            mockdb.itemsDb.get = function( id, arg, callback ){
                callback( 'forced error', '' );  
            };
            
            items.find( reqMock, resMock );
            if(USE_FASTCACHE) {
                assert( resMock.send.lastCall.calledWith( {msg:"server error"} ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
            } else {
                assert( resMock.send.lastCall.calledWith( { msg: 'Error: could not find item: testId' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
            }
        });
    });
    
    describe('list Function', function() {
        it('All Db content listed successfully', function() {
            mockdb.itemsDb.list = function( arg, callback ){
                callback( false, 'test body', 'headers' );  
            };
            
            items.list( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( 'test body' ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Db content not listed - db error', function() {
            mockdb.itemsDb.list = function( arg, callback ){
                callback( 'forced error', 'test body', 'headers' );  
            };
            
            items.list( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error listing items: forced error' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
    });
    
    describe('update Function', function() {
        it('Item updated successfully', function() {
            reqMock.body = {};
            mockdb.itemsDb.get = function( id, arg, callback ){
                callback( false, { _rev: 'test' } );  
            };
            
            mockdb.itemsDb.insert = function( data, id, callback ){
                callback( false, '', '' );  
            };
            
            items.update( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Successfully updated item: {\"_rev\":\"test\"}' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Item not updated - error on insert', function() {
            reqMock.body = {};
            mockdb.itemsDb.get = function( id, arg, callback ){
                callback( false, { _rev: 'test' } );  
            };
            
            mockdb.itemsDb.insert = function( data, id, callback ){
                callback( 'forced error', '', '' );  
            };
            
            
            items.update( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error inserting for update: forced error' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Item not updated - error on get', function() {
            reqMock.body = {};
            mockdb.itemsDb.get = function( id, arg, callback ){
                callback( 'forced error on get', { _rev: 'test' } );  
            };
            
            mockdb.itemsDb.insert = function( data, id, callback ){
                callback( false, '', '' );  
            };
            
            items.update( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error getting item for update: forced error on get' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
    });
    
    describe('remove Function', function() {
        it('Item removed successfully', function() {        
            mockdb.itemsDb.get = function( id, arg, callback ){
                callback( false, 'body' );  
            };
            
            mockdb.itemsDb.destroy = function( id, arg, callback ){
                callback( false, '' );  
            };
            
            items.remove( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Successfully deleted item' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Item not removed - error on destroy', function() {
            mockdb.itemsDb.get = function( id, arg, callback ){
                callback( false, 'body' );  
            };
            
            mockdb.itemsDb.destroy = function( id, arg, callback ){
                callback( 'forced erro on destroy', '' );  
            };
            
            items.remove( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error in delete: forced erro on destroy' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
        
        it('Item not removed - error on get', function() {
            mockdb.itemsDb.get = function( id, arg, callback ){
                callback( 'forced error on get', 'body' );  
            };
            
            mockdb.itemsDb.destroy = function( id, arg, callback ){
                callback( false, '' );
            };
            
            items.remove( reqMock, resMock );
            assert( resMock.send.lastCall.calledWith( { msg: 'Error getting item id: forced error on get' } ), 'Unexpected argument: ' + JSON.stringify(resMock.send.lastCall.args) );
        });
    });
}());
