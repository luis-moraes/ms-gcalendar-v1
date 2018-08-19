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

app.delete('/calendar/:clinicId/event', (req, res) => {

  
  var clinicId = req.params.clinicId;
  var startDateTime = req.query.startDateTime;
  var endDateTime = req.query.endDateTime;

  if (!clinicId  || !startDateTime || !endDateTime) {
    return res.status(404).send();
  }

  Calendar.findOne({'clinicId' : clinicId}).then((calendar) => {
    var gcalId = calendar.gcalId;

      gcal.deleteEventsWithinDateRange(gcalId,startDateTime,endDateTime).then(resp => {
        if(resp){
          res.status(200).send();
        }else{
          res.status(400).send();
        }

      }).catch((e) => {
        res.status(500).send();
      });
    }).catch((e) => {
      res.status(400).send();
    });
  
});


app.get('/calendar/:clinicId/event', (req, res) => {

  
  var clinicId = req.params.clinicId;
  var startDateTime = req.query.startDateTime;
  var endDateTime = req.query.endDateTime;

  if (!clinicId  || !startDateTime || !endDateTime) {
    return res.status(404).send();
  }

  Calendar.findOne({'clinicId' : clinicId}).then((calendar) => {
    var gcalId = calendar.gcalId;

      gcal.listSingleEventsWithinDateRange(gcalId,startDateTime,endDateTime).then(resp => {
        res.send(resp);

      }).catch((e) => {
        res.status(500).send();
      });
    }).catch((e) => {
      res.status(400).send();
    });
  
});


app.get('/calendar/:clinicId', (req, res) => {
  
  var cId = req.params.clinicId;
  

  if (!cId) {
    return res.status(404).send();
  }

  Calendar.findOne({'clinicId' : cId}).then((calendar) => {
    var calId = calendar.gcalId;

    var resp = {
      gcalendarOwnerLink : `https://calendar.google.com/calendar/r?cid=${calId}`,
      gcalendarPublicLink : `https://calendar.google.com/calendar/embed?src=${calId}&ctz=America%2FSao_Paulo`
    }

    res.send(resp);

    }).catch((e) => {
      res.status(400).send();
    });
  
});

app.post('/calendar', (req, res) => {
  var calendar = new Calendar({
    clinicName: req.body.clinicName,
    clinicId: req.body.clinicId,
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

app.post('/calendar/:clinicId/event', (req, res) => {
  
  var cId = req.params.clinicId;
  var clientName = req.body.clientName;
  var startDateTime = req.body.startDateTime;
  var endDateTime = req.body.endDateTime;
  var voucherCode = req.body.voucherCode;

  if (!cId  || !clientName || !startDateTime || !endDateTime) {
    return res.status(404).send();
  }

  Calendar.findOne({'clinicId' : cId}).then((calendar) => {
    var gcalId = calendar.gcalId;

      gcal.insertEvent(gcalId,clientName,startDateTime,endDateTime,voucherCode).then(resp => {
        res.status(201).send();

      }).catch((e) => {
        res.status(500).send();
      });
    }).catch((e) => {
      res.status(400).send();
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
