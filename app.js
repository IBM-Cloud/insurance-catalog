var express = require('express');
var bodyParser = require('body-parser');
var cfenv = require("cfenv");
var path = require('path');
var cors = require('cors');

//Setup Cloudant Service.
var appEnv = cfenv.getAppEnv();
cloudantService = appEnv.getService("policy-db");
var policies = require('./routes/policies');

//Setup middleware.
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'www')));

//REST HTTP Methods
app.get('/db/:option', policies.dbOptions);
app.get('/policies', policies.list);
app.get('/fib', policies.fib);
app.get('/loadTest', policies.loadTest);
app.get('/policies/:id', policies.find);
app.post('/policies', policies.create);
app.put('/policies/:id', policies.update);
app.delete('/policies/:id', policies.remove);

app.listen(appEnv.port, appEnv.bind);
console.log('App started on ' + appEnv.bind + ':' + appEnv.port);
