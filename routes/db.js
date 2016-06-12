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
        baseCost: 100,
        perAddTraveler: 20,
        cancelRefund: 0,
        minDays: 0,
        perAddDay: 5,
        levelCare: 2,
        amount: 8,
        review: 3
    },
    {
        name: 'Extended Basic',
        desc: 'The basic package for extended stays',
        baseCost: 150,
        perAddTraveler: 20,
        cancelRefund: 0,
        minDays: 5,
        perAddDay: 3,
        levelCare: 2,
        amount: 8,
        review: 2
    },
    {
        name: 'Essential',
        desc: 'Everything you need, none of the frills',
        baseCost: 200,
        perAddTraveler: 10,
        cancelRefund: 20,
        minDays: 3,
        perAddDay: 7,
        levelCare: 3,
        amount: 10,
        review: 4
    },
    {
        name: 'Flight of Fancy',
        desc: 'For the indecisive traveler unsure of their travel plans',
        baseCost: 250,
        perAddTraveler: 15,
        cancelRefund: 100,
        minDays: 6,
        perAddDay: 4,
        levelCare: 2,
        amount: 8,
        review: 3
    },
    {
        name: 'Standard',
        desc: 'Not too much. Not too little. Just right',
        baseCost: 300,
        perAddTraveler: 20,
        cancelRefund: 50,
        minDays: 4,
        perAddDay: 8,
        levelCare: 3,
        amount: 8,
        review: 5
    },
    {
        name: 'Standard Plus',
        desc: 'Just the right amount of coverage and a cherry on top',
        baseCost: 350,
        perAddTraveler: 20,
        cancelRefund: 70,
        minDays: 4,
        perAddDay: 8,
        levelCare: 3,
        amount: 10,
        review: 4
    },
    {
        name: 'Premium',
        desc: 'Our package for the risk-averse traveler',
        baseCost: 400,
        perAddTraveler: 10,
        cancelRefund: 80,
        minDays: 5,
        perAddDay: 7,
        levelCare: 5,
        amount: 7,
        review: 4
    },
    {
        name: 'Premium Deluxe',
        desc: 'Complete coverage and the kitchen sink',
        baseCost: 450,
        perAddTraveler: 10,
        cancelRefund: 85,
        minDays: 5,
        perAddDay: 10,
        levelCare: 5,
        amount: 8,
        review: 5
    },
    {
        name: 'Best coverage',
        desc: 'Complete coverage for everyone',
        baseCost: 460,
        perAddTraveler: 10,
        cancelRefund: 70,
        minDays: 5,
        perAddDay: 10,
        levelCare: 4,
        amount: 7,
        review: 4
    },
    {
        name: 'Good coverage',
        desc: 'Pretty good coverage, not much else',
        baseCost: 400,
        perAddTraveler: 10,
        cancelRefund: 78,
        minDays: 5,
        perAddDay: 8,
        levelCare: 3,
        amount: 8,
        review: 4
    },
    {
        name: 'Not so much coverage',
        desc: 'Just the bare bones',
        baseCost: 300,
        perAddTraveler: 10,
        cancelRefund: 40,
        minDays: 5,
        perAddDay: 10,
        levelCare: 2,
        amount: 8,
        review: 4
    },
    {
        name: 'Getaway',
        desc: 'For travelers about to embark on the journey of their life',
        baseCost: 400,
        perAddTraveler: 5,
        cancelRefund: 40,
        minDays: 20,
        perAddDay: 0,
        levelCare: 4,
        amount: 8,
        review: 3
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
