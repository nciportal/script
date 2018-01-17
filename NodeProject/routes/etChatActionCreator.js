/*eslint-env es6*/
/**
 * @author  : SSD1
 * @purpose : etChatActionCreator.js file is used for chat operations
 * @date    : 15 July 2016
 */
'use strict';
const common = require('./common');
const logger = common.logger;
const RedisPS = require('./redisPubSub');
const redisps = new RedisPS();
const DBStore = require('./etDbStore');
const dbStore = new DBStore.dbStore(redisps);

class ActionCreators {
	constructor() {
	}

	/**
 * @author  : SSD1
 * @param 	: iObj containing object of chat operation
 * @purpose : for operations of chat group
 * @date    : 15 July 2016
 */
	chatInit(iObj) {
		try{
			if(iObj) {
			logger.info('In etChatActionCreator : chatInit : ',JSON.stringify(iObj));
		//	let _operation= null;
//			if(iObj && iObj.hasOwnProperty('updateObj') && iObj.updateObj.hasOwnProperty('dataArray') && iObj.updateObj.dataArray.hasOwnProperty(0) && iObj.updateObj.dataArray[0].hasOwnProperty('ACTION_ARRAY')) {
//				 _operation = iObj.updateObj.dataArray[0].ACTION_ARRAY[0];
//			}else if(iObj && iObj.hasOwnProperty('insertObj') && iObj.insertObj.hasOwnProperty('dataArray') && iObj.insertObj.dataArray.hasOwnProperty(0) && iObj.insertObj.dataArray[0].hasOwnProperty('ACTION_ARRAY')) {
//				 _operation = iObj.insertObj.dataArray[0].ACTION_ARRAY[0];
//			}else{
//				let _completeSyncJSON={
//						'Failure': true,
//						'Message': 'Action Array is not present in Object!!!!',
//						'type': 'error',
//				};
//				dbStore.emitByUserId(iObj.clientInfo.userId, null, 'ErrorFromServer', JSON.stringify(_completeSyncJSON));
//				let _obj = {
//						type: 'ERROR',
//						error_status: true,
//				};
//				return _obj;
		//	}
			let _operation= null;
			_operation = iObj.dataArray[0].actionArray[0];
			switch(_operation) {
				case 'ADD_CHAT' 			:
				case 'ADD_CHAT_MESSAGE' 	:
				case 'DELETE_CHAT_MESSAGE' :
				case 'ADD_INVITEE' :
				case 'REMOVE_INVITEE' :
				case 'DELETE_CHAT'		    :
				case 'UPDATE_CHAT' :
				case 'UPDATE_INVITEE':	
				case 'UPDATE_CHAT_INVITEE' :
				case 'UPDATE_UNREAD_COUNT' :
				case 'UPDATE_MESSAGE' : 
				case 'UPDATE_CHAT_WORKSPACE':	
				case 'DELETE_SINGLE_CHAT'   :		
				case 'UPDATE_CML_IS_LATEST':
				case 'IMPORTANT_CONVERSATION':
				case 'DELETE_ANNOUNCEMENT':	
				case 'SET_WORKSPACE':	
				case 'UPDATE_ATTACHMENT'://Added by SJ : Archana
												let _returnObj = {
														type: _operation,
														status: true,
														Object: iObj,
													};
													return _returnObj;

				default 					: let _completeSyncJSON={
						                                'Failure': true,
						                                'Message': 'No such Action_Array present!!!!',
						                                'type': 'error',
				                                   };
				                                  dbStore.emitByUserId(iObj.clientInfo.userId, null, 'ErrorFromServer', JSON.stringify(_completeSyncJSON));
				                                  let _obj = {
				                                		  type: 'ERROR',
				                                		  error_status: true,
				                                  };
				                                  return _obj;
			}
		  }
		}catch(e) {
			logger.error('In etChatActionCreator : chatInit : Exception : ', e);
		}
	}
}

let d=new ActionCreators();
d.chatInit();

exports.ActionCreators = ActionCreators;