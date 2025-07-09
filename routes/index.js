var express = require('express');
var router = express.Router();

/* GET home page with dashboard. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '鵝價 CPI 儀表板' });
});

module.exports = router;
