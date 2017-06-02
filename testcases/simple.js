var request = require('request');
var expect = require('expect.js');
var querystring = require('querystring');
var http = require('http');

var fs = require('fs');
var filename = './config.json';

var config = JSON.parse(fs.readFileSync(filename, 'utf8'));
config.forEach(function(item){

    var description = item.method + ' ' + item.host + item.path;
    describe( description, function(){
        it( 'should get 200 response', function(done) {
            var username = "someUserName";
            var password = "somePassword";
            issueRequest( item.host, item.path, item.method, username, password, function(error, response, body) {
                expect(response).to.exist;
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

});

// Utility function to simplify issuing a request
function issueRequest(xhost, xpath, xmethod, xusername, xpassword, xcallback){
    // data = JSON.stringify({"password": xpassword,"userId": xusername});
    var fquri = xhost + xpath;
    var requestOptions = {
        uri : fquri,
        method : xmethod
    }

    request(requestOptions, function (error, response, body) {
        xcallback(error, response, body);
    });
}
