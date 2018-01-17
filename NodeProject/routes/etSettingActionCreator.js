'use strict';
/*eslint-env es6*/
/**
 * @author GSS
 * @purpose Setting ActionCreator
 * Date - 11-08-2016
*/

const common= require('./common');
const logger = common.logger;

class actionCreators {
	constructor() {
	}

	settingInit(iObj) {
		try{
	//		logger.info('In etSettingActionCreator : settingInit : STEP 3 : UserId :', iObj.clientInfo.userId);
			let _operation=null;
			let cmlID = null;
			if(iObj) {
			/*	if(iObj && iObj.hasOwnProperty('updateObj') && iObj.updateObj.hasOwnProperty('dataArray') && iObj.updateObj.dataArray.hasOwnProperty(0) && iObj.updateObj.dataArray[0].hasOwnProperty('ACTION_ARRAY')) {
					logger.info('In etSettingActionCreator : settingInit : iObj.updateObj : STEP 3 : UserId : ', iObj.clientInfo.userId, 'ACTION_ARRAY : ', iObj.updateObj.dataArray[0].ACTION_ARRAY);
					_operation = iObj.updateObj.dataArray[0].ACTION_ARRAY[0];
				}else if(iObj && iObj.hasOwnProperty('insertObj') && iObj.insertObj.hasOwnProperty('dataArray') && iObj.insertObj.dataArray.hasOwnProperty(0) && iObj.insertObj.dataArray[0].hasOwnProperty('ACTION_ARRAY')) {
					logger.info('In etSettingActionCreator : settingInit : iObj.insertObj : STEP 3 : UserId : ', iObj.clientInfo.userId, 'ACTION_ARRAY : ', iObj.insertObj.dataArray[0].ACTION_ARRAY);
					_operation = iObj.insertObj.dataArray[0].ACTION_ARRAY[0];
				}*/
				_operation = iObj.dataArray[0].actionArray[0];
				//let _UpdateObj = iObj.updateObj || iObj.insertObj;

//				if( _UpdateObj.hasOwnProperty('dataArray') && _UpdateObj.dataArray[0].hasOwnProperty('CML_ID') ) {
//					cmlID = _UpdateObj.dataArray[0].CML_ID;
//				}else{
//					cmlID = _UpdateObj.dataArray[0].CON_PARAM.PKVAL;
//				}
				if(_operation) {
			/*Object for sent to dispatch*/
					let _SettingRequest = {
							type: _operation,
							actionPerformed: true,
							_obj1: iObj,
						//	cmlId: cmlID,
					};
					return _SettingRequest;
					
				}
			}
		}catch(err) {
			logger.error('In etSettingActionCreator : settingInit : Exception : ', err);
		}
	}

}
exports.actionCreators = actionCreators;
