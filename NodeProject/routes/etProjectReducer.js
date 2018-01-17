/**
 * @author  : RMM
 * @purpose : etProjectReducer file is used to maintain redux states of task and project
 * @date    : 6 July 2016
 */
/*eslint-env es6*/
'use strict';
const common		= require('./common');
const logger = common.logger;
let flag = null;

class ProjectReducer {
	constructor() {
	}

	 sendJava(iSingleCallObject) {
		 try{
			 logger.debug('In etProjectReducer : sendJava ');
				if(iSingleCallObject && iSingleCallObject.hasOwnProperty('baton')){
					iSingleCallObject.baton.push({Location: 'etProjectReducer_sendJava : node', Timestamp: new Date().getTime()});
				}
			 if(iSingleCallObject && iSingleCallObject.hasOwnProperty('moduleName')){
				 switch(iSingleCallObject.moduleName){
				 	case 'SEC' :
					case 'PGP' :
					case 'PRJ' :
					case 'TSK' :
					case 'IOE' :
					case 'ROM' :
					case 'DVC' :
					case 'Media':
					case 'STG':
					
						if(flag === true){
							common.queueLibs.sendToJavaProcess(iSingleCallObject,common.appConfigObj.client['mode']);
						}else if(flag === 'UPLOAD'){
							common.queueLibs.sendToJavaProcess(iSingleCallObject,common.appConfigObj.client['mode'],null,"UPLOAD");
						}else{
							 common.queueLibs.sendToJavaProcess(iSingleCallObject, common.appConfigObj.client['mode']);
						}
						 break;
					default : 
						logger.info('In etProjectReducer : sendDataToJava : moduleName : in default case : ', iSingleCallObject.moduleName);

				 }
			 }
			}catch(err) {
				logger.error('In etProjectReducer : sendJava : Exception : ', err);
			}
		}

