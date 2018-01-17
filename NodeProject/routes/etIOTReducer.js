/*eslint-env es6*/
/**
 * @author : SSD1
 * @date :
 * @purpose : etIOTReducer
 * @param : states and action
 */
'use strict';
const common		= require('./common');
const logger = common.logger;
let flag = null;
class iotReducer {
	constructor() {
	}

	sendDataToJava(iObj) {
		if(flag === true){
			common.queueLibs.sendToJavaProcess(iObj,common.appConfigObj.client['mode'],null,"DELETE");
		}else{
			 common.queueLibs.sendToJavaProcess(iObj, common.appConfigObj.client['mode']);
		}
	}

	reducer(state, action) {
		let _newState = null;  let type = null;
		let INITIAL_STATE_IOT = {

		};

		state = state || INITIAL_STATE_IOT;
		const iot = new iotReducer();
		if(action)
			switch (action.type) {
			case 'ADD_NODE_RECEIVER': 
			case 'ADD_HUB_FLOOR' : 
			case 'ADD_HUB_ROOM':
			case 'UPDATE_HUB_FLOOR' :
			case 'UPDATE_HUB_ROOM':		
			case 'ADD_NODE_DEVICE':
			case 'ADD_NODE_SENSOR':	
			case 'PROVISION_HUB_DEVICE':
			case 'SOFT_RESET_HUB':
			case 'trigger_scene':
				                        flag = false;
										iot.sendDataToJava(action.Object);
										type = action.type;
										_newState = Object.assign({}, state, {ACTION_ARRAY: type});
										return _newState;
			case 'DELETE_HUB_FLOOR' :				
			case 'DELETE_HUB_ROOM' :    flag = true;
										iot.sendDataToJava(action.Object);
										type = action.type;
										_newState = Object.assign({}, state, {ACTION_ARRAY: type});
										return _newState;
			default 					:
				                         return state;

			}
	}
}

exports.iotReducer = iotReducer;