// Sample CalendarAPI settings
const SERVICE_ACCT_ID = 'sinaxys-gcalendar@sinaxys-212519.iam.gserviceaccount.com';
//const KEYFILE = 'your-google-api-keyfile.pem';				//path to pem key
const TIMEZONE = 'UTC+08:00';
const CALENDAR_ID = {
	'primary': 'n2igsnmg99c6c4oa8f4inc9f1s@group.calendar.google.com',
	'calendar-1': 'bm4drvc88quipocp89tbbfaoio@group.calendar.google.com',
};
const userId = 'devteam@sinaxys.com';

module.exports.serviceAcctId = SERVICE_ACCT_ID;
//module.exports.keyFile = KEYFILE;
module.exports.timezone = TIMEZONE;
module.exports.calendarId = CALENDAR_ID;
module.exports.userId = userId;



// Example for using json keys
 var key = require('./../googleapi-key.json').private_key;
 module.exports.key = key;