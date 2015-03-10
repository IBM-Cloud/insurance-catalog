require('./db');
initDB();

//Create and populate or delete the database.
exports.dbOptions = function(req, res) {
    var option = req.params.option.toLowerCase();
    if(option === 'create'){
        cloudant.db.create('items', function(err, body){
            if(!err){
                populateDB();
                res.send({msg:'Successfully created database and populated!'});
            }
            else{
                res.send({msg:err});
            }
        });
    }
    else if(option === 'delete'){
        cloudant.db.destroy('items',function(err, body){
        if(!err){
            res.send({msg:'Successfully deleted db items!'});
        }
        else res.send({msg:'Error deleting db items: ' + err});
        });
    }
    else res.send({msg: 'your option was not understood. Please use "create" or "delete"'});    
}

//Create an item to add to the database.
exports.create = function(req, res) {
        db.insert(req.body, function (err, body, headers) {
            if (!err) {
                res.send({msg: 'Successfully created item'});
            }
            else {
                res.send({msg: 'Error on insert, maybe the item already exists: ' + err});
            }
        });
    }

//find an item by ID.
exports.find = function(req, res) {
    var id = req.params.id;
    db.get(id, { revs_info: false }, function(err, body) {
        if (!err){
            res.send(body);
        }
        else{
            res.send({msg:'Error: could not find item: ' + id});
        }
    });
}

//list all the database contents.
exports.list = function(req, res) {
    db.list({include_docs: true}, function (err, body, headers) {
    if (!err) {
        res.send(body);
        return;
    }
    else res.send({msg:'Error listing items: ' + err});
    });
}

//update an item using an ID.
exports.update = function(req, res) {
    var id = req.params.id;
    var data = req.body;
    db.get(id,{revs_info:true}, function (err, body) {
        if(!err){
            data._rev = body._rev;
            db.insert(data, id, function(err, body, headers){
            if(!err){
                res.send({msg:'Successfully updated item: ' + JSON.stringify(data)});
            }
            else res.send({msg:'Error inserting for update: ' + err});
            });
        }
        else res.send({msg:'Error getting item for update: ' + err});
    });
}

//remove an item from the database using an ID.
exports.remove =  function(req, res){
    var id = req.params.id;
    db.get(id, { revs_info: true }, function(err, body) {
        if (!err){
            console.log('Deleting item: ' + id);
            db.destroy(id, body._rev, function(err, body){
                if(!err){
                    res.send({msg:'Successfully deleted item'});
                }
                else{
                    res.send({msg:'Error in delete: ' + err});
                }
            })
        }
        else{
            res.send({msg:'Error getting item id: ' + err});
        }
    });  
}

//calculate the fibonacci of 20.
exports.fib = function(req, res) {
    res.send({msg:'Done with fibonacci of 20: ' + fib(20)});
}

var fib = function(n) {
    if (n < 2) {
        return 1;
    } 
    else {
        return (fib(n - 2) + fib(n - 1));
    }
}