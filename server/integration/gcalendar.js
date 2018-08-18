const CONFIG = require('./../config/settings');
const {Calendar} = require('./../models/calendar');

const CalendarAPI = require('node-google-calendar');
let cal = new CalendarAPI(CONFIG); 
const userId = CONFIG.userId;


function insertEvent(calendarId, clientName, startDateTime, endDateTime, voucherCode) {
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


