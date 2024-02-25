const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide Item name'],
    maxlength: 50,
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: 1000,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  urlToImage: {
    type: String,
    required:[true,'Please provide link for the url'],
    maxlength: 1000,
  },
  price:{
    type: String,
    required:true,
    maxlength:100,
  },
  id:{
    type : Number,
    required:true,
  }
},
  { timestamps: true }
)

module.exports = mongoose.model('Item',CartSchema);