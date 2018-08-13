var mongoose = require('mongoose');

var Calendar = mongoose.model('Calendar', {
  clinic: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  google_address: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {Calendar};
