const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Calendar} = require('./../models/calendar');

const calendars = [{
  _id: new ObjectID(),
  clinic: 'First test clinic',
  google_address: 'http://sssssss'
}, {
  _id: new ObjectID(),
  clinic: 'Second test clinic',
  google_address: 'http://aaaa'
}];

beforeEach((done) => {
  Calendar.remove({}).then(() => {
    return Calendar.insertMany(calendars);
  }).then(() => done());
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


