var config = require('../config');
var async = require('async');
var gm = require('gm');

var mime = require('mime');
var stream = require('stream');
var aws = require('aws-sdk');
var s3 = new aws.S3(config.aws);

aws.config.update({accessKeyId: 'AKIAIE52WOYO3ZPCPT3Q', secretAccessKey: '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'});


// function AvatarUpload() {

// }

function passStream(req, file, cb) {
    file.stream.once('data', function (firstChunk) {
        var outStream = new stream.PassThrough();
        var outStream2 = new stream.PassThrough();

        outStream.write(firstChunk);
        file.stream.pipe(outStream);

        outStream2.write(firstChunk);
        file.stream.pipe(outStream2);

        cb(null, outStream, outStream2)
    })
}

var AvatarUpload = function (req, file, cb) {
    var timestamp = Date.now().toString();
    // var nick = req.member.ss_mb_id;
    // file.endpoint = nick + "_" + timestamp + '.' + mime.extension(file.mimetype);
    //var fileName = nick.substring(0, 2) + '/' + file.endpoint;
    var fileName = 'avatars/' + req.query.id + '/' + file.originalname;
    passStream(req, file, function (err, outStream, outStream2) {

        async.parallel([
            function (callback) {

                var imageSize = 600;

                gm(outStream)
                    .resize(imageSize, imageSize, '^')
                    .autoOrient()
                    .noProfile()
                    .gravity('Center')
                    .crop(imageSize, imageSize)
                    .stream(function (err, stdout, stderr) {
                        if (err) return callback(err);
                        var upload = s3.upload({
                            Bucket: 'recloom',
                            Key: fileName,
                            ACL: 'public-read',
                            Body: stdout,
                            ContentType: file.mimetype
                        });

                        upload.send(function (err, results) {
                            if (err) return callback(err);

                            callback(null, results);
                        });
                    });
            },
            function (callback) {

                var imageSize = 50;

                gm(outStream2)
                    .resize(imageSize, imageSize, '^')
                    .autoOrient()
                    .noProfile()
                    .gravity('Center')
                    .crop(imageSize, imageSize)
                    .stream(function (err, stdout, stderr) {
                        if (err) return callback(err);
                        var upload2 = s3.upload({
                            Bucket: 'recloom',
                            Key: fileName,
                            ACL: 'public-read',
                            Body: stdout,
                            ContentType: file.mimetype
                        });

                        upload2.send(function (err, results) {
                            if (err) return callback(err);

                            callback(null, results);
                        })
                    });
            }
        ], function (err, results) {
            if (err) cb(err);
            else {
                cb(null, results);
            }
        });

    })

};


module.exports = AvatarUpload;