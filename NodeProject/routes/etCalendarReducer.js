/**
 * @author  : SSD1
 * @purpose : etContactReducer.js is for redux states of contact module
 * @date    : 15 July 2016
 */
/*eslint-env es6*/
'use strict';
const common		= require('./common');
const logger = common.logger;
let flag = null;

class CalendarReducer {
	constructor() {
	}
	
	reducer(state, action) {
		
		let INITIAL_STATE_CALENDAR= {
		};
		
		state = state || INITIAL_STATE_CALENDAR;
		//let _stateObject = {};
		const cal = new CalendarReducer();
		const cal2 = new CalendarReducer();
		if(action)
			switch (action.type) {
			 case 'ADD_EVENT' :
			
			 case 'DELETE_EVENT_BY_RECIPIENT' :
			 case 'UPDATE_EVENT' :
			 case 'DECLINE_EVENT' :
			 case 'PROPOSE_EVENT' :
			 case 'DELETE_INVITEE' :
			 case 'INSERT_ATTACHEMENT' :
			 case 'DELETE_ATTACHEMENT' :
			 case 'ACCEPT_EVENT' :
			 case 'ARCHIVE_EVENT' :
			 case 'ADD_RPE_EVENT' :
			 case 'UPDATE_RPE_EVENT' :
			 case 'DELETE_RPE_EVENT_BY_RECIPIENT' :
			 case 'DECLINE_RPE_EVENT' :
			 case 'PROPOSE_RPE_EVENT' :
			 case 'INSERT_ATTACHMENT' :
			 case 'DELETE_ATTACHMENT' :
			 case 'ARCHIVE_RPE_EVENT' :
			 case 'UNARCHIVE_RPE_EVENT':
			 case 'RPE_TO_SINGLE' :
			 case 'ADD_MLT_EVENT' :
			 case 'UPDATE_MLT_EVENT' :
			 case 'DELETE_MLT_EVENT_BY_RECIPIENT' :
			 case 'DECLINE_MLT_EVENT' :
			 case 'PROPOSE_MLT_EVENT' :
			 case 'ARCHIVE_MLT_EVENT' :
			 case 'MLT_TO_SINGLE' :
			 case 'ACCEPT_MLT_EVENT':
			 case 'ACCEPT_RPE_EVENT':
			 case 'INSERT_INVITEE':
			 case 'ADD_MEETING':
			 case 'Meeting':
			 case 'DELETE_MEETING_BY_RECIPIENT':
			 case 'UPDATE_MEETING':
			 case 'DECLINE_MEETING':
			 case 'PROPOSE_MEETING':
			 case 'ACCEPT_MEETING':
			 case 'ARCHIVE_MEETING':
			 case 'UNARCHIVE_MEETING':
			 case 'MAYBE_MEETING':
			 case 'MAYBE_EVENT':
			 case 'UPDATE_INVITEE':
			 case 'ADD_DAY_SCHEDULE':
			 case 'UPDATE_DAY_SCHEDULE':
			
			 case 'ADD_WEEK_SCHEDULE' :
			 case 'UPDATE_WEEK_SCHEDULE':
			
			 case 'ADD_IMAGE_CALENDAR':
			 case 'UPDATE_IMAGE_CALENDAR':
			
			 case 'DAY_EVENT':
			 case 'ADD_IMAGE_EVENT':  //Added By GSS:Himayat
			 case 'UPDATE_IMAGE_EVENT':  //Added By GSS:Himayat
			// case 'DELETE_IMAGE_EVENT':  //Added By GSS:Himayat
			 case 'PUBLISH_IMAGE_CALENDAR'://Added By GSS:for publishing image calendar:Himayat
			 case 'REPUBLISH_IMAGE_CALENDAR'://Added By GSS:for republishing image calendar:Himayat
			 case 'UNSUBSCRIBE_IMAGE_CALENDAR'://Added By GSS:for unsubscribing image calendar:Himayat
			 case 'PUBLISH_DAY_SCHEDULE'://Added by SSD : for publish day schedule :Himayat
			 case 'REPUBLISH_DAY_SCHEDULE' : //Added by SSD : for republishing day schedule: Himayat
			 case 'SUBSCRIBE_DAY_SCHEDULE'://Added by SSD: for subscribing day schedule :Himayat 	
			 case 'ADD_DAY_EVENT' ://Added by SSD : for adding day event  :Himayat	 
			 case 'UPDATE_DAY_EVENT'://Added by SSD : for  updating day event :Himayat
			 case 'DELETE_DAY_EVENT'://Added by SSD : for  updating day event :Himayat 
			 case 'ADD_WEEK_SCHEDULE'://Added by SSD : for adding week schedule :Himayat
			 case 'UPDATE_WEEK_SCHEDULE'://Added by SSD : for updating week schedule :Himayat
			 case 'PUBLISH_WEEK_SCHEDULE'://Added by SSD : for  publishing  week schedule :Himayat
			 case 'SUBSCRIBE_WEEK_SCHEDULE'://Added by SSD : for  subscribing week schedule :Himayat
			 case 'ADD_WEEK_EVENT'://Added by SSD : for inserting event in week schedule :Himayat
			 case 'UPDATE_WEEK_EVENT'://Added by SSD : for updating event in week schedule :Himayat
			 case 'ADD_RPE_MEETING'://Added by SSD : Sagar
			 case 'ADD_IMG_CALENDAR'://Added by SSD  : Arun
			 case 'ADD_IMG_EVENT'://Added by SSD : komal	
			 case 'SET_WORKSPACE':
			 case 'UPDATE_IMG_EVENT'://Added by SJ : Akshay
			 case 'ACCEPT_PROPOSE_EVENT'://Added by SJ : Arun
			 case 'UPDATE_RPE_MEETING': //Added by SJ : Komal
			 case 'ACCEPT_RPE_MEETING'://Added by SJ : Komal
			 case 'PROPOSE_RPE_MEETING'://Added by SJ :Komal
			 case 'ACCEPT_PROPOSED_RPE_EVENT'://Added by SJ : Komal
			 case 'ACCEPT_PROPOSED_RPE_MEETING'://Added by SJ : Komal
			 case 'DECLINE_MPMS_EVENT'://Added by SJ : Arun
			 case 'DECLINE_MPMS_MEETING'://Added by SJ : Arun
			 case 'ARCHIVE_RPE_MEETING'://Added by SJ : Komal
			 case 'UNARCHIVE_RPE_MEETING'://Added by SJ :  komal
			 case 'UNARCHIVE_EVENT': //Added by SJ komal
			 case 'MAYBE_RPE_EVENT'://Added by SSD : Komal
			 case 'MAYBE_RPE_MEETING'://Added by SSD : Komal
				 
				flag =false;
				var _newState = Object.assign( {}, state, {CML_ID: action.calId, ACTION_ARRAY: action.type} );
				cal.sendtoJava(action._obj);
				logger.debug(' in etCalendarReducer : state ', _newState);
				return _newState;
			 case 'SUBSCRIBE_THIRD_PARTY_CAL':
				   flag =false;
				  _newState = Object.assign( {}, state, {CML_ID: action.calId, SUBSCRIBE_THIRD_PARTY_CAL: action.actionPerformed} );
				
					break;
				
			 case 'DELETE_RPE_EVENT' :
			 case 'DELETE_MLT_EVENT':
			 case 'DELETE_WEEK_SCHEDULE':
			 case 'DELETE_EVENT' :
			 case 'DELETE_DAY_SCHEDULE':
			 case 'DELETE_WEEK_EVENT':	
			 case 'DELETE_IMAGE_EVENT':	 
			 case 'DELETE_IMAGE_CALENDAR':
			 case 'DELETE_MEETING':
			 case 'DELETE_TEMP_EVENT'://Added by SJ : Sagar 
			 case 'DELETE_TEMP_MEETING': //Added by Sj : Sagar
			 case 'DELETE_IMG_EVENT'://Added by SJ :  Akshay
			 case 'DELETE_IMG_CALENDAR': //Added by SJ : Akshay
			 flag = true;
				 _newState = Object.assign( {},state,{CML_ID: action.calId, ACTION_ARRAY: action.type});
					cal2.sendtoJava(action._obj);
					return _newState;

			default :
				return state;
			}
	}

	sendtoJava(iSingleCallObject) {
		try{
			logger.info('In etCalendarReducer : sendtoJava');
			if(iSingleCallObject && iSingleCallObject.hasOwnProperty('baton')){
				iSingleCallObject.baton.push({Location: 'etCalendarReducer_sendJava : node', Timestamp: new Date().getTime()});
			}else{
				let baton = [];
				iSingleCallObject.baton = baton
				iSingleCallObject.baton.push({Location: 'etCalendarReducer_sendJava : node', Timestamp: new Date().getTime()});
			}
			if(flag === true){
				common.queueLibs.sendToJavaProcess(iSingleCallObject,common.appConfigObj.client['mode'],null,"DELETE");
			}else{
				common.queueLibs.sendToJavaProcess(iSingleCallObject,common.appConfigObj.client['mode']);
			}
			
		}catch(err) {
			logger.error('In etCalendarReducer : sendtoJava : Exception : ', err);
		}
	}
}

exports.CalendarReducer = CalendarReducer;