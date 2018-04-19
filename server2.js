
//Install express server
var http = require('http');
var https = require('https');
const express = require('express');
const app = express();
const path = require('path');
var httpsRedirect = require('express-https-redirect');
var bodyParser = require("body-parser");

origin = "http://localhost:4200";  

console.log('In the server');

// Serve only the static files form the dist directory
// app.use(express.static(__dirname + '/dist'));

// app.use('/', httpsRedirect());
app.use(bodyParser.json());

server = http.createServer(app);
// Start the app by listening on the default Heroku port
server.listen(process.env.PORT || 4200);

var returnSuccess = function( req,res,next) {
  console.log('in return success - origin: ' + origin);
  res.setHeader('Access-Control-Allow-Origin', origin );
 res.setHeader('Access-Control-Allow-Methods', "POST, GET, PUT, UPDATE, DELETE, OPTIONS");
 res.setHeader("Access-Control-Allow-Headers", 
 "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
 res.setHeader("Access-Control-Allow-Credentials", true);
// res.writeHead(200, { 'Content-Type': 'plain/text' });
  res.json('success');
  res.end();
};

app.get('/api/test', function(req, res, next) {
  returnSuccess();
})

// app.get('/*', function(req, res){

//     res.sendFile(path.join(__dirname + '/dist/index.html') );
  
  
//   });
  


console.log('listening');