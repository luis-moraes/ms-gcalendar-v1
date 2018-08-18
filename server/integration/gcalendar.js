const CONFIG = require('./../config/settings');
const {Calendar} = require('./../models/calendar');

const CalendarAPI = require('node-google-calendar');
let cal = new CalendarAPI(CONFIG); 
const userId = CONFIG.userId;

function createCalendar(title) {
  let params = { summary: title };
  return cal.Calendars.insert(params).then(resp => {
    console.log(resp);
    return resp;
  }).catch(err => {
    console.log(err.message);
  });
}
function grantUserOwnerPermissionToCalendar(calendarId, userId) {
  let params = {
    scope: {
      type: 'user',
      value: userId
    },
    role: 'writer'
  };
  let optionalQueryParams = {
    sendNotifications: true
  };
  return cal.Acl.insert(calendarId, params, undefined)
    .then(resp => {
      console.log(resp);
      return resp;
    }).catch(err => {
      console.log(err.message);
    });
}

function getExistingCalendarInCalendarList(calendarId) {
  return cal.CalendarList.get(calendarId)
    .then(resp => {
      console.log(resp);
      return resp;
    }).catch(err => {
      console.log(err.message);
    });
}

function createNewCalendarAndGrantAccess(calendar) {
  // 1. create a new calendar thru service account
  // 2. grant your google account owner permission of calendar
  // 3. check that it appears on your calendarList (and on the left of your google calendar WebUI)
  // 4. (optional) tear down by deleting created calendar with its id
  return createCalendar(calendar.clinicName).then(newCal => {
    console.log(`Created calendar: ${newCal.id}`);

    grantUserOwnerPermissionToCalendar(newCal.id, CONFIG.userId).then(aclRuleCreated => {
      console.log(aclRuleCreated);
    });

    grantUserOwnerPermissionToCalendar(newCal.id, calendar.ownerEmail).then(aclRuleCreated => {
      console.log(aclRuleCreated);
      
    
    });

    return newCal.id;
  });
}



module.exports.createNewCalendar = createNewCalendarAndGrantAccess;


