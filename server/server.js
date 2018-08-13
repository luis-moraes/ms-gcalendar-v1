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
