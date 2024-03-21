var express = require('express');
var router = express.Router();
var bookModel = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
  bookModel.find({})
    .then(bookModels => {
      res.render('display', {
        books: bookModels
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

module.exports = router;
