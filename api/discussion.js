module.exports = function(jsonParser, server, app) {





// var returnSuccess = function( req,res,next) {
//   res.setHeader('Access-Control-Allow-Origin', basepath );
//   res.setHeader('Access-Control-Allow-Methods', "POST, GET, PUT, UPDATE, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", 
//   "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
//   res.writeHead(200, { 'Content-Type': 'plain/text' });
//   res.end();
// };



/*  Discussion Socket Methods
-----------------------------------*/

var io = require('socket.io')(server);
io.sockets.on('connection', function(socket){


    socket.on('enter', function( user, classID, sectionNumber ) {

      this.broadcast.emit('userentering', {'user': user, 'classID': classID, 'sectionNumber': sectionNumber });

    });

    socket.on('newthread', function( threadObject ) {
       // console.log('got a new thread from the frontend: ' + JSON.stringify(threadObject));
   
        this.broadcast.emit('newthread', threadObject );
  
      });   

    socket.on('updatethread', function( threadObject) {
        this.broadcast.emit('updatethread',  threadObject );
    });

    socket.on('deletethread', function( threadObject ) {
     //   console.log('A thread was deleted: ' + JSON.stringify(threadObject));
   
        this.broadcast.emit('deletethread', threadObject );
  
      });   

    
    // This is stuff for the Messaging Component -- instead of the discussion component
    socket.on('messageChanged', function( message ) {
      this.broadcast.emit('messageChanged', message);
    });

    socket.on('userSettingsChanged', function( user ) {
      this.broadcast.emit('userSettingsChanged', user );
    });
    socket.on('userChanged', function( user ) {
      this.broadcast.emit('userChanged', user );
    });
});



}