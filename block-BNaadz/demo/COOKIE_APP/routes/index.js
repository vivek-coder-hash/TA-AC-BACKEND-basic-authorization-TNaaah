var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.cookie('name', 'narendra');
  res.send('cookie stored');
});
router.get('/request', function (req, res, next) {
  console.log('Cookies: ', req.cookies);
});

module.exports = router;
