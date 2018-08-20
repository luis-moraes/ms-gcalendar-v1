const CONFIG = require('./../config/settings');
const {Calendar} = require('./../models/calendar');

const CalendarAPI = require('node-google-calendar');
let cal = new CalendarAPI(CONFIG); 
const userId = CONFIG.userId;
var moment = require('moment-timezone');


function getFreeOrBusy(events,dateTime){
  if(events && dateTime){

    for (let i = 0; i < events.length; i++) {
      if(moment(dateTime)>=moment(events[i].start) && moment(dateTime) < moment(events[i].end)){
        return 'busy';
      }
    }
    
  }
  return 'free';
}

function deleteEventsWithinDateRange(calendarId, startDateTime, endDateTime) {
  let eventsArray = [];
    listSingleEventsWithinDateRange(gcalId,startDateTime,endDateTime).then(resp => {
      if(resp){
        for (let i = 0; i < resp.length; i++) {
          deleteEvent(calendarId,resp[i].id);
        }
        return true;
      }
      

  }).catch((e) => {
    console.log(e);
    return false;
  });
  return false;
}



function deleteEvent(calendarId, eventId) {
	let params = {
		sendNotifications: true
	};
	return cal.Events.delete(calendarId, eventId, params)
		.then(resp => {
			console.log('Deleted Event Response: ');
			console.log(resp);
			return resp;
		})
		.catch(err => {
			console.log('Error: deleteEvent', JSON.parse(err.message));
		});
}

function listSingleEventsWithinDateRange(calendarId, startDateTime, endDateTime) {
	let eventsArray = [];
	let params = {
		timeMin: startDateTime,
		timeMax: endDateTime,
		q: '',
		singleEvents: true,
		orderBy: 'startTime'
	}

	return cal.Events.list(calendarId, params)
		.then(json => {
			for (let i = 0; i < json.length; i++) {
        
				let event = {
					id: json[i].id,
					summary: json[i].summary,
          location: json[i].location,
          //convert dates to same TimeZone of starDateTime
					start: moment(json[i].start.dateTime).tz("America/Sao_Paulo").format(),
					end: moment(json[i].end.dateTime).tz("America/Sao_Paulo").format(),
					status: json[i].status
				};
				eventsArray.push(event);
			}
			console.log('List of events on calendar within time-range:');
			console.log(eventsArray);
			return eventsArray;
		}).catch(err => {
			console.log('Error: listSingleEventsWithinDateRange', err.message);
		});
}


function insertEvent(calendarId, clientName, startDateTime, endDateTime, voucherCode,clientEmail) {
  var description;
  if(voucherCode){
    description = `Reserva Sinaxys - Cliente: ${clientName} ** Voucher: ${voucherCode} **`;
  }else{
    description = `Reserva Sinaxys - Cliente: ${clientName}.`;
  }
  let event = {
		'start': {
			'dateTime': startDateTime
		},
		'end': {
			'dateTime': endDateTime
		},
		'summary': `Reserva Sinaxys - Cliente: ${clientName}`,
		'description': description,
    'colorId': 1
	};

  if(clientEmail){
     event = {
      'start': {
        'dateTime': startDateTime
      },
      'end': {
        'dateTime': endDateTime
      },
      'summary': `Reserva Sinaxys - Cliente: ${clientName}`,
      'description': description,
      'colorId': 1,
      "attendees": [
        {
          "email": clientEmail,
          "displayName": clientName
        }
      ]
    };
  }
	
	let optionalQueryParams = {
		sendNotifications: true
	};

	return cal.Events.insert(calendarId, event, optionalQueryParams)
		.then(resp => {
			console.log(resp);
			let results = {
				id: resp.id,
				'summary': resp.summary,
				'location': resp.location,
				'status': resp.status,
				'start': resp.start.dateTime,
				'end': resp.end.dateTime,
				'created': new Date(resp.created)
			};
			console.log('inserted event:');
			console.log(results);
			return results;
		})
		.catch(err => {
			console.log('Error: insertEvent', err.message);
		});
}

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
module.exports.insertEvent = insertEvent;
module.exports.listSingleEventsWithinDateRange = listSingleEventsWithinDateRange;
module.exports.deleteEventsWithinDateRange = deleteEventsWithinDateRange;
module.exports.getFreeOrBusy = getFreeOrBusy;

