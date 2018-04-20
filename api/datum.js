/*
   Datum is a generic object that represents a Document in my Mongo DB

   I wanted the Object model itself to be generic -- but I pass in a type,
   which is a string - just so we know which Collection to look for it in.

*/
var DocRepo = require('./docrepo.js');
//DocRepo.connect();
var cert;
var certString;
var fs = require('fs');
cert = fs.readFileSync('.bsx');
certString = cert.toString();



var Datum = function( type ) {
     this.type = type;
     this.doc = null;

     // Note:  The type var - AND the DocRepo - both get
     // ENCAPSULATED into this callback function - which will get sent
     // to Express

     // This only seems to work as an embedded function.
     // I tried making it a prototype - but the encapsulation of
     // the type var doesn't work as a prototype method.
     
     this.getCB = function(request, response, next) {
        console.log('got a get request for: ' + type); 
        DocRepo.get(type, request, response, certString);
        // Note: the certString is just for JWT (for authentication);
     }

     this.putCB = function(request, response, next) { 
        console.log('got a put request for ' + type); 
        DocRepo.put(type, request, response, next, certString);
    }
   
     this.deleteCB = function(request, response, next) {
         console.log('got a delete request for ' + type);
         DocRepo.trash(type, request, response, next);
     }
     
  }

// Oddly enough - in this prototype function, encapsulating the type
// var DOES work -- weird!!

Datum.prototype.getType = function() {
    return this.type;
}


module.exports = Datum;