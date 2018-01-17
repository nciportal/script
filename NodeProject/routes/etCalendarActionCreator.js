/**
 * @author : RMM
 * @purpose : etCalendarActionCreator file is used to route any organization related request to java
 * @date : 13/7/2016
 */
/*eslint-env es6*/
/*require files and modules*/
"use strict";
const common = require('./common');
const logger = common.logger;
class calActionCreators {
	constructor() {}

	calInit(iSingleCallObject) {
		try{
			logger.info('In etCalendarActionCreator : calInit',JSON.stringify(iSingleCallObject));
			if(iSingleCallObject.hasOwnProperty('baton')){  
				iSingleCallObject.baton.push({Location: 'etCalendarActionCreator_calInit : node', Timestamp: new Date().getTime()});
			}
			if( iSingleCallObject ) {   /*If iObject is not null*/
				const _UpdateEventObj = iSingleCallObject.dataArray[0] ;
				const _userId = iSingleCallObject.userId;
	//			logger.info('In etCalendarActionCreator : calAction : iSingleCallObject : STEP 3 : UserId : ', _userId, 'ACTION_ARRAY : ', _UpdateEventObj.dataArray[0].ACTION_ARRAY);
				let calId = null;
				/*if( _UpdateEventObj.hasOwnProperty('dataArray') && _UpdateEventObj.dataArray[0].hasOwnProperty('CML_ID')) {
					calId = _UpdateEventObj.dataArray[0].CML_ID;
				}else if( _UpdateEventObj.dataArray[0].hasOwnProperty('RPE_CML_ID')) {
					calId = _UpdateEventObj.dataArray[0].RPE_CML_ID;
				}else{
					calId = _UpdateEventObj.dataArray[0].CON_PARAM.PKVAL;
				}*/
				let _socket = null;
			/*	if( iSingleCallObject.hasOwnProperty('socket')){
					_socket = iSingleCallObject.socket;
					delete iSingleCallObject.socket;
					iSingleCallObject.socketId = _socket.id;
				}*/
				/*All actions from front end request are present in actionArray*/
				if( _UpdateEventObj  && _UpdateEventObj.hasOwnProperty('actionArray')) {
					switch( _UpdateEventObj.actionArray[0] ) {
					case 'ADD_EVENT' :
					case 'INSERT_INVITEE' :
					case 'DELETE_EVENT' :
					case 'DELETE_EVENT_BY_RECIPIENT' :
					case 'UPDATE_EVENT' :
					case 'DECLINE_EVENT' :
					case 'PROPOSE_EVENT' :
					case 'DELETE_INVITEE' :
					case 'INSERT_ATTACHEMENT' :
					case 'DELETE_ATTACHEMENT' :
					case 'ACCEPT_EVENT' :
					case 'ARCHIVE_EVENT' :
					case 'UNARCHIVE_EVENT':
					case 'ADD_RPE_EVENT' :
					case 'UPDATE_RPE_EVENT' :
					case 'DELETE_RPE_EVENT' :
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
					case 'DELETE_MLT_EVENT' :
					case 'DELETE_MLT_EVENT_BY_RECIPIENT' :
					case 'DECLINE_MLT_EVENT' :
					case 'PROPOSE_MLT_EVENT' :
					case 'ARCHIVE_MLT_EVENT' :
					case 'MLT_TO_SINGLE' :
					case 'ADD_MEETING' :
					case 'Meeting' :
					case 'DELETE_MEETING' :
					case 'DELETE_MEETING_BY_RECIPIENT' :
					case 'UPDATE_MEETING' :
					case 'DECLINE_MEETING' :
					case 'PROPOSE_MEETING' :
					case 'ACCEPT_MEETING' :
					case 'ARCHIVE_MEETING' :
					case 'UNARCHIVE_MEETING':
					case 'MAYBE_MEETING' :
					case 'MAYBE_EVENT' :
					case 'ACCEPT_MLT_EVENT':
					case 'ACCEPT_RPE_EVENT':
					case 'SUBSCRIBE_THIRD_PARTY_CAL':
					case 'UPDATE_INVITEE':    //demanded by himayat
					case 'ADD_DAY_SCHEDULE':  // requirement by pratibha
					case 'UPDATE_DAY_SCHEDULE': //        ""
					case 'DELETE_DAY_SCHEDULE': //       ""
					case 'ADD_WEEK_SCHEDULE' : //       ""
				//	case 'UPDATE_WEEK_SCHEDULE'://       ""
					case 'DELETE_WEEK_SCHEDULE'://       ""
					case 'ADD_IMAGE_CALENDAR':  //       ""
					case 'UPDATE_IMAGE_CALENDAR'://       ""
					case 'DELETE_IMAGE_CALENDAR'://       ""
					case 'DAY_EVENT'	:
					case 'ADD_IMAGE_EVENT':  //Added By GSS:Himayat
					case 'UPDATE_IMAGE_EVENT':  //Added By GSS:Himayat
					case 'DELETE_IMAGE_EVENT':  //Added By GSS:Himayat
					case 'PUBLISH_IMAGE_CALENDAR'://Added By GSS:for publishing image calendar:Himayat
					case 'REPUBLISH_IMAGE_CALENDAR'://Added By GSS:for republishing image calendar:Himayat
					case 'UNSUBSCRIBE_IMAGE_CALENDAR'://Added By GSS:for unsubscribing image calendar:Himayat
					case 'PUBLISH_DAY_SCHEDULE'://Added by SSD : for publish day schedule :Himayat
					case 'REPUBLISH_DAY_SCHEDULE' : //Added by SSD : for republishing day schedule: Himayat
					case 'SUBSCRIBE_DAY_SCHEDULE'://Added by SSD: for subscribing day schedule :Himayat
					case 'ADD_DAY_EVENT' ://Added by SSD : for day event  :Himayat
					case 'UPDATE_DAY_EVENT'://Added by SSD : for  updating day event :Himayat
					case 'DELETE_DAY_EVENT'://Added by SSD : for  updating day event :Himayat 
					case 'ADD_WEEK_SCHEDULE'://Added by SSD : for adding week schedule :Himayat
					case 'UPDATE_WEEK_SCHEDULE'://Added by SSD : for updating week schedule :Himayat
					case 'DELETE_WEEK_SCHEDULE'://Added by SSD : for deleting week schedule:Himayat
					case 'PUBLISH_WEEK_SCHEDULE'://Added by SSD : for publishing  week schedule :Himayat
					case 'SUBSCRIBE_WEEK_SCHEDULE'://Added by SSD : for subscribing week schedule :Himayat
					case 'ADD_WEEK_EVENT'://Added by SSD : for inserting event in week schedule :Himayat
					case 'UPDATE_WEEK_EVENT'://Added by SSD : for updating event in week schedule :Himayat
					case 'DELETE_IMAGE_EVENT'://Added by SSD :Himayat
					case 'DELETE_WEEK_EVENT'://Added by SSD : Himayat
					case 'ADD_RPE_MEETING'://Added by SSD : Sagar
					case 'DELETE_TEMP_EVENT'://Added by SJ : Sagar 
					case 'DELETE_TEMP_MEETING': //Added by Sj : Sagar
					case 'ADD_IMG_CALENDAR'://Added by SSD  : Arun 	
					case 'ADD_IMG_EVENT'://Added by SSD : komal	
					case 'SET_WORKSPACE':
					case 'DELETE_IMG_EVENT'://Added by SJ :  Akshay
					case 'UPDATE_IMG_EVENT'://Added by SJ : Akshay
					case 'DELETE_IMG_CALENDAR': //Added by SJ : Akshay
					case 'DECLINE_MPMS_EVENT'://Added by SJ : Arun
					case 'DECLINE_MPMS_MEETING'://Added by SJ : Arun
					case 'ACCEPT_PROPOSE_EVENT'://Added by SJ : Arun
					case 'UPDATE_RPE_MEETING': //Added by SJ : Komal
					case 'ACCEPT_RPE_MEETING'://Added by SJ : Komal
					case 'PROPOSE_RPE_MEETING'://Added by SJ :Komal
					case 'ACCEPT_PROPOSED_RPE_EVENT'://Added by SJ : Komal
					case 'ACCEPT_PROPOSED_RPE_MEETING'://Added by SJ : Komal
					case 'ARCHIVE_RPE_MEETING'://Added by SJ : Komal
					case 'UNARCHIVE_RPE_MEETING'://Added by SJ :  komal
					case 'MAYBE_RPE_EVENT'://Added by SSD : Komal
					case 'MAYBE_RPE_MEETING'://Added by SSD : Komal
							
						/*Object for sent to dispatch*/
						const _calRequest = {
							type: _UpdateEventObj.actionArray[0],
							userId: _userId,
							calId: calId,
							actionPerformed: true,
							_obj: iSingleCallObject,
					};
						logger.info('In etCalendarActionCreator : orgAction : _calRequest :');
						/*call dispatch to maintain state*/
						return _calRequest;
						

					default:
						logger.info('In etCalenderActionCreator : actionCreators : default case : STEP 3 : UserId : ', _userId);
					if( _socket ) {
						_socket.emit('ErrorFromServer', 'Action in action-array was not present in calender object');
					}
					}
					
				}else{
					/*return error to client side */
					logger.info('In etCalenderActionCreator : actionCreators : Action Array was not present : STEP 3 : UserId : ', _userId);
					if( _socket ) {
						_socket.emit('ErrorFromServer', 'Action in action-array was not present in calender object : STEP 3 : UserId : ', _userId);
					}
				}
			}else{
				logger.info('In etCalenderActionCreator : actionCreators : empty single server call : STEP 3 ');
			}
		}catch( error ) {
			logger.error('In etCalenderActionCreator : actionCreators  : exception ', error );
		}
	}
}

/*Export functions */
exports.calActionCreators = calActionCreators;