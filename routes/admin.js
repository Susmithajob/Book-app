var express = require('express');
var router = express.Router();
var multer = require('multer');
var bookModel = require('./users');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });


router.get('/', async(req, res, next)=> {
  try{
    const count = await bookModel.countDocuments();
    res.render('admin',{count});
  }
  catch(err){
    res.status(500).send('Server Error');
  }
  
});

router.post('/', upload.single('imageData'), function(req, res) {
  if (!req.body.bookName || !req.body.author || !req.body.description) {
    return res.status(400).send('All fields are required');
  }
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

router.get('/booklist', function(req, res, next) {
  bookModel.find()
    .then(bookModels => {
      res.render('booklist', {
        books: bookModels
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

router.get('/edit', async function(req, res, next) {
  try {
    const book = await bookModel.findById(req.query.bookId);
    res.render('edit', { book });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



router.post('/delete', function(req, res) {
 
  bookModel.deleteOne({ _id: req.body.bookId })
    .then(() => {
      res.redirect('/admin/booklist');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});



router.post('/update', upload.single('imageData'), function(req, res, next) {
  console.log(req.body.bookId);

  bookModel.findById(req.body.bookId)
    .then(book => {
      if (!book) {
        return res.status(404).send('Book not found');
      }

      book.bookName = req.body.bookName;
      book.author = req.body.author;
      book.description = req.body.description;

      if (req.file) {
        book.imageData = {
          data: req.file.buffer,
          contentType: req.file.mimetype
        };
      }
      return book.save(); // Save the updated book
    })
    .then(() => {
      res.redirect('/admin/booklist'); // Redirect after the book is updated
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});


module.exports = router;