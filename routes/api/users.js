/*var express = require('express');
var router = express.Router();

/!* GET users listing. *!/
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;*/

const express = require('express');
const router = express.Router();

/* @route   GET api/users
*  @desc    Test route
*  @access  Public*/
router.get('/', (req, res) => res.send('user route'));

module.exports = router;