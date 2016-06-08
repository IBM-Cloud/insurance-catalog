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
    db.policiesDb.list({include_docs: true}, function(err, body) {
      if (err) {
        res.send({msg:'Error retrieving policies: ' + err});
      }
      else {
        // Calculate policies and options based on inputs
        var policies = getEligiblePolicies(body.rows, tripDuration, cancelCov);
        var options = policies.map(function(policy) {
          return policyToOption(policy, tripDuration, addTravelers, cancelCov, tripCost);
        });
        var problem = buildProblem(options, "./tradeoff_data/policies.template.json");

        // Call Tradeoff Analytics service
        tradeoffAnalytics.dilemmas(problem, function(err, data) {
          if (err)
            return res.send({msg:'Error calculating tradeoff analytics: ' + err});
          else
            return res.json(data);
        });
      }
    });
  }
};

/**
 * Returns policies that are eligible given the input criteria
 */
function getEligiblePolicies(policyDocs, tripDuration, cancelCov) {
  var eligiblePolicies = [];
  for (var policy in policyDocs) {
    // If policy requires longer trip or does not have
    // cancelation coverage when requested, continue
    if (policyDocs[policy].doc.minDays > tripDuration ||
        (cancelCov && policyDocs[policy].doc.cancelFee === undefined))
      continue;

    // Add eligible trip to the returned list
    eligiblePolicies.push(policyDocs[policy].doc);
  }

  return eligiblePolicies;
}

/**
 * Returns an option for input into the Tradeoff Analytics service
 */
function policyToOption(policyDoc, tripDuration, addTravelers, cancelCov, tripCost) {
  var option = {};
  option.key = policyDoc._id;
  option.name = policyDoc.name;

  // Calculate multiplier for additional travelers
  var addTravelerMult = 1;
  if (addTravelers && addTravelers.length > 0) {
    var baseTravelerMult = 1 + (policyDoc.perAddTraveler / 100);
    for (var addtl in addTravelers) {
      addTravelerMult *= baseTravelerMult;
    }
  }

  // Calculate multiplier for additional days
  var addDaysMult = 1;
  if (tripDuration > policyDoc.minDays && policyDoc.perAddDay > 0) {
    var addDays = tripDuration - policyDoc.minDays,
        baseAddDaysMult = 1 + (policyDoc.perAddDay / 100);
    for (var i=0; i < addDays; i++) {
      addDaysMult *= baseAddDaysMult;
    }
  }

  // Define tradeoff values 
  option.values = {};
  option.values.cost = Math.round(policyDoc.baseCost * addTravelerMult * addDaysMult);
  option.values.levelCare = policyDoc.levelCare;
  option.values.amount = Math.round(policyDoc.amount * addTravelerMult * addDaysMult);
  option.values.rating = policyDoc.rating;

  return option;
}

/**
 * Returns the problem for input into the Tradeoff Analytics service
 */
function buildProblem(options, templateFile){
  var problem = require(templateFile);
  problem.options = options;

  // Get indices of adjustable values
  var costIndex, amountIndex;
  for (var value in problem.columns) {
    if (problem.columns[value].key === 'cost')
      costIndex = value;
    else if (problem.columns[value].key === 'amount')
      amountIndex = value;
  }

  // Adjust ranges if needed
  for (var index in options) {
    if (options[index].values.cost > problem.columns[costIndex].range.high)
      problem.columns[costIndex].range.high = options[index].values.cost;
    if (options[index].values.amount > problem.columns[amountIndex].range.high)
      problem.columns[amountIndex].range.high = options[index].values.amount;
  }
  return problem;
}