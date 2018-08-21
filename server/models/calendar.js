var mongoose = require('mongoose');

var Calendar = mongoose.model('Calendar', {
  clinicName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  location: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  ownerEmail: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
  ,
  gcalId: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  clinicId: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {Calendar};
