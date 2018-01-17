"use strict";
var common      = require('./common');
var logger      = common.logger;
var boxOp                  = require('./etBoxOperations');
var boxOperations          = new boxOp.box();
var dropBoxOp              = require('./etDropBoxOperations');
var dropBoxOperations      = new dropBoxOp.dropDox();
var skyDriveOp             = require('./etSkydriveOperations');
var skyDriveOperations     = new skyDriveOp.skyDrive();
var googleDriveOp          = require('./etGoogleDriveOperations');
var googleDriveOperations  = new googleDriveOp.googleDrive();

/**
* @Author      : 
 * @purpose     : To create and return new state
 * @Modified On : 18 May 2016
 * @Modified By : RMM
 */

// default state of cloud vault
var INITIAL_STATE_CV = {
		 USER_ID                  : "",
		 ACCOUNT_NAME             : "",		           
};

// Add account
var ADD_ACCOUNT_CV = {
		 USER_ID                  : "",
		 ACCOUNT_NAME             : "",
		 CONNECTIVITY_STATUS      : false,
		 ACCOUNT_CONFIGURED       : false,
		 READ_DROPBOX             : false,
		 ALL_SUB_ACTION           : false,           
};

// Add folder
var ADD_FOLDER_CV = {
	     USER_ID                  : "",
		 ACCOUNT_NAME             : "",
		 INSERT_IN_HBASE          : false,
		 INSERT_ON_PROVIDER       : false,
		 UPDATE_IN_HBASE          : false,
		 ALL_SUB_ACTION           : false,
};

// Delete folder
var DELETE_FOLDER_CV = {
	     USER_ID                  : "",
		 ACCOUNT_NAME             : "",
		 INITIAL_UPDATE_IN_HBASE  : false,
		 DELETE_FROM_PROVIDER     : false,
		 LATER_UPDATE_IN_HBASE    : false,
		 ALL_SUB_ACTION           : false,
};

// Rename folder
var RENAME_FOLDER_CV = {
	     USER_ID                  : "",
		 ACCOUNT_NAME             : "",
		 INITIAL_UPDATE_IN_HBASE  : false,
		 RENAME_ON_PROVIDER       : false,
		 LATER_UPDATE_IN_HBASE    : false,
		 ALL_SUB_ACTION           : false,
};

// Upload file
var UPLOAD_FILE_CV = {
	     USER_ID                  : "",
		 ACCOUNT_NAME             : "",
		 INSERT_IN_HBASE          : false,
		 UPLOAD_ON_PROVIDER       : false,
		 UPDATE_IN_HBASE          : false,
		 ALL_SUB_ACTION           : false,
};

// Delete Account 
var DELETE_ACCOUNT_CV = {
	     USER_ID                  : "",
		 ACCOUNT_NAME             : "",		 
		 UPDATE_IN_HBASE      	  : false,
		 ALL_SUB_ACTION           : false,
};

// Sync Drive
var SYNC_DRIVE_CV = {
	     USER_ID                : "",
		 ACCOUNT_NAME           : "",
		 GET_DATA_FROM_PROVIDER : false,
		 SEND_TO_JAVA           : false,
		 UPDATE_IN_HBASE        : false,
		 ALL_SUB_ACTION         : false,
};

/**
 * @Modified By : GSS 
 * @purpose     : Object send to JavaProcess
 * @date        : 8 NOV 2016
 */
const sendJava = (iSingleCallObject)=>{
	try{
	var _localTest = iSingleCallObject;
	
			logger.debug('In etCloudVaultReducer : sendJava :');
			common.queueLibs.sendToJavaProcess(_localTest,common.appConfigObj.client['mode'],null,"THIRDPARTY_OPERATION");
	}catch(err){
		logger.error('In etCloudVaultReducer : sendJava : Exception : ',err);
	}
};

/**
 * @Modified By : RMM 
 * @purpose     : constructor to create and return new state
 * @Modified On : 17 June 2016 and 1 July 2016
 */
