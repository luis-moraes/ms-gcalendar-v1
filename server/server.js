require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Calendar} = require('./models/calendar');



var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/calendar', (req, res) => {
  var calendar = new Calendar({
    clinic: req.body.clinic,
    google_address: 'dfghjkdfghjkcvbnm'
  });

  calendar.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});


app.get('/calendar', (req, res) => {
  Calendar.find().then((calendars) => {
    res.send({calendars});
  }, (e) => {
    res.status(400).send(e);
  });
});


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
