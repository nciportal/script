/*eslint-env es6*/
/**
 * @author : SSD1
 * @date :
 * @purpose : etChatReducer
 * @param : states and action
 */
'use strict';
const common		= require('./common');
const logger = common.logger;

class ChatReducer {
	constructor() {
	}

	sendDataToJava(iObj) {
		try{
			if(iObj.hasOwnProperty('moduleName')){
			switch(iObj.moduleName) {
			case 'CHT':
			case 'CGR':
				logger.info('In etChatReducer : sendDataToJava : moduleName : ', iObj.moduleName);
				common.queueLibs.sendToJavaProcess(iObj, common.appConfigObj.client['mode'], null, 'BUSINESS_LOGIC');
				break;
			default :
				logger.info('In etChatReducer : sendDataToJava : moduleName : in default case : ', iObj.moduleName);
			}
			}else{
				logger.error('In etChatReducer : sendDataToJava : moduleName is not present :  ', iObj);				
			}
		} catch(err) {
			logger.error('In etChatReducer : sendDataToJava : Exception : ', err);
		}
	}

	reducer(state, action) {
		let _newState = null; /*let ACTION_ARRAY = null;*/ let type = null;
		let INITIAL_STATE_CHAT = {

		};

		state = state || INITIAL_STATE_CHAT;
		const chat = new ChatReducer();
		if(action)
			switch (action.type) {
			case 'ADD_CHAT' 			:
			case 'ADD_CHAT_MESSAGE' 	:
			case 'DELETE_CHAT_MESSAGE' :
			case 'ADD_INVITEE' :
			case 'REMOVE_INVITEE' :
			case 'DELETE_CHAT'		    :
			case 'UPDATE_CHAT' :
			case 'UPDATE_INVITEE' :
			case 'UPDATE_CHAT_INVITEE' :	
			case 'UPDATE_UNREAD_COUNT'	:
			case 'UPDATE_MESSAGE' :
			case 'UPDATE_CHAT_WORKSPACE':
			case 'DELETE_SINGLE_CHAT':
			case 'UPDATE_CML_IS_LATEST':
			case 'IMPORTANT_CONVERSATION':
			case 'DELETE_ANNOUNCEMENT':
			case 'SET_WORKSPACE':
			case 'UPDATE_ATTACHMENT'://Added by SJ : Archana
										 chat.sendDataToJava(action.Object);
										 type = action.type;
										 _newState = Object.assign({}, state, {ACTION_ARRAY: type});
										 return _newState;

			case 'ERROR' 				: type = action.type;
										  _newState = Object.assign({}, state, {ACTION_ARRAY: 'ERROR'});
										  return _newState;
			default 					:return state;

			}
	}
}

exports.ChatReducer = ChatReducer;