	 reducer(state, action) {
		 let _newState = null;
		 let INITIAL_STATE_PROJECT= {
		 };
		 let INITIAL_STATE = {
		 };
		 let project = new ProjectReducer();
		state = state || INITIAL_STATE_PROJECT;
		if(action)
		switch (action.type) {
	    case 'ADD_PROJECT' :
	    case 'INSERT_INVITEE' :
	    case 'ADD_COMMENT' :
	    case 'DECLINE_PROJECT' :
	    case 'ACCEPT_PROJECT' :
	    case 'DELETE_INVITEE' :
	    case 'ADD_ATTACHEMENT' :
	    case 'REMOVE_ATTACHEMENT' :
	    case 'UPDATE_PROJECT' :
	    case 'UPDATE_INVITEE' :
	    case 'ADD_TASK' :
	   
	    case 'UPDATE_TASK' :
	    case 'DECLINE_TASK' :
	    case 'ACCEPT_TASK' :
	    case 'ARCHIVE_TASK' :
	    case 'PROPOSE_TASK' :
	    case 'APPROVE_TASK' :
	    case 'ADD_SECTION' :
	    
	    case 'UPDATE_SECTION' :
	    case 'ARCHIVE_SECTION' :
	    case 'reassignProject' :
	    case 'proposeTask' :
	    case 'reassignTask' :
	    case 'moveTask' :
	    case 'ADD_PROJECT_TEAM' :
	    case 'UPDATE_PROJECT_TEAM' :
	    case 'REMOVE_INVITEE' :
	    case 'DELETE_PROJECT_TEAM' :
	    case 'DISAPPROVE_UNSUBSCRIBE':
	    case 'DISAPPROVE_TASK':
//	    case 'ADD_AUDIO':
//	    case 'ADD_PHOTO':
	    case 'ADD_BUILDING':
	    case 'ADD_FLOOR':
	    case 'ADD_TO_CART':
//	    case 'ADD_METADATA_TOALBUM':
	    case 'UNARCHIVE_TASK':
//	    case 'ADD_PLAYLIST':
	    case 'DECLINE_PROPOSE_TASK':
//	    case 'DELETE_AUDIO':
//	    case 'DELETE_PHOTO':
//	    case 'DELETE_PLAYLIST':
	    case 'IMPORT_TASKS':
	   
	    case 'ARCHIVE_PROJECT':
	    case 'APPROVE_UNSUBSCRIBE':
	    case 'CREATE_SECTION':	
	    case 'CREATE_PROJECT':
	    case 'CREATE_TASK':
	    case 'MODIFY_TASK':
	    case 'MODIFY_PROJECT':
	    case 'MODIFY_SECTION':
	    case 'INSERT_NEW_INVITEE':
	    case 'DELETE_NEW_INVITEE':
	    case 'UPDATE_NEW_INVITEE':
	    case 'CREATE_MILESTONE ' ://Added by SJ :for creating milestone'
	    case 'UNARCHIVE_PROJECT': //Added by SJ :  Server call for unarchive project from archive project list Arun 
	    case 'DELETE_ATTACHMENT'://Added by SJ : Madhuri
	    case 'INSERT_ATTACHMENT'://Added by SJ :  Madhuri
		case 'SET_WORKSPACE':
		case 'ADD_RPE_TASK'://Added by SJ : Komal
		case 'CREATE_REMINDER'://Added by SJ : Arun
		case 'MODIFY_REMINDER'://Added by SJ : Arun
		case 'CREATE_PROJECT_SETTINGS'://Added by SJ : Anjali
		case 'UPDATE_PROJECT_SETTINGS'://Added by SJ : Anjali
		case 'UPDATE_RPE_TASK'://Added by SJ : Arun
		case 'UPDATE_SERIES_TASK'://Added by SJ : Arun
		case 'UPDATE_NEXT_TASK'://Added by SJ : Arun
		case 'INSERT_INVITEE_PROJECT' : //Added by Mayur : Arun
		case 'DELETE_INVITEE_PROJECT' : //Added by Mayur : Arun
		case 'INSERT_INVITEE_SECTION' : //Added by Mayur : Arun
		case 'DELETE_INVITEE_SECTION' : //Added by Mayur : Arun
		case 'INSERT_INVITEE_TASK' : //Added by Mayur : Arun
		case 'DELETE_INVITEE_TASK' : //Added by Mayur : Arun
	    							flag = false;
	    							
	    	                        project.sendJava(action._obj1);
	    							state = state || INITIAL_STATE;
	    							_newState = Object.assign( {}, state, {actionArray: action.cmlId} );
	    							logger.info('in etProjectReducer  : ', _newState );
	    							return _newState;
	    case 'DELETE_PROJECT' :		
	    case 'DELETE_SECTION' :
	    case 'DELETE_TASK'    :
	    case 'REMOVE_SECTION':
	    case 'REMOVE_PROJECT':
	    case 'REMOVE_TASK':
	    case 'PERMANENT_DELETE_PROJECT':
		case 'DELETE_TEMP_EVENT'://Added by SJ : Sagar 
		case 'DELETE_TEMP_MEETING': //Added by Sj : Sagar
		case 'REMOVE_REMINDER': //Added by SJ : Arun
	    	
	    					flag = true;
	    					project.sendJava(action._obj1);
	    					state = state || INITIAL_STATE;
	    					_newState = Object.assign( {}, state, {actionArray: action.cmlId} );
	    					logger.info('in etProjectReducer  : ', _newState );
	    					return _newState;
	    					
		case 'IMPORT_TASK'://Added by SJ:Anjali D 	
			               flag = "UPLOAD";
			               project.sendJava(action._obj1);
			               state = state || INITIAL_STATE;
			               _newState = Object.assign( {}, state, {actionArray: action.cmlId} );
			               logger.info('in etProjectReducer  : ', _newState );
			               return _newState;	
			               

		default :
			return state;
    }
	}
}

exports.ProjectReducer = ProjectReducer;
