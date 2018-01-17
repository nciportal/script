/**
 * @author  : SSD1 
 * @purpose : etEmailActionCreator.js file is used for email operations
 * @date    : 5 July 2016
 */
'use strict';
const common = require('./common');
const logger=common.logger;
const DBStore = require('./etDbStore');
const dbStore=new DBStore.dbStore();

class actionCreators{
	constructor(){
	}
	emailInit(iObj){
		
			logger.info("In etEmailActionCreator : actionCreators");
			let _operation = null;
			 _operation = iObj.databaseObj.dataArray[0].actionArray[0];
			 if(iObj){
					let iObject = null;
					if(iObj.hasOwnProperty('databaseObj')){
						iObject = iObj.databaseObj;
					}else{
						iObject = iObj;
					}
					
					let cmlId  = null;
					/*if(_UpdateEventObj.hasOwnProperty('dataArray') &&  _UpdateEventObj.dataArray[0].hasOwnProperty('CML_ID') ){
						cmlId  = _UpdateEventObj.dataArray[0].CML_ID;
					}else if(_UpdateEventObj.hasOwnProperty('dataArray') &&  _UpdateEventObj.dataArray.hasOwnProperty(0) &&  _UpdateEventObj.dataArray[0].hasOwnProperty('CON_PARAM')  &&  _UpdateEventObj.dataArray[0].CON_PARAM.hasOwnProperty('PKVAL') ){				
						cmlId  = _UpdateEventObj.dataArray[0].CON_PARAM.PKVAL;
					}else{
						cmlId  = _UpdateEventObj.dataArray[0].accountId;
					}*/
					if(iObj)
						try{
							switch(_operation){
							case "ADD_EMAIL_ACC" 			:	
							case "UPDATE_EMAIL_ACC"			:	
							case "DELETE_EMAIL_ACC"         :    
							//case "ADD_FOLDER" 	            :  		
							case "UPDATE_FOLDER"  			:  
							case "FETCH_THREAD"             : 								  	
							case "FETCH_MAIL"               : 	
							case "SEARCH_MAIL"        		:   
							case "SAVE_MAIL"				:					
							case "SEND_MAIL" 	    		: 		
							case "SAVE_DRAFT"               : 									
							case "UPDATE_DRAFT"  			:						
							case "REPLY_MAIL" 	         	: 
							case "REPLY_ALL_MAIL"        	: 
							case "FORWARD_MAIL"	         	:  
							case "DELETE_MAIL"              :  			
							case "MOVE_MAIL"            	:  
							case "UPDATE_MAIL"              :  
							case "SYNC_MAIL"            	:
							case 'UPDATE_COUNT'             :
							case 'SET_WORKSPACE'            : 
							let _returnObj = {
																	type : _operation,
																	status : true,
																	Object :iObject,
																//	cmlId  : cmlId
		                    								 }; 
							return _returnObj;
								
							default         	            :  	let _objToEmit  = {
														"Failure":true,
														"Message":'ACTION_ARRAY IS NOT PRESENT!!!',
														type:'error'
																};
							dbStore.emitByUserId(iObj.userInfo.userId, null, 'ErrorFromServer', JSON.stringify(_objToEmit));
							return _objToEmit;
					}
						}catch(e){
							logger.error(`Exception  in make etEmailActionCreator : actionCreators${e}`);
						}
			 }		
		}
}

exports.actionCreators = actionCreators;