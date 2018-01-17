/**
 * @author : SSD1
 * @date : 
 * @purpose : etLoginReducer
 * @param : states and action
 */
'use strict';
const common		= require('./common');
const logger      = common.logger; 

class LoginReducer{
	constructor(){
	}
	
	 sendDataToJava(iObj){
		try{
			logger.info('In etLoginReducer : sendDataToJava : ', new Date().getTime());
			if(iObj.hasOwnProperty('baton')){
				iObj.baton.push({Location: 'etLoginReducer_sendDataToJava : node', Timestamp: new Date().getTime()})
				logger.info("In etLoginActionCreator : " , iObj.baton);
			}else{
				let baton = [];
				iObj.baton = baton;
				iObj.baton.push({Location: 'etLoginReducer_sendDataToJava : node', Timestamp: new Date().getTime()})
				logger.info("In etLoginActionCreator : " , iObj.baton);
			}
			common.queueLibs.sendToJavaProcess(iObj,common.appConfigObj.client['mode'],null,"LOGIN");
		} catch(err){
			logger.error('In etLoginReducer : sendDataToJava : Exception : ',err);
		}
	}

	 reducer (state, action) {
		let _newState = null;
		let type = null;
		let INITIAL_STATE_LOGIN = {
		};
		let login = new LoginReducer();
		state = state || INITIAL_STATE_LOGIN;
		if(action)
		
		switch (action.type) {
		case "LOGIN"       :  login.sendDataToJava(action.Object);
				      type = action.type;
				      _newState = Object.assign({},state,{ACTION_ARRAY : type});
				      return _newState;

		case "ERROR" 	   :  type = action.type;
							  _newState = Object.assign({},state,{ACTION_ARRAY : "ERROR"});
							 return _newState;
									  
		default     	   :return state;
			
		}
	}
}

exports.LoginReducer = LoginReducer;