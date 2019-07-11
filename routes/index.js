var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("SERVER - homepage requested");
  //res.render('index', { title: 'Express' });
  res.sendFile('main.html', { root: 'public' });
});

module.exports = router;
