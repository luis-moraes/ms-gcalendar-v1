const CONFIG = require('./../server/config/settings');

const CalendarAPI = require('node-google-calendar');
let cal = new CalendarAPI(CONFIG); 
const userId = CONFIG.userId;



  
    
calendarsExamples();
    
    function calendarsExamples() {

    let testCalendarId = CONFIG.calendarId.primary;
       getCalendar(testCalendarId);
       createNewCalendarExample();
       createNewCalendar('newly created calendar');
       updateCalendar(testCalendarId, 'test calendar', 'this calendar is meant for development', 'Singapore');
      // deleteCalendar(testCalendarId);
    }
    
    function calendarListExamples() {
      getAllCalendarsInCalendarList();
      // getExistingCalendarInCalendarList('aa9ls9ve7p4iaeltdpdb1cloc0@group.calendar.google.com');
      // addExistingCalendarIntoCalendarList('u6b96tevc6mrsknp6e7gr04ld4@group.calendar.google.com');
      // deleteCalendarOffCalendarList('u6b96tevc6mrsknp6e7gr04ld4@group.calendar.google.com');
      // clearAllEventsInCalendar('aa9ls9ve7p4iaeltdpdb1cloc0@group.calendar.google.com');
    }
    
    function createNewCalendarExample() {
      // 1. create a new calendar thru service account
      // 2. grant your google account owner permission of calendar
      // 3. check that it appears on your calendarList (and on the left of your google calendar WebUI)
      // 4. (optional) tear down by deleting created calendar with its id
      createNewCalendar('dev calendar (node-google-calendar)').then(newCal => {
        console.log(`Created calendar: ${newCal.id}`);
    
        grantUserOwnerPermissionToCalendar(newCal.id, CONFIG.userId).then(aclRuleCreated => {
          console.log(aclRuleCreated);
    
          getExistingCalendarInCalendarList(newCal.id)
            .then(resp => {
              console.log(resp);
            });
        });
      });
    }
    
    //calendarList
    function getAllCalendarsInCalendarList() {
      let params = {
        showHidden: true
      };
      cal.CalendarList.list(params)
        .then(resp => {
          console.log(resp);
        }).catch(err => {
          console.log(err.message);
        });
    }
    
    function addExistingCalendarIntoCalendarList(calendarId) {
      let params = {
        summaryOverride: 'insert summary new',
        selected: true,
        hidden: false,
      };
      cal.CalendarList.insert(calendarId, params)
        .then(resp => {
          console.log(resp);
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
    
    function updateCalendarInCalendarList(calendarId) {
      // Modifies user-specific calendar properties
      let params = {
        selected: true,
        summaryOverride: 'updated new calendar summary',
        hidden: false
      };
    
      cal.CalendarList.update(calendarId, params).then(resp => {
        console.log(resp);
      }).catch(err => {
        console.log(err.message);
      });
    }
    
    function deleteCalendarOffCalendarList(calendarId) {
      cal.CalendarList.delete(calendarId).then(resp => {
        console.log(resp);
      }).catch(err => {
        console.log(err.message);
      });
    }
    
    // Calendars
    function getExistingCalendar(calendarId) {
      return cal.Calendars.get(calendarId)
        .then(resp => {
          console.log(resp);
          return resp;
        }).catch(err => {
          console.log(err.message);
        });
    }
    
    function createNewCalendar(title) {
      let params = { summary: title };
      return cal.Calendars.insert(params).then(resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.log(err.message);
      });
    }
    
    function updateCalendar(calendarId, summary, description, location) {
      let params = {
        description: description,
        location: location,
        summary: summary,
        timeZone: 'Asia/Singapore'
      };
      return cal.Calendars.update(calendarId, params).then(resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.log(err.message);
      });
    }
    
    function deleteCalendar(calendarId) {
      return cal.Calendars.delete(calendarId).then(resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.log(err.message);
      });
    }
    
    function getCalendar(calendarId) {
      return cal.Calendars.get(calendarId).then(resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.log(err.message);
      });
    }
    
    function clearAllEventsInCalendar(calendarId) {
      return cal.Calendars.clear(calendarId).then(resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.log(err.message);
      });
    }
    
    function runAclExamples() {
      let calendarId = CONFIG.calendarId.test;
      listAclOfCalendar(calendarId);
      // getAclRule(calendarId, 'user:' + calendarId);
      // grantUserOwnerPermissionToCalendar(calendarId, userId);
      // updateUserPermissionToCalendarToReadOnly(calendarId, 'user:' + userId, userId);
      // removeUserPermissionToCalendar(calendarId, 'user:' + userId);
    }
    
    function getAclRule(calendarId, ruleId) {
      return cal.Acl.get(calendarId, ruleId)
        .then(resp => {
          console.log(resp);
          return resp;
        }).catch(err => {
          console.log(err.message);
        });
    }
    
    function listAclOfCalendar(calendarId) {
      let params = { showDeleted: true };
      return cal.Acl.list(calendarId, params)
        .then(resp => {
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
          value: 'devteam@sinaxys.com'
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
    
    function removeUserPermissionToCalendar(calendarId, ruleId) {
      return cal.Acl.delete(calendarId, ruleId)
        .then(resp => {
          console.log(resp);
          return resp;
        }).catch(err => {
          console.log(err.message);
        });
    }
    
    function updateUserPermissionToCalendarToReadOnly(calendarId, ruleId, userId) {
      let params = {
        scope: {
          type: 'user',
          value: userId
        },
        role: 'reader'
      };
      let optionalQueryParams = {
        sendNotifications: true
      };
      return cal.Acl.update(calendarId, ruleId, params, query)
        .then(resp => {
          console.log(resp);
          return resp;
        }).catch(err => {
          console.log(err.message);
        });
    }