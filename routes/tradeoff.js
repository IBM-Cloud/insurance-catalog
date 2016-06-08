var tradeoffAnalytics = require('watson-developer-cloud').tradeoff_analytics(tradeoffService),
		db = require('./db');

//Create and populate or delete the database.
exports.evaluate = function(req, res) {

	// Get and validate policy calculation inputs
  var tripDuration = req.body.tripDuration;
  var addTravelers = req.body.addTravelers;
  var cancelCov = req.body.cancelCov;
  var tripCost = req.body.tripCost;
  if (tripDuration === undefined || cancelCov === undefined || tripCost === undefined ||
  		(addTravelers && addTravelers.length === 0))
  	res.send({msg:'Error: Invalid criteria received for tradeoff calculation'});
  else {
  	var dummyTradeoffData = require("./test_data/tradeoff-input.json");
  	tradeoffAnalytics.dilemmas(dummyTradeoffData, function(err, data) {
	    if (err)
	      return next(err);
	    else
	      return res.json(data);
	  });
  }
  /*db.policiesDb.get(policyId, { revs_info: false }, function(err, body) {
      if (!err) {
      	/*tradeoffAnalytics.dilemmas(req.body, function(err, res) {
			    if (err)
			      return next(err);
			    else
			      return res.json(data);
			  });
      		console.log(body);
          res.send(body);
      } else {
      	console.error(err);	
        res.send({msg:'Error: could not find policy: ' + policyId});
      }
  });*/
};