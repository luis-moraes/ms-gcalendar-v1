const CONFIG = require('./../config/settings');
const {Calendar} = require('./../models/calendar');

const CalendarAPI = require('node-google-calendar');
let cal = new CalendarAPI(CONFIG); 
const userId = CONFIG.userId;

const GCALENDAR_LINK = 'https://calendar.google.com/calendar/r?cid=';

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

function grantPublicReadPermissionToCalendar(calendarId, userId) {
  let params = {
    scope: {
      type: 'default'
    },
    role: 'reader'
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
  
  return createCalendar(`Sinaxys - ${calendar.clinicName}`).then(newCal => {
    console.log(`Created calendar: ${newCal.id}`);

    grantUserOwnerPermissionToCalendar(newCal.id, CONFIG.userId).then(aclRuleCreated => {
      console.log(aclRuleCreated);
    });

    grantUserOwnerPermissionToCalendar(newCal.id, calendar.ownerEmail).then(aclRuleCreated => {
      console.log(aclRuleCreated);
      
    
    });

    grantPublicReadPermissionToCalendar(newCal.id, calendar.ownerEmail).then(aclRuleCreated => {
      console.log(aclRuleCreated);
      
    
    });

    return newCal.id;
  });
}



module.exports.createNewCalendar = createNewCalendarAndGrantAccess;