const cloudVaultReducer = (state , action)=>{
	
	state = state || INITIAL_STATE_CV;
	if(action){
		switch (action.type) {
		
		    case "SET_DEF_STATE" :
		    	state = state || INITIAL_STATE_CV;
				var _newState = Object.assign( {}, state, { USER_ID : action.userId, ACCOUNT_NAME : action.accountName } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : SET_DEF_STA ",_newState );
				return _newState;
				
		    case "ACC_CONF_GOOGLEDRIVE":
		    	state =  ADD_ACCOUNT_CV;
				 _newState = Object.assign( {}, state, { USER_ID : action.userId, ACCOUNT_NAME : action.accountName } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : ACC_CONF_GOOGLEDRIVE ",_newState );
				googleDriveOperations.googleDriveAddAccount(action._addGoogleDriveAccountInfo,(Obj)=>{
					sendJava(Obj);
				});
				return _newState;
		    case "NONCLOUZER"://MSA added
		    	state =  ADD_ACCOUNT_CV;
				 _newState = Object.assign( {}, state,  { ACCOUNT_CONFIGURED : action.account_configured } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : ACC_CONF_GOOGLEDRIVE ",_newState );
				googleDriveOperations.registerNonClouzer(action._addGoogleDriveAccountInfo.redirectObj.request,action._addGoogleDriveAccountInfo.redirectObj.reply,(Obj)=>{
					sendJava(Obj);
				});
				return _newState;
				
		    case "ACC_CONF_DROPBOX" :
		    	state =  ADD_ACCOUNT_CV;
				 _newState = Object.assign( {}, state, { USER_ID : action.userId, ACCOUNT_NAME : action.accountName } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : ADD_ACC_CV ",_newState );
				dropBoxOperations.dropBoxAddAccount(action._addDropboxAccountInfo,(Obj)=>{
					sendJava(Obj);
				});
				return _newState;

		    case "ACC_CONF_BOX" :	
				 _newState = Object.assign( {},state, { ACCOUNT_CONFIGURED : action.account_configured } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : ACC_CONF_BOX ", _newState );
				boxOperations.boxDeriveAddAccount( action._addboxDriveAccountInfo,(Obj)=>{
					sendJava(Obj);
				} );
				return _newState;
				
		    case "ACC_CONF_SKYDRIVE" :	
				 _newState = Object.assign( {},state, { ACCOUNT_CONFIGURED : action.account_configured } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : ACC_CONF_SKYDRIVE ", _newState );
				skyDriveOperations.skyDriveAddAccount( action._addSkyDriveAccountInfo,(Obj)=>{
					sendJava(Obj);
				});
				return _newState;
				
		    case "ACC_CONF_GOOGLE_CONTACTS":
		    		 _newState = Object.assign( {},state, { ACCOUNT_CONFIGURED : action.account_configured } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : ACC_CONF_GOOGLE_CONTACTS ", _newState );
				googleDriveOperations.importContactsOnGmail( action._addGoogleContactInfo,(Obj)=>{
					sendJava(Obj);
				});
				return _newState;
				
		    case "UPDATE_ACCOUNT":
		    case "ADD_FOLDER" :
		  
		    case "ADD_FILE":
		    case "RENAME_FILE":
		    case "UPDATE_FILE" : //Added SJ :  Rushikesh
	    	case "UPDATE_FOLDER"://Added SJ : Rushikesh
	    	case "MARK_IMP"://Added by SJ : Rushikesh
	    	case "UNMARK_IMP"://Added by SJ : Rushikesh
		    	
		    	state = ADD_FOLDER_CV;
				 _newState = Object.assign( {}, state, { USER_ID : action.data.clientInfo.userId, ACCOUNT_NAME : action.accountName, 
					                                        INSERT_IN_HBASE : true } );
				sendJava(action.data);
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : ADD_FOLDER_CV ",_newState );
				return _newState;
				
			case "SET_CONN_CV" :	
				 _newState = Object.assign( {}, state,{ CONNECTIVITY_STATUS : action.connectivity_status } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer :SET_CONN ",_newState );
				return _newState;
				
			case "READ_DROPBOX" :	
				 _newState = Object.assign( {},state, { READ_DROPBOX : action.read_dropBox,ALL_SUB_ACTION : true } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : READ_DROPBOX ", _newState );
				return _newState;
				
			case "ADD_FOLDER_CV" :
		    	state = ADD_FOLDER_CV;
				 _newState = Object.assign( {}, state, { USER_ID : action.userId, ACCOUNT_NAME : action.accountName, 
					                                        INSERT_IN_HBASE : true } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : ADD_FOLDER_CV ",_newState );
				return _newState;
				
			case "ADD_FOLDER_ON_PROVIDER" :
		    		 _newState = Object.assign( {}, state, { INSERT_ON_PROVIDER : action.added_on_thirdParty } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : ADD_FOLDER_ON_PROVIDER ",_newState );
				return _newState;
				
			case "ADD_FOLDER_UPDATE_HBASE" :
		    		 _newState = Object.assign( {}, state, { UPDATE_IN_HBASE : action.add_folder_update_hbase,
		    		                                        ALL_SUB_ACTION : true  } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : ADD_FOLDER_UPDATE_HBASE ",_newState );
				return _newState;
				
		    case "DELETE_FILE":
		    case "DELETE_FOLDER":	
			case "DELETE_FOLDER_CV" :
			case "MOVE_FOLDER_TO_TRASH":
			case "MOVE_FILE_TO_TRASH": //For move file to trash
			case "MOVE_FOLDER_FROM_TRASH"://For move folder from trash
	    	case "MOVE_FILE_FROM_TRASH"://For move folder from trash
		    	state = DELETE_FOLDER_CV;
				_newState = Object.assign( {}, state, { USER_ID : action.userId, ACCOUNT_NAME : action.accountName, 
					                                        INITIAL_UPDATE_IN_HBASE : true } );
				sendJava(action.data);
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : DELETE_FOLDER_CV ",_newState );
				return _newState;
				
			case "DELETE_FOLDER_FROM_PROVIDER" :
		    		 _newState = Object.assign( {}, state, { DELETE_FROM_PROVIDER : action.deleted_from_thirdParty } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : DELETE_FOLDER_FROM_PROVIDER ",_newState );
				return _newState;
				
			case "DELETE_FOLDER_UPDATE_HBASE" :
		    		_newState = Object.assign( {}, state, { LATER_UPDATE_IN_HBASE : action.delete_folder_update_hbase, 
		    		                                        ALL_SUB_ACTION : true });
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : DELETE_FOLDER_UPDATE_HBASE ",_newState );
				return _newState;
				
			case "RENAME_FOLDER":
			case "RENAME_FOLDER_CV" :
			
				state = RENAME_FOLDER_CV;
		    		 _newState = Object.assign( {}, state, { USER_ID : action.userId, ACCOUNT_NAME : action.accountName,
		    		                                        INITIAL_UPDATE_IN_HBASE : true } );
		    	sendJava(action.data);
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : RENAME_FOLDER_CV ",_newState );
				return _newState;
				
			case "RENAME_FOLDER_ON_PROVIDER" :
		    		_newState = Object.assign( {}, state, { RENAME_ON_PROVIDER : action.rename_on_thirdParty   } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : RENAME_FOLDER_ON_PROVIDER ",_newState );
				return _newState;
				
			case "RENAME_FOLDER_UPDATE_HBASE" :
		    		 _newState = Object.assign( {}, state, { LATER_UPDATE_IN_HBASE : action.rename_folder_update_hbase,
		    		                                        ALL_SUB_ACTION : true  } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : RENAME_FOLDER_UPDATE_HBASE ",_newState );
				return _newState;
				
			case "UPLOAD_FILE_CV" :
				state = UPLOAD_FILE_CV;
		    		 _newState = Object.assign( {}, state, { USER_ID : action.userId, ACCOUNT_NAME : action.accountName, 
		    		                                        INSERT_IN_HBASE : true } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : UPLOAD_FILE_CV ",_newState );
				return _newState;
				
			case "UPLOAD_FIEL_ON_PROVIDER" :
		    		 _newState = Object.assign( {}, state, { UPLOAD_ON_PROVIDER : action.uploaded_on_thirdParty   } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : UPLOAD_FIEL_ON_PROVIDER ",_newState );
				return _newState;
				
			case "UPLOAD_FILE_UPDATE_HBASE" :
		    		_newState = Object.assign( {}, state, { UPDATE_IN_HBASE : action.upload_file_update_hbase,
		    		                                        ALL_SUB_ACTION : true  } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : UPLOAD_FILE_UPDATE_HBASE ",_newState );
				return _newState;
				
			case "SYNC_DRIVE_CV" :
				state = SYNC_DRIVE_CV;
		    		_newState = Object.assign( {}, state, { USER_ID : action.userId, ACCOUNT_NAME : action.accountName,
		    		                                        GET_DATA_FROM_PROVIDER : true } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : SYNC_DRIVE_CV ",_newState );
				return _newState;
				
			case "SEND_TO_JAVA_SYNC" :
		    		_newState = Object.assign( {}, state, { SEND_TO_JAVA : action.send_to_java } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : SEND_TO_JAVA_SYNC ",_newState );
				return _newState;
				
			case "SYNC_DRIVE_UPDATE_HBASE" :
		    		_newState = Object.assign( {}, state, { UPDATE_IN_HBASE : action.sync_drive_update_hbase, 
		    		                                        ALL_SUB_ACTION : true  } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : SYNC_DRIVE_UPDATE_HBASE ",_newState );
				return _newState;
				
			case "DELETE_ACCOUNT_CV" :
		    	state = DELETE_ACCOUNT_CV;
				_newState = Object.assign( {}, state, { USER_ID : action.userId, ACCOUNT_NAME : action.accountName,
					                                        UPDATE_IN_HBASE : action.update_in_hbase,
					                                        ALL_SUB_ACTION : true  } );
				logger.debug(" in etCloudVaultReducer : cloudVaultReducer : DELETE_ACCOUNT_CV ",_newState );
		
			default : 	
				return state;
	    }
	}
};

cloudVaultReducer.prototype={
		constructor:cloudVaultReducer
};
exports.cloudVaultReducer = cloudVaultReducer;