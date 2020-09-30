var http = require('http');
// var https = require('https');
// var url = require('url');
const path = require('path');
var httpsRedirect = require('express-https-redirect');


var bodyParser = require("body-parser");
var formidable = require("formidable");

var url = require('url');
var AVATAR_PATH = 'https://recloom.s3.amazonaws.com/avatars';

var server;

let ssl_options = {};
var origin = '';
var avatar_path = '';
var upload_path = '';
var local = true;
var fs = require('fs');

var jwt = require('jsonwebtoken');
// var logger = require('./api/logger');
// var mailer = require('./api/sendmail');

//var Collection = require('./api/collection.js');

var DocRepo = require('./api/docrepo.js');
var Datum = require('./api/datum.js');

var multer  = require('multer');
var multerS3 = require('multer-s3');


// var easyimg = require('easyimage');
// var im = require('imagemagick');

// var S3_CREDS = {
//     "aws_access_key_id" : "AKIAIE52WOYO3ZPCPT3Q",
//     "aws_secret_acces_key" : "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"
// }
var aws = require('aws-sdk');
//aws.config.loadFromPath('./config.json');
aws.config.update({accessKeyId: 'AKIAIE52WOYO3ZPCPT3Q', secretAccessKey: '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'});

// var multerS3 = require('multer-s3');
var s3 = new aws.S3({ apiVersion: '2006-03-01',
region: 'us-west-1'
});
// credentials: {S3_CREDS}



const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



var staticValue = function(value) {
    return function (req, file, cb) {
      cb(null, value)
    }
  }

var dataTypes = [
    'announcements',
    'authenticate',
    'enrollments',
    'assignments',
    'users',
    'courses',
    'classes',
    'discussionsettings',
    'materials',
    'messages',
    'notessettings',
    'series',
    'threads',
];

class Discussion {
    constructor(class_id, section) {
      this.class_id = class_id;
      this.section = section;
      this.currentUsers = [];
    }
  }

  var discussions = [];



avatar_path = 'https://recloom.s3.amazonaws.com/avatars';
upload_path = 'https://recloom.s3.amazonaws.com/';

var express = require('express');
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//app.use(urlencodedParser);
//app.use(logger);
app.use(bodyParser.json());

// create application/json parser
var jsonParser = bodyParser.json();

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

var port;



if (local) { 
    server = http.createServer(app);
    origin = "localhost:4200"; 
  //  origin = "https://ddworks.org"; 
    port = 4200;
    
}
else {
 //  server = http.createServer(app);
   origin= "https://thawing-reaches-29763.herokuapp.com";
  // origin = "http://localhost"; 

    let ssl_options = {
        key:fs.readFileSync('./ssl/privkey.pem'),
        cert:fs.readFileSync('./ssl/allchange.pem')
    };
  //  port = process.env.PORT;
}

server.listen(process.env.PORT || 4200);


console.log('server running on port: ' + port);

