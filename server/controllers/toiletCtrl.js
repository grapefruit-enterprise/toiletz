var Toilet = require('../models/toiletModel.js');
var User = require('../models/userModel.js');
var url = require('url');
var axios = require('axios');
var awsStream = require('../helpers/aws-streaming.js')
// var busboy = require('connect-busboy')
// var API_KEY = require('../../keys.js');

module.exports = {
  '/': {
    get: function(req,res) {
      console.log("Received GET at /api/toilet/");
      console.log("getting all toilets");

      Toilet.findAllToilets()
        .then(function(toilets) {
          if (toilets.length === 0) {
            console.log("no toilets exist yet");
            res.end("no toilets exist yet");
          } else {
            console.log("toilets exist");
            res.send(toilets);
          }
        });
    },


    post: function(req, res) {
      console.log("Received POST at /api/toilet/");
      console.log("creating toilet");
      console.log('req busby', req.body);

      //create function to handle file aws
      //call aws-stream function

      // awsStream.createS3Link(req.body.img)

      var newToilet = {
        name: req.body.name,
        description: req.body.description,
        id_Users: req.body.id_Users,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        img: req.body.img
      };

      Toilet.findToiletByLocation(newToilet.latitude, newToilet.longitude)
        .then(function(toilet) {
          if (toilet) {
            console.log("toilet already added");
          } else {
            console.log("toilet does not exist");

            Toilet.createToilet(newToilet)
              .then(function(result) {
                console.log("result create toilet", result);

                return res.send(result);
              });
          }
        });
    },
    put: function(req, res) {
      console.log("Received PUT at /api/toilet/");
      res.end("Received PUT at /api/toilet/");
    },
    delete: function(req, res) {
      console.log("Received DELETE at /api/toilet/");
      res.end("Received DELETE at /api/toilet/");
    }
  },
  '/location': {
    get: function(req,res) {
      console.log("Received GET at /api/toilet/location");
    },
    post: function(req, res) {
      console.log("Received POST at /api/toilet/location");

      var loc = {
        lat: req.body.latitude,
        long: req.body.longitude,
        address: req.body.address
      };

      Toilet.findToiletsInRadius(loc.lat, loc.long)
        .then(function(result) {
          console.log("returned radius stuff");
          res.send(result);
        });

    },
    put: function(req, res) {
      console.log("Received PUT at /api/toilet/location");
      res.end("Received PUT at /api/toilet/location");
    },
    delete: function(req, res) {
      console.log("Received DELETE at /api/toilet/location");
      res.end("Received DELETE at /api/toilet/location");
    }
  },
  '/:toiletId': {
    get: function(req,res) {
      console.log("Received GET at /api/toilet/:toiletId");

      var toiletID = url.parse(req.url,true).path.slice(1);

      Toilet.findToiletById(toiletID)
        .then(function(toilet) {
          if (toilet) {
            console.log("toilet", toiletID, "was found, returning");
            res.send(toilet);
          } else {
            console.log("toilet", toiletID, "was not found");
            res.end("toilet " + toiletID + " was not found");
          }
        });
    },
    post: function(req, res) {
      console.log("Received POST at /api/toilet/:toiletId");
      res.end("Received POST at /api/toilet/:toiletId");
    },
    put: function(req, res) {
      console.log("Received PUT at /api/toilet/:toiletId");
      res.end("Received PUT at /api/toilet/:toiletId");
    },
    delete: function(req, res) {
      console.log("Received DELETE at /api/toilet/:toiletId");
      res.end("Received DELETE at /api/toilet/:toiletId");
    }
  }
};
