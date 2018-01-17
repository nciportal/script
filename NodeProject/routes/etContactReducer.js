/*eslint-env es6*/
/**
 * @author  : SSD1
 * @purpose : etContactReducer.js is for redux states of contact module
 * @date    : 15 July 2016
 */

'use strict';
const common		= require('./common');
const logger = common.logger;

class ContactReducer {
	constructor() {
	}

	sendDataToJava(iObj) {
		try{
			switch(iObj.moduleName) {
			case 'TSK' :
			case 'CDE' :
			case 'UGR' :
				logger.info('In etContactReducer : sendDataToJava : moduleName : ', iObj.moduleName);
				common.queueLibs.sendToJavaProcess(iObj, common.appConfigObj.client['mode']);
				break;
			default:
				logger.info('In etContactReducer : sendDataToJava : moduleName : in default case : ', iObj.moduleName);
			}
		} catch(err) {
			logger.error('In etContactReducer : sendDataToJava : Exception : ', err);
		}
	}

	reducer(state, action) {
		let contact = new ContactReducer();
		let _newState = null;
		let INITIAL_STATE_CONTACT = {

		};

		state = state || INITIAL_STATE_CONTACT;
		let type;
		if(action)

			switch (action.type) {
			case 'ADD_CONTACT' :
			case 'UPDATE_CONTACT':
			case 'ADD_GROUP' :
			case 'DELETE_CONTACT' :
			case 'BLOCK_CONTACT' :
			case 'UNBLOCK_CONTACT' :
			case 'DELETE_GROUP':
			case 'UPDATE_GROUP' :
			case 'ADD_ADDRESS':
			case 'SHARE_CONTACTS' :
			case 'TEMP_DELETE_CONTACT'	:
			case 'ACTIVE_DELETE_CONTACT':
			case "NEW_SHARE_CONTACT"        : //Added by SJ  To add unlisted contact in contact list :Amar
			case 'PERMENENT_DELETE_CONTACT':
			case 'SET_WORKSPACE':		
				             contact.sendDataToJava(action.Object);
							 type = action.type;
							_newState = Object.assign({}, state, {_actionArray: type});
							return _newState;

			case 'ERROR' 			:logger.info('In etContactReducer : reducer : In ERROR case');
							 _newState = Object.assign({}, state, {ERROR: action.error_status});
							 return _newState;

			default 			 :return state;

			}
	}
}

exports.ContactReducer = ContactReducer;