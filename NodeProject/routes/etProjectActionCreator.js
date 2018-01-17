'usue strict';
/**
 * @author  : RMM 
 * @purpose : etProjectActionCreator file is used to route any project related project to java 
 * @date    : 6 July 2016
 */

/*require files and modules*/ 
const common      = require('./common');
const logger      = common.logger;

/**
 * @author  : RMM 
 * @purpose : constructor to call specific function of given action
 * @date    : 07/07/2016
 * @Param   : iSingleCallObject has single server call object
 * @Modified on : 08/07/2016
 */
class actionCreators{
	constructor(){
		}
		
	projectInit(iSingleCallObject,iSocket){
		try{						
			if( iSingleCallObject){
				console.log("iSingleCallObjectiSingleCallObjectiSingleCallObject : " ,JSON.stringify(iSingleCallObject));
			//	console.log(iSingleCallObject);
				if(iSingleCallObject.hasOwnProperty('baton')){
					iSingleCallObject.baton.push({Location: 'etProjectActioncreator_projectInit : node', Timestamp: new Date().getTime()});
				}
				//let actionObj= iSingleCallObject.updateObj || iSingleCallObject.insertObj;
				let action=iSingleCallObject.dataArray[0].actionArray;
				let callObj=iSingleCallObject;
				
				let Obj={
						Action:action,
				        status:"Error",
						Message:"",
						Object:callObj
				};
				
				let errObj={
						type:"Error",
						data:Obj
				};
				
				/*If iObject is not null*/
			//	let _UpdateEventObj    = iSingleCallObject.updateObj || iSingleCallObject.insertObj;
				let _socket = null;
				
				if( iSocket ){
					_socket = iSocket;
				}
				
				let cmlID = null;
				/*if( _UpdateEventObj.hasOwnProperty('dataArray') &&  _UpdateEventObj.dataArray[0].hasOwnProperty('CML_ID') ){
					cmlID  = _UpdateEventObj.dataArray[0].CML_ID;
				}else{				
					cmlID  = _UpdateEventObj.dataArray[0].CON_PARAM.PKVAL;
				}		*/
				logger.debug("In etProjectActionCreator : actionCreators : cmlID ", cmlID );
				
				if( iSingleCallObject && iSingleCallObject.dataArray.hasOwnProperty(0) && iSingleCallObject.dataArray[0].hasOwnProperty('actionArray')){
					
					switch( iSingleCallObject.dataArray[0].actionArray[0] ) {
					case 'ADD_PROJECT' :
					case 'UPDATE_PROJECT' :
					case 'ADD_COMMENT' :
					case 'DECLINE_PROJECT' : 
					case 'ACCEPT_PROJECT' :
					case 'DELETE_INVITEE':
					case 'ADD_ATTACHEMENT':
					case 'REMOVE_ATTACHEMENT' :
					case 'UPDATE_INVITEE' :
					case 'DELETE_PROJECT' :
					case 'ADD_TASK':
					case 'DELETE_TASK':
					case 'UPDATE_TASK':
					case 'DECLINE_TASK' :
					case 'ACCEPT_TASK':
					case 'ARCHIVE_TASK':
					case 'UNARCHIVE_TASK' :
					case 'ADD_SECTION' :
					case 'DELETE_SECTION':
					case 'UPDATE_SECTION':
					case 'ARCHIVE_SECTION':
					case 'ARCHIVE_PROJECT':
					case 'ADD_PROJECT_TEAM':
					case 'UPDATE_PROJECT_TEAM':
					case 'INSERT_INVITEE':
					case 'REMOVE_INVITEE':
					case 'DELETE_PROJECT_TEAM' :
					case 'ADD_BUILDING':
					case 'ADD_FLOOR' :
//					case 'ADD_AUDIO':
//					case 'ADD_PHOTO':
					case 'ADD_TO_CART':
					case 'APPROVE_TASK':
					case 'reassignTask':
					case 'moveTask':
					case 'reassignProject': 
					case 'PROPOSE_TASK':
					case 'APPROVE_UNSUBSCRIBE':
					case 'DISAPPROVE_UNSUBSCRIBE':
					case 'DISAPPROVE_TASK':
//					case 'ADD_METADATA_TOALBUM':
//					case 'ADD_PLAYLIST':
					case 'DECLINE_PROPOSE_TASK':
//					case 'DELETE_AUDIO':
//					case 'DELETE_PHOTO':
//					case 'DELETE_PLAYLIST':
					case 'IMPORT_TASKS':
					case 'CREATE_SECTION':
					case 'CREATE_PROJECT':
					case 'CREATE_TASK':
					case 'MODIFY_TASK':
					case 'MODIFY_PROJECT':
					case 'MODIFY_SECTION':
					case 'INSERT_NEW_INVITEE':
					case 'DELETE_NEW_INVITEE':
					case 'UPDATE_NEW_INVITEE':	
					case 'REMOVE_SECTION':
					case 'REMOVE_PROJECT':
					case 'REMOVE_TASK':
					case 'PERMANENT_DELETE_PROJECT':
					case 'CREATE_MILESTONE ': //Added by SJ :for creating milestone'
					case 'IMPORT_TASK'://Added by SJ:Anjali D
					case 'UNARCHIVE_PROJECT': //Added by SJ :  Server call for unarchive project from archive project list Arun
					case 'DELETE_ATTACHMENT'://Added by SJ : Madhuri 
					case 'INSERT_ATTACHMENT'://Added by SJ :  Madhuri
					case 'SET_WORKSPACE':	
					case 'ADD_RPE_TASK'://Added by SJ : Komal
					case 'CREATE_REMINDER'://Added by SJ : Arun
					case 'REMOVE_REMINDER': //Added by SJ : Arun
					case 'MODIFY_REMINDER'://Added by SJ : Arun
					case 'CREATE_PROJECT_SETTINGS'://Added by SJ : Anjali
					case 'UPDATE_PROJECT_SETTINGS'://Added by SJ : Anjali
					case 'UPDATE_RPE_TASK'://Added by SJ : Arun
					case 'UPDATE_SERIES_TASK'://Added by SJ : Arun
					case 'UPDATE_NEXT_TASK'://Added by SJ : Arun
					case 'TEST_PROJECT' : 
					case 'INSERT_INVITEE_PROJECT' : //Added by Mayur : Arun
					case 'DELETE_INVITEE_PROJECT' : //Added by Mayur : Arun
					case 'INSERT_INVITEE_SECTION' : //Added by Mayur : Arun
					case 'DELETE_INVITEE_SECTION' : //Added by Mayur : Arun
					case 'INSERT_INVITEE_TASK' : //Added by Mayur : Arun
					case 'DELETE_INVITEE_TASK' : //Added by Mayur : Arun
						
						//Object for sent to dispatch
						let _projectRequest = {
							    type                : iSingleCallObject.dataArray[0].actionArray[0],
							  /*  cmlId	            : cmlID,
							    actionPerformed     : true,*/
							    _obj1               : iSingleCallObject                  //iSingleCallObject ? iSingleCallObject : {}
						};
							logger.info('In etProjectrActionCreator  : _projectRequest :');
							return _projectRequest;
							
							default :
								logger.debug('In etProjectActionCreator : actionCreators : default case ');	
							if( _socket ){
								errObj.data.Message= "Given Action was not present";
								let err=JSON.stringify(errObj);
								_socket.emit("ErrorFromServer" , err);
							}
					}
				}else{
					if( _socket ){
						errObj.data.Message="Action-array was not present";
						let err=JSON.stringify(errObj);
						logger.debug('In etProjectActionCreator : actionCreators : Action-array was not present : in socket ');
						_socket.emit("ErrorFromServer" ,err);
					}
				}		
		  }else{
			  logger.debug('In etProjectActionCreator : actionCreators : empty single server call ');	
		  }				
		}catch( error ){
			logger.error('In etProjectActionCreator : actionCreators  : exception ', error );		
		}
		
	}
}
 
exports.actionCreators = actionCreators;