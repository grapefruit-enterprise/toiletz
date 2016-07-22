var controllers = require('../controllers/toiletCtrl.js');
var router = require('express').Router();
var helpers = require('../helpers/helpers.js');
var busboy = require('connect-busboy');

// router.post('/', helpers.tokenCheck, controllers['/'].post);
// router.post('/', controllers['/'].post);

for (var route in controllers) {
  router.route(route)
  .get(controllers[route].get)
  // .post(controllers[route].post)
  .put(controllers[route].put)
  .delete(controllers[route].delete);
}

module.exports = router;
