/*eslint-env node */
var cloudant = require('cloudant')(cloudantService.credentials.url);
exports.cloudant = cloudant;
var itemsDb = cloudant.use('items');
exports.itemsDb = itemsDb;

//populate the db with these items.
var populateDB = function() {

    var products = [
    {
        name: 'War Room Table',
        color: 'tan',
        quantity: 5,
        description: 'A Beautiful War Room table, perfect for collaborative work spaces!',
        usaDollarPrice: 180.00,
        imgsrc:'http://upload.wikimedia.org/wikipedia/commons/f/fd/Meeting_room,_table_and_paper_board.jpg'
    },
    {
        name: 'Foosball Table',
        color: 'white',
        quantity: 53,
        description: 'Wooden table, some assembly required.',
        usaDollarPrice: 125.99,
        imgsrc:'http://upload.wikimedia.org/wikipedia/commons/6/62/FAS_Foosball_table_1.jpg'
    },
    {
        name: 'Ping pong table',
        color: 'green',
        quantity: 7,
        description: 'A very sturdy ping pong table. Includes 2 paddles and a regulation sized net.',
        usaDollarPrice: 199.99,
        imgsrc:'http://upload.wikimedia.org/wikipedia/commons/0/0c/Table_tennis_table_007.JPG'
    },  
    {
        name: 'IBM Coffee Beans',
        color: 'brown',
        quantity: 155,
        description: 'These have been fueling IBMers for ages!',
        usaDollarPrice: 15.00,
        imgsrc:'http://upload.wikimedia.org/wikipedia/commons/c/c5/Roasted_coffee_beans.jpg'
    },
    {
        name: 'Ping pong balls',
        color: 'white',
        quantity: 97,
        description: '3 star ping pong balls, regulation size.',
        usaDollarPrice: 12.00,
        imgsrc:'http://upload.wikimedia.org/wikipedia/commons/f/fd/Tischtennisball-weiss-004.jpg'
    },
    {
        name: 'Travel Backpack',
        color: 'green',
        quantity: 64,
        description: 'This backpack is perfect for traveling.',
        usaDollarPrice: 49.99,
        imgsrc:'http://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Rucksack_Schweizer_Armee_1960er_a.jpg/828px-Rucksack_Schweizer_Armee_1960er_a.jpg'
    },
    {
        name: 'Monitor',
        color: 'white',
        quantity: 24,
        description: 'A computer monitor.',
        usaDollarPrice: 159.99,
        imgsrc:'http://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/LG_L194WT-SF_LCD_monitor.jpg/1191px-LG_L194WT-SF_LCD_monitor.jpg'
    },
    {
        name: 'Water Bottle',
        color: 'orange, blue, yellow',
        quantity: 71,
        description: '3 different colors to match your personality!',
        usaDollarPrice: 19.99,
        imgsrc:'http://upload.wikimedia.org/wikipedia/commons/0/07/Multi-use_water_bottle.JPG'
    }];

    for (var p in products){
        itemsDb.insert(products[p], function(err/*, body, header*/) {
            if (err){
                //console.log('error in populating the DB items: ' + err );
            }
        });
    }   
};
exports.populateDB = populateDB;

//Initiate the database.
var initDB = function() {
    cloudant.db.create('items', function(err/*, body*/) {
	    if (!err) {
	        populateDB();
	        //console.log('Successfully created database and populated!');
	    } else {
	        //console.log("Database already exists.");
	    }
    });
};
exports.initDB = initDB;
