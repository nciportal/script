/*eslint-env es6*/
'use strict';
const common		= require('./common');
const logger = common.logger;

class EmailReducer {
	constructor(state, action) {
		
	}

	sendDataToJava(iObj) {
		console.log('In etEmailReducer : sendDataToJava : moduleName :::::::::::::::::::::::::::::::::: ');
		console.log(iObj);

		try{
			logger.info('In etEmailReducer : sendDataToJava : ');
			if(iObj.hasOwnProperty('moduleName')){
			switch(iObj.moduleName) {
			case 'EML' :
			case 'EAD' :
			case 'ONDEMAND_EMAIL':
				logger.info('In etEmailReducer : sendDataToJava : moduleName : ', iObj);
				common.queueLibs.sendToJavaProcess(iObj,common.appConfigObj.client['mode'],null,"THIRDPARTY_OPERATION");
				break;
			
			default :
				logger.info('In etEmailReducer : sendDataToJava : moduleName : in default case : ', iObj.moduleName);
			}
			}else{
				logger.error('In etEmailReducer : sendDataToJava : moduleName is not present :  ', iObj);				
			}
		} catch(err) {
			logger.error('In etEmailReducer : sendDataToJava : Exception : ', err);
		}
	}

	reducer(state, action) {
		let _newState = null;
		let INITIAL_STATE_EMAIL = {
		};
		const email = new EmailReducer();

		state = state || INITIAL_STATE_EMAIL;
		if(action)

			switch (action.type) {
			case 'ADD_EMAIL_ACC' :
			case 'DELETE_EMAIL_ACC':
			case 'FETCH_MAIL':
			case 'UPDATE_EMAIL_ACC':
			case 'UPDATE_MAIL':
			case 'SEND_MAIL':
			case 'SAVE_MAIL':
			case 'SYNC_MAIL':
			case 'MOVE_MAIL':
			case 'DELETE_MAIL' :
			case 'MARK_MAIL':
		//	case 'ADD_FOLDER' :
			case 'UPDATE_FOLDER':
			case 'SEARCH_MAIL':
			case 'FETCH_THREAD' :
			case 'FORWARD_MAIL' :
			case 'REPLY_MAIL':
			case 'REPLY_ALL_MAIL':
			case 'UPDATE_DRAFT':
			case 'SAVE_DRAFT': 
			case 'UPDATE_COUNT':
			case 'SET_WORKSPACE':
				                    logger.info('In etEmailReducer : reducer : ');
									email.sendDataToJava(action.Object);
									console.log("action.Objectaction.Objectaction.Object : ");
									console.log(action.Object)
									_newState = Object.assign( {}, state, {CML_ID: action.cmlId, ACTION_ARRAY: action.type} );
									return _newState;
			default :
				return state;
			}
	}
}

exports.EmailReducer = EmailReducer;