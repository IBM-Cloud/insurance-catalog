/*eslint-env node */
var cloudant = require('cloudant')(cloudantService.credentials.url);
exports.cloudant = cloudant;
var policiesDb = cloudant.use('policies');
exports.policiesDb = policiesDb;

//populate the db with these policies.
var populateDB = function() {

    var policies = [
    {
        name: 'Basic',
        desc: 'A low-cost package for the penny-pincher',
        baseCost: 300,
        perAddTraveler: 20,
        minDays: 0,
        perAddDay: 5,
        levelCare: 2,
        amount: 3000,
        rating: 73
    },
    {
        name: 'Extended Basic',
        desc: 'The basic package for extended stays',
        baseCost: 400,
        perAddTraveler: 10,
        minDays: 5,
        perAddDay: 5,
        levelCare: 2,
        amount: 4000,
        rating: 67
    },
    {
        name: 'Essential',
        desc: 'Everything you need, none of the frills',
        baseCost: 500,
        perAddTraveler: 10,
        cancelFee: 100,
        minDays: 3,
        perAddDay: 6,
        levelCare: 3,
        amount: 6000,
        rating: 85
    },
    {
        name: 'Flight of Fancy',
        desc: 'For the indecisive traveler unsure of their travel plans',
        baseCost: 500,
        perAddTraveler: 15,
        cancelFee: 0,
        minDays: 6,
        perAddDay: 4,
        levelCare: 2,
        amount: 5000,
        rating: 78
    },
    {
        name: 'Standard',
        desc: 'Not too much. Not too little. Just right',
        baseCost: 500,
        perAddTraveler: 20,
        cancelFee: 200,
        minDays: 4,
        perAddDay: 8,
        levelCare: 3,
        amount: 8000,
        rating: 90
    },
    {
        name: 'Standard Plus',
        desc: 'Just the right amount of coverage and a cherry on top',
        baseCost: 800,
        perAddTraveler: 15,
        cancelFee: 200,
        minDays: 4,
        perAddDay: 6,
        levelCare: 3,
        amount: 10000,
        rating: 82
    },
    {
        name: 'Premium',
        desc: 'Our package for the risk-averse traveler',
        baseCost: 1000,
        perAddTraveler: 10,
        cancelFee: 300,
        minDays: 5,
        perAddDay: 7,
        levelCare: 5,
        amount: 15000,
        rating: 84
    },
    {
        name: 'Premium Deluxe',
        desc: 'Complete coverage and the kitchen sink',
        baseCost: 15000,
        perAddTraveler: 10,
        cancelFee: 400,
        minDays: 5,
        perAddDay: 10,
        levelCare: 5,
        amount: 50000,
        rating: 95
    },
    {
        name: 'Getaway',
        desc: 'For travelers about to embark on the journey of their life',
        baseCost: 1500,
        perAddTraveler: 5,
        cancelFee: 500,
        minDays: 20,
        perAddDay: 0,
        levelCare: 4,
        amount: 20000,
        rating: 78
    }];

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
