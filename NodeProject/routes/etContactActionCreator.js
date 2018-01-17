'use Strict';
const common		= require('./common');
const logger=common.logger;
const RedisPS=require('./redisPubSub');
const redisps = new RedisPS();
const DBStore 	= require('./etDbStore');
const dbStore = new DBStore.dbStore(redisps);

class actionCreators{
	constructor(){
	}
	contactInit(iObj){
		try{	
			logger.info("In etContactActionCreator : contactInit : ");
			let _operation = null ;
			_operation = iObj.dataArray[0].actionArray[0];
	/*		if(iObj && iObj.hasOwnProperty('updateObj') && iObj.updateObj.hasOwnProperty('dataArray') && iObj.updateObj.dataArray.hasOwnProperty(0) && iObj.updateObj.dataArray[0].hasOwnProperty('ACTION_ARRAY')){
				_operation = iObj.updateObj.dataArray[0].ACTION_ARRAY[0];
			}else if(iObj && iObj.hasOwnProperty('insertObj') && iObj.insertObj.hasOwnProperty('dataArray') && iObj.insertObj.dataArray.hasOwnProperty(0) && iObj.insertObj.dataArray[0].hasOwnProperty('ACTION_ARRAY')){
				_operation = iObj.insertObj.dataArray[0].ACTION_ARRAY[0];
			}else{*/
				/*logger.info("Action Array is not present in object!!!!");
				let _completeSyncJSON={
						"Failure":true,
						"Message":"Action Array is not present in object!!!!",
						type:'error'
				};
				dbStore.emitByUserId(iObj.userId, null, 'ErrorFromServer', JSON.stringify(_completeSyncJSON));
				let _obj = {
						type 			 : "ERROR",
						error_status     : true
				};
				return _obj;*/
		//	}
			switch(_operation){
				case "ADD_CONTACT" 				:  
				case "UPDATE_CONTACT"    		: 
				case "ADD_GROUP"               	: 
				case "DELETE_CONTACT"          	: 
				case "BLOCK_CONTACT"           	: 
				case "UNBLOCK_CONTACT"         	: 
				case "DELETE_GROUP"            	: 
				case "UPDATE_GROUP"             : 
				case "ADD_ADDRESS"              : 
				case "SHARE_CONTACTS"	        : 
				case "TEMP_DELETE_CONTACT"      :    
				case "ACTIVE_DELETE_CONTACT"	: 
				case "NEW_SHARE_CONTACT"        : //Added by SJ  To add unlisted contact in contact list :Amar
				case "PERMENENT_DELETE_CONTACT" :
				case 'SET_WORKSPACE':	
					logger.info("In etContactActionCreator : contactInit : ACTION_ARRAY : ",_operation);
					let _returnObj = {
															type : _operation,
															status : true,
															Object : iObj
				                                    }; 
													return _returnObj;
													
													
				default   					    : let _completeSyncJSON={
														"Failure":true,
														"Message":"No such Action_Array present!!!!",
														 type:'error'
												  };
												dbStore.emitByUserId(iObj.clientInfo.userId, null, 'ErrorFromServer', JSON.stringify(_completeSyncJSON));
												let _obj = {
														type 			 : "ERROR",
														error_status    : true
												};
												return _obj;
			 }
		}catch(e){
			logger.error("In etContactActionCreator : actionCreators : Exception :",e.message);
		}
		
	}
	
}
exports.actionCreators = actionCreators;