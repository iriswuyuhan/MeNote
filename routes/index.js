var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* LOGIN page. */
router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Express'});
});


/*SIGNUP page*/
router.get('/signup', function (req, res, next) {
    res.render('signup', {title: 'Express'});
});

module.exports = router;