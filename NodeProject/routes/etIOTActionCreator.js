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
	iotInit(iObj) {
		try{
			if(iObj) {
				let action_array;
				if(iObj && iObj.insertObj){
					 action_array = iObj.insertObj.dataArray[0].ACTION_ARRAY[0];
				}else{
					 action_array = iObj.updateObj.dataArray[0].ACTION_ARRAY[0];
				}
			
				switch(action_array){
				case 'ADD_NODE_RECEIVER':
				case 'ADD_NODE_DEVICE':
				case 'ADD_NODE_SENSOR':
				case 'ADD_HUB_FLOOR':
				case 'ADD_HUB_ROOM':
				case 'UPDATE_HUB_FLOOR' :
				case 'UPDATE_HUB_ROOM':	
				case 'DELETE_HUB_FLOOR' :				
				case 'DELETE_HUB_ROOM' : 
				case 'PROVISION_HUB_DEVICE':
				case 'SOFT_RESET_HUB':
									let _returnObj = {
												type: action_array,
												status: true,
												Object: iObj,
												};
									return _returnObj;
				
	
				default :
									let _completeSyncJSON={
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
                  					break;
				}
			}
		}catch(e) {
			logger.error('In etIOTActionCreator : iotInit : Exception : ', e);
		}
	}
}

exports.ActionCreators = ActionCreators;