const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Calendar} = require('./../models/calendar');

const calendars = [{
  _id: new ObjectID(),
  clinicName: 'First test clinic',
  ownerEmail: 'luiscomp@gmail.com'
}, {
  _id: new ObjectID(),
  clinicName: 'Second test clinic',
  ownerEmail: 'luiscomp@gmail.com'
}];

beforeEach((done) => {
  Calendar.remove({}).then(() => {
    return Calendar.insertMany(calendars);
  }).then(() => done());
});


describe('POST /calendar', () => {
  it('should create a new calendar', (done) => {
    var clinic  = {
      clinicName : 'Test calendar clinic',
      ownerEmail : 'luiscomp@gmail.com'
    } ;

    request(app)
      .post('/calendar')
      .send({clinic})
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Calendar.find({clinic}).then((calendar) => {
          expect(calendar.length).toBe(1);
          expect(calendar[0].clinic).toBe(clinic);
          done();
        }).catch((e) => done(e));
      });
  });

  
});

describe('GET /calendar', () => {
  it('should get all calendar', (done) => {
    request(app)
      .get('/calendar')
      .expect(200)
      .expect((res) => {
        expect(res.body.calendars.length).toBe(2);
      })
      .end(done);
  });
});


