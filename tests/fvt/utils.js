var REQUEST = require('request');

var request = REQUEST.defaults({
    strictSSL: false
});

exports.makeRestCall = function(method, url, headers, callback) {
    var server = process.env.CATALOG_API_TEST_SERVER;
    request({
        method: method.method,
        body: method.body,
        url: server + url,
        headers: headers,
        json: true,
        timeout: 100000 // wait 100s before abort the request
    }, function(err, resp, body) {
        if (err) {
            callback(err, resp, null);
        } else {
            callback(null, resp, body);
        }
    });
};

exports.getItems = function(itemname, callback) {
    exports.makeRestCall({method: 'GET'}, '/items', null, function(err, resp, body) {
        if(resp.statusCode === 200) {
            var returndocs = [];
            for(var i = 0; i < body.total_rows; i++) {
                if(body.rows[i].doc.name === itemname) {
                    returndocs.push(body.rows[i].doc);
                }
            }
            return callback(null, returndocs);
        } else {
            return callback("Failed to get Items", null);
        }
    });
}