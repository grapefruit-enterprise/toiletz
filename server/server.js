var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var app = express();
var morgan = require('morgan');
var path = require('path');
var jwt = require('jsonwebtoken');
var helpers = require('./helpers/helpers.js');
var http = require('http');
var formidable = require('formidable');
var path = require('path');


var Knox = require('knox');
var moment = require('moment');
var crypto = require('crypto');

Knox.aws = Knox.createClient({
  key: 'AKIAJCT6UQUUKJ7IWFYQ',
  secret: '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',
  bucket: 'temp123456789987654321'
});

// //for file upload
// var busboy = require('connect-busboy');
// var methodOverride = require('method-override')
// var config = require('dotenv').config();

var dotenv = require('dotenv').config();

var db = require('./db/db.js');

var routesReview = require('./routes/routesReview.js');
var routesUser = require('./routes/routesUser.js');
var routesToilet = require('./routes/routesToilets.js');
var routesAuth = require('./routes/routesAuth.js');
var routesTag = require('./routes/routesTag.js');

//file upload

// app.use(busboy());
// app.use(methodOverride());
//
// console.log('busboy', busboy)

app.use(bodyParser.json());

app.post('/api/toilet', function(req, res)  {



  var form = new formidable.IncomingForm();


  // console.log('inside from', form)


    var parsed = form.parse(req);
    var reallyBuffedObj = parsed._parser.data

    console.log('inside parsed', parsed._parser.data)
    console.log('req.body *******', req.body)
    
  //   form.on('fileBegin', function (name, file){
  //        file.path = __dirname + '/uploads/' + file.name;
  //    });
  //
  //    form.on('file', function (name, file){
  //      console.log('Uploaded ' + file.name);
  //  });
  //
  //   form.on('fileBegin', function (name, file){
  //
  //     // Concat the chunks into a Buffer
  //     var finalBuffer = Buffer.concat(reallyBuffedObj);
  //
  // console.log('inside ************* end', finalBuffer)
  //
  //     req.files[fieldname] = {
  //       buffer: finalBuffer,
  //       size: finalBuffer.length,
  //       filename: filename,
  //       mimetype: mimetype
  //     };
  //
  //     // Generate date based folder prefix
  //     var datePrefix = moment().format('YYYY[/]MM');
  //     var key = crypto.randomBytes(10).toString('hex');
  //     var hashFilename = key + '-' + filename;
  //
  //     var pathToArtwork = '/images/' + datePrefix + '/' + hashFilename;
  //
  //     var headers = {
  //       'Content-Length': req.files[fieldname].size,
  //       'Content-Type': req.files[fieldname].mimetype,
  //       'x-amz-acl': 'public-read'
  //     };
  //
  //     Knox.aws.putBuffer(req.files[fieldname].buffer, pathToArtwork, headers, function(err, response){
  //       if (err) {
  //         console.error('error streaming image: ', new Date(), err);
  //         return next(err);
  //       }
  //       if (response.statusCode !== 200) {
  //         console.error('error streaming image: ', new Date(), err);
  //         return next(err);
  //       }
  //       console.log('Amazon response statusCode: ', response.statusCode);
  //         console.log('Amazon response ********START: ', response, 'Amazon response ********  END');
  //       console.log('Your file was uploaded');
  //
  //     });
  //   });






});




app.use(morgan('dev'));

// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }

app.use(express.static('./'));

//Routing
app.use('/api/review', routesReview);
app.use('/api/user', routesUser);
app.use('/api/toilet', routesToilet);
app.use('/api/auth', routesAuth);
app.use('/api/tag', routesTag);


app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '../', 'index.html'));
});

app.set('port', 3000);

app.listen(app.get('port'), function() {
  db.ensureSchema();
  console.log(moment().format('h:mm:ss a') + ': Express Server listening on port', app.get('port'));
});
