module.exports = function(app, basepath) {

    var returnSuccess = function( req,res,next) {
        res.setHeader('Access-Control-Allow-Origin', basepath );
        res.setHeader('Access-Control-Allow-Methods', "POST, GET, PUT, UPDATE, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.writeHead(200, { 'Content-Type': 'plain/text' });
        res.end();
    };

    // app.options('/api/studentenrollments', function(req, res, next){
    //     returnSuccess( req, res, next ); });
    // app.options('/api/instructorassignments', function(req, res, next){
    //         returnSuccess( req, res, next ); });
    // app.options('/api/allmaterialsbytype', function(req, res, next){
    //             returnSuccess( req, res, next ); });    
    app.options('/api/materialimages', function(req, res, next){
        returnSuccess( req, res, next ); });
    app.options('/api/materialfiles', function(req, res, next){
        returnSuccess( req, res, next );  });
    app.options('/api/docfiles', function(req, res, next){
        returnSuccess( req, res, next );   });
    // app.options('/api/discussion/settings*', function(req, res, next){
    //     returnSuccess( req, res, next ); });
    // app.options('/api/notes/settings', function(req, res, next){
    //     returnSuccess( req, res, next ); });
    app.options('/api/requestreset', function( req, res, next) {
        returnSuccess( req, res, next ); });
    app.options('/api/reset', function( req, res, next) {
            returnSuccess( req, res, next ); });
    app.options('/api/batchmaterials', function( req, res, next) {
        returnSuccess( req, res, next ); });
    app.options('/api/usersettings', function(req, res, next){
        returnSuccess( req, res, next ); });
    app.options('/api/avatar', function(req, res, next){
          returnSuccess( req, res, next ); });
    app.options('/api/messages/fresh', function(req, res, next){
        returnSuccess( req, res, next ); });
    app.options('/api/finduser', function(req, res, next){
            returnSuccess( req, res, next ); });
    // These options all seem to be outdated -- either because they're from
    // previous generations of the way of doing things -- or because they're
    // already included in my CollectionObjects array


    // app.options('/api/classregistrations', function(req, res, next){
    //     returnSuccess( req, res, next );
    // });
    //    app.options('/api/enrollments', function(req,res,next) {
    //    returnSuccess( req,res,next ); } );
    // app.options('/api/messages', function(req, res, next){
    //         returnSuccess( req, res, next ); });
    // app.options('/api/assets', function(req, res, next){
    //       returnSuccess( req, res, next ); });
      // app.options('/api/series', function(req, res, next){
    //                 returnSuccess( req, res, next ); });
    
    // app.options('/api/materials', function(req, res, next){
    //     returnSuccess( req, res, next ); });
     // app.options('/api/doc', function(req, res, next){
    //     returnSuccess( req, res, next ); });
    // app.options('/api/docimages', function(req, res, next){
    // returnSuccess( req, res, next );
    // });
    // app.options('/api/book', function(req, res, next){
    //                 returnSuccess( req, res, next ); });
    // app.options('/api/bookimages', function(req, res, next){
    //     returnSuccess( req, res, next );
    // });
                    
    // app.options('/courseimages', function(req, res, next){
    //     returnSuccess( req, res, next ); });

    
    // app.options('/api/users', function(req, res, next){
    //     returnSuccess( req, res, next ); });
    
    // app.options('/api/courses', function(req, res, next){
    //         returnSuccess( req, res, next ); });
    
    // app.options('/api/classes', function(req, res, next){
    //         returnSuccess( req, res, next ); });
    // app.options('/api/threads', function(req, res, next){
    //     returnSuccess( req, res, next ); });
    
    // app.options('/api/discussion/enter', function(req, res, next){
    //         returnSuccess( req, res, next ); });
        // app.options('/api/discussion/whosin*', function(req, res, next){
    //         returnSuccess( req, res, next ); });
    

};
