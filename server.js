//Install express server
const express = require('express');
const app = express();

// Serve only the static files form the dist directory
// app.use(express.static(__dirname + '/dist'));

// app.get('/*', function(req, res){
//     res.sendFile(__dirname + '/dist');
//   });
  
  //const app = express(),
  staticServe = express.static(`${ __dirname }/dist`);

app.use("/", staticServe);
app.use("*", staticServe);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);


