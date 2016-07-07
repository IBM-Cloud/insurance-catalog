/*eslint-env node */
try {
    var cloudant = require('cloudant')(cloudantService.credentials.url);
    exports.cloudant = cloudant;
    var policiesDb = cloudant.use('policies');
    exports.policiesDb = policiesDb;
}
catch (e) {
    console.error("Error initializing services for /db: ", e);
}

//populate the db with these policies.
var populateDB = function() {

    var policies = require('./starter_docs/policies.json');

    for (var p in policies){
        policiesDb.insert(policies[p], function(err/*, body, header*/) {
            if (err){
                //console.log('error in populating the DB policies: ' + err );
            }
        });
    }
};
exports.populateDB = populateDB;

//Initiate the database.
var initDB = function() {

    // Bound service check
    if (typeof cloudant == 'undefined')
        return res.send({msg:'Error: Cannot run initDB() w/o Cloudant service'});

    cloudant.db.create('policies', function(err/*, body*/) {
	    if (!err) {
	        populateDB();
	        //console.log('Successfully created database and populated!');
	    } else {
	        //console.log("Database already exists.");
	    }
    });
};
exports.initDB = initDB;
