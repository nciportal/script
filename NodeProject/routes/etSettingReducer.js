/*eslint-env es6*/
/**
 * @author  : SSD1
 * @purpose : etContactReducer.js is for redux states of contact module
 * @date    : 15 July 2016
 */

'use strict';
const common		= require('./common');
const logger = common.logger;

class SettingReducer {
	constructor() {
	}

	 sendDataToJava(iObj) {
		try{
			logger.info('In etSettingReducer : sendDataToJava : ');
			common.queueLibs.sendToJavaProcess(iObj, common.appConfigObj.client['mode']);
		} catch(err) {
			logger.error('In etSettingReducer : sendDataToJava : Exception : ', err);
		}
	}

	 reducer(state, action) {
		 let _newState = null;
		 let INITIAL_STATE_SETTING = {

		 };
		const setting = new SettingReducer();
		state = state || INITIAL_STATE_SETTING;
		if(action)

		switch (action.type) {

	    case 'INSERT_USER_POFILE' :
	    	setting.sendJava(action._obj1);
	    	state = state || INITIAL_STATE_SETTING;
			 _newState = Object.assign( {}, state, {INSERT_SETTING: action.cmlId} );
			logger.info(' In etsettingReducer : settingReducer : INSERT_USER_POFILE : STEP 4 : UserId : ', action._obj1.clientInfo.userId);
			return _newState;

	    case 'UPDATE_USER_POFILE' :
	    	setting.sendJava(action._obj1);
	    	state = state || INITIAL_STATE_SETTING;
			_newState = Object.assign( {}, state, {UPDATE_SETTING: action.cmlId} );
			logger.info(' In etsettingReducer : settingReducer : UPDATE_USER_POFILE : STEP 4 : UserId : ', action._obj1.clientInfo.userId);
			return _newState;

	    default :
			return state;
		}
	}
}

exports.SettingReducer = SettingReducer;
