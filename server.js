//Install express server
const express = require('express');
const app = express();
const path = require('path');
var httpsRedirect = require('express-https-redirect');


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

app.use('/', httpsRedirect());


app.get('/*', function(req, res){

    res.sendFile(path.join(__dirname + '/dist/index.html') );
  
  
  });
  
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

// does adding a comment constitute a change?