var discussion = require('./api/discussion')(jsonParser, server, app );
var optionsCB = function( req, res, next) {
  console.log('Origin == ' + origin);
  console.log('Sending sucess for Options Request....');
  res.setHeader('Access-Control-Allow-Origin', origin );
  res.setHeader('Access-Control-Allow-Methods', "POST, GET, PUT, UPDATE, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", 
  "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.writeHead(200, { 'Content-Type': 'plain/text' });
  res.end();
}



var datums = [];
for (var i =0; i < dataTypes.length; i++) {
    datum = new Datum(dataTypes[i]);
    datums[dataTypes[i]] = datum;
    app.options('/api/' + dataTypes[i], optionsCB);
    app.get('/api/' + dataTypes[i], datums[dataTypes[i]].getCB);
    app.put('/api/' + dataTypes[i], jsonParser, datums[dataTypes[i]].putCB );
    app.delete('/api/' + dataTypes[i], jsonParser, datums[dataTypes[i]].deleteCB);
  
}

app.use(express.static(__dirname + '/dist'));

app.get('/api/test',function(req, res, next){
  console.log('GOT test');
          returnSuccess( req, res, next ); });

app.post('/api/authenticate', jsonParser, function(req,res,next) {
    processAuthentication( req, res, next); 
});


app.options('/api/discussion/enter', function(req, res, next){
    returnSuccess( req, res, next ); });
app.options('/api/sendCFMsg', function(req, res, next){
console.log('Sent OPTIONS for CFMsg');
   returnSuccess( req, res, next ); });
app.options('/api/avatars', function(req, res, next){
console.log('Sent OPTIONS for Avatars');
       returnSuccess( req, res, next ); });

app.put('/api/sendCFMsg', jsonParser, function(req,res,next) {
sendCFMsg(req,res,next);
});

app.put('/api/discussion/enter', jsonParser, function(req,res,next) {
  console.log('Got a discussion entry request');
 discussionLogin( req, res, next);
});

app.options('/api/materialimages', function(req, res, next){
   returnSuccess( req, res, next ); });

app.options('/api/materialfiles', function(req, res, next){
returnSuccess( req, res, next ); });  

app.post('/api/materialimages', jsonParser, function(req,res,next) {
uploadMaterialImage(req,res,function(err){

   if(err){
       console.log('not able to post image.');
       console.log( JSON.stringify(err));

           res.json({error_code:1,err_desc:err});
           return;
   }
   res.setHeader('Access-Control-Allow-Origin', origin );
   res.setHeader('Access-Control-Allow-Methods', "POST, GET, PUT, UPDATE, DELETE, OPTIONS");
   res.setHeader("Access-Control-Allow-Headers", 
   "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
   res.setHeader("Access-Control-Allow-Credentials", true);
   res.writeHead(200, { 'Content-Type': 'plain/text' });
   res.end();
});
});

app.post('/api/avatars', jsonParser, function(req,res,next) {
console.log('posting avatar image: ' + req.query);
uploadAvatarImage(req,res,function(err){

   if(err){
       console.log('not able to post image.');
       console.log( JSON.stringify(err));

           res.json({error_code:1,err_desc:err});
           return;
   }
   res.setHeader('Access-Control-Allow-Origin', origin );
   res.setHeader('Access-Control-Allow-Methods', "POST, GET, PUT, UPDATE, DELETE, OPTIONS");
   res.setHeader("Access-Control-Allow-Headers", 
   "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
   res.setHeader("Access-Control-Allow-Credentials", true);
   res.writeHead(200, { 'Content-Type': 'plain/text' });
   res.end();
});
});




app.post('/api/materialfiles', jsonParser, function(req,res,next) {
    uploadMaterialFile(req,res,function(err){

        // var dest = req.file.destination;
        // console.log('got post request: ' + dest);
        console.log('uploading material file');
        
        if(err){
            console.log('suffered error');
             res.json({error_code:1,err_desc:err});
             return;
        } else {
            console.log('uploaded without error');
        }
       // res.json({error_code:0,err_desc:null});
        res.setHeader('Access-Control-Allow-Origin', origin );
        res.setHeader('Access-Control-Allow-Methods', "POST, GET, PUT, UPDATE, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.writeHead(200, { 'Content-Type': 'plain/text' });
        res.end();
    });
});


 

var processAuthentication = function(req, res, next) {

     var cert = fs.readFileSync('.bsx');
     var certString = cert.toString();
    DocRepo.authenticate(jwt, certString, sgMail, req, res, next);
}

var discussionLogin = function( req,res,next) {
    let user_id = req.body.user_id;
    let class_id = req.body.class_id;
    let section = req.body.section;
  
    console.log('In discussionLogin(), user_id:' + user_id + ', class_id: ' + class_id +
      ', section: ' + section);
  
    let discussion = findDiscussion(class_id, section);
    if (!discussion) {
        discussion = new Discussion( class_id, section);
        discussions.push(discussion);
        discussion.currentUsers.push(user_id);
    } else {
        if (discussion.currentUsers) {
            foundUser = findUserInDiscussion(user_id, discussion);
            if (!foundUser) {
                discussion.currentUsers.push(user_id);
            }
        }
    }
    
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', "POST, GET, PUT, UPDATE, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
    res.sendStatus(200);
    res.end();
  };

  var findDiscussion = function( class_id, section) {
    let found = false;
    let foundDiscussion = null;

  if (discussions) {
      console.log('Discussions: ' + JSON.stringify(discussions));
  }
  for (var i = 0; i < discussions.length; i++) {
      if (discussions[i].class_id == class_id && discussions[i].section == section) {
          console.log('found the discussion in memory: ' + i);
          found = true;
          foundDiscussion = discussions[i];
      }
  }

  if (!found) {
      console.log('Didnt find the discussion, so creating it.');
      let newDiscussion = new Discussion( class_id, section);
      discussions.push(newDiscussion);
      foundDiscussion = newDiscussion;
  }
  return foundDiscussion;
}

var findUserInDiscussion = function( user, discussion ) {
  for (var i = 0; i < discussion.currentUsers.length; i++) {
      if (user.id == discussion.currentUsers[i].id) {
          console.log('found user in discussion.');
          return true;
      }
  }
  console.log('Did NOT find user in discussion.');
  return false;
}

var discussionLogin = function( req,res,next) {
  let user_id = req.body.user_id;
  let class_id = req.body.class_id;
  let section = req.body.section;

  console.log('In discussionLogin(), user_id:' + user_id + ', class_id: ' + class_id +
    ', section: ' + section);

  let discussion = findDiscussion(class_id, section);
  if (!discussion) {
      discussion = new Discussion( class_id, section);
      discussions.push(discussion);
      discussion.currentUsers.push(user_id);
  } else {
      if (discussion.currentUsers) {
          foundUser = findUserInDiscussion(user_id, discussion);
          if (!foundUser) {
              discussion.currentUsers.push(user_id);
          }
      }
  }
  
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', "POST, GET, PUT, UPDATE, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", 
  "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  res.sendStatus(200);
  res.end();
 // next();
};



// Image stuff ---------------------------------

var storeMaterialImage = multerS3( {
    s3: s3,
    bucket: 'recloom',
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
    acl: 'public-read-write',
    key: function (req, file, cb) {
        // cb(null, Date.now().toString())
        cb(null, 'materialimages/' + req.query.id + '/' + file.originalname); 
    }
});


var storeAvatarImage = multerS3( {
    s3: s3,
    bucket: 'recloom',
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
    acl: 'public-read-write',
    key: function (req, file, cb) {
        // cb(null, Date.now().toString())
        cb(null, 'avatars/' + req.query.id + '/' + file.originalname); 
    }
});





var uploadMaterialImage = multer({ //multer settings
    storage: storeMaterialImage
}).single('file');

var uploadAvatarImage = multer({ //multer settings
    storage: storeAvatarImage
}).single('file');





// ----------------
// Send the Contact Form Message

var sendCFMsg = function(req,res,next) {
    console.log('In sendCFMsg.');
   // mailer.sendCFMessage(req.body);
    const msg= {
        to: 'bartdority@gmail.com',
        from: 'b0rgBart3@gmail.com',
        subject: 'A message from the contact form on the loom',
        text: 'The message content will go here.',
        html: '<h1>Contact Form Message.</h1><p>The message will go here.</p>'
        };

   sgMail.send(msg);

    // res.writeHead(200, { 'Content-Type': 'plain/text' });
    // res.end(JSON.stringify('sent') );

    console.log('in return success - origin: ' + origin);
    res.setHeader('Access-Control-Allow-Origin', origin );
   res.setHeader('Access-Control-Allow-Methods', "POST, GET, PUT, UPDATE, DELETE, OPTIONS");
   res.setHeader("Access-Control-Allow-Headers", 
   "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  //  res.setHeader("Access-Control-Allow-Credentials", true);
 //   res.writeHead(200, { 'Content-Type': 'plain/text' });
    res.json('success');
    res.end();
}


// ------------- Material File stuff ---------------

    //contentType: multerS3.AUTO_CONTENT_TYPE, // staticValue('application/pdf'),

var storeMaterialFile = multerS3( {
    s3: s3,
    bucket: 'recloom',
    contentType: staticValue('application/pdf'),
    contentDisposition: staticValue('inline'),
    metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname });
      },
    acl: 'public-read-write',
    key: function (req, file, cb) {
        // cb(null, Date.now().toString())
        cb(null, 'materialfiles/' + req.query.id + '/' + file.originalname); 
    }
});

var uploadMaterialFile = multer({ //multer settings
    storage: storeMaterialFile
}).single('file');



// Serve only the static files form the dist directory
// app.use(express.static(__dirname + '/dist'));

// app.use('/', httpsRedirect());


// app.get('/*', function(req, res){

//     res.sendFile(path.join(__dirname + '/dist/index.html') );
  
  
//   });
  
// // Start the app by listening on the default Heroku port
// app.listen(process.env.PORT || 8080);

