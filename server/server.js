require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Calendar} = require('./models/calendar');
const gcal = require('./integration/gcalendar');






var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/calendar', (req, res) => {
  var calendar = new Calendar({
    clinicName: req.body.clinicName,
    ownerEmail: req.body.ownerEmail
  });

  gcal.createNewCalendar(calendar).then((calId) => {
    calendar.gcalId = calId;

  
    calendar.save().then((doc) => {
      var resp = {
        gcalendarOwnerLink : `https://calendar.google.com/calendar/r?cid=${calId}`,
        gcalendarPublicLink : `https://calendar.google.com/calendar/embed?src=${calId}&ctz=America%2FSao_Paulo`
      }

      res.send(resp);
    }, (e) => {
      res.status(400).send(e);
    });


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
