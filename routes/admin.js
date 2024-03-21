var express = require('express');
var router = express.Router();
var multer = require('multer');
var bookModel = require('./users');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });


router.get('/', function(req, res, next) {
  res.render('admin');
});

router.post('/', upload.single('imageData'), function(req, res) {
  var bookData = new bookModel({
      bookName: req.body.bookName,
      author: req.body.author,
      description: req.body.description,
      imageData: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
  });
  bookData.save();
  res.redirect('/admin');

  // Save the bookData to the database
  // bookData.save(function(err, savedBook) {
  //     if (err) {
  //         console.error(err);
  //         return res.status(500).send('Failed to save book data');
  //     }
  //     res.redirect('/'); // Redirect to the home page or a success page
  // });
});

module.exports = router;