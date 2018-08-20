var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 4000;
  process.env.MONGODB_URI = 'mongodb://sinaxys:sinaxys2018@ds127362.mlab.com:27362/sinaxys-mongodb';
} else if (env === 'test') {
  process.env.PORT = 4000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/CalendarMsTest';
}
