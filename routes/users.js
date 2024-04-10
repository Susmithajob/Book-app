const mongoose = require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/bookdetail");//name of database

const bookSchema = mongoose.Schema({
  bookName: {
    type:String,
    required:true
  },

  author: {
    type:String,
    required:true
  },

  description: {
    type:String,
    required:true
  },
  imageData: {
    data: Buffer, 
    contentType: String
  }
})

module.exports = mongoose.model("bookdetails",bookSchema);//name of collection