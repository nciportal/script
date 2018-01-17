/**
 * @author : RMM 
 * @purpose : etCloudVaultActionCreator file is used to route request to specific drives file
 * @date  : 25/05/2016
 */

// Required files and modules - 
var  cloudvault   = require('./msProperties').CloudObj;
var hostName               = cloudvault.hostNamecloud;
var skyDriveOp             = require('./etSkydriveOperations');
var skyDriveOperations     = new skyDriveOp.skyDrive();
var skydriveAppId          = cloudvault.skydriveAppId;
var skydriveredirect_url   = hostName+cloudvault.skydriveRedUrl;
var googleapis             = require('googleapis');
var OAuth2                 = googleapis.auth.OAuth2;
var oauth2Client           = new OAuth2( cloudvault.googleAppId, cloudvault.googleSecret, hostName + cloudvault.googleRedUrl );
var oauth2ClientForContact = new OAuth2(cloudvault.googleContactClientId, cloudvault.googleContactClientSecret, hostName+cloudvault.googleContactRedUrl);//ayk.mstorm@gmail.com  pwd : contact12345;
var boxAppId               = cloudvault.boxAppId;
var common                 = require('./common');
var logger 				   = common.logger;

function actionCreators(){
	//var _that = this;
}

//Default constructor -
actionCreators.prototype={
		constructor:actionCreators
};

actionCreators.prototype.cloudValutInit = function(iObject){
	try{		
		var _that = this;
		var obj;
		var _type;
		if( iObject ){                   // If iObject is not null
			logger.info("In etCloudvaultActionCreator : actionCreators : ");
		/*	if(iObject.extraParam.hasOwnProperty('subAction')){
				var _action = iObject.extraParam.subAction;
			}else{*/
			//	if(iObject.insertObj!=null)
					var _action = iObject.dataArray[0].actionArray[0];
			//	else if(iObject.updateObj!=null)
				//	var _action = iObject.updateObj.dataArray[0].actionArray[0];
			//}
			
			switch(_action){
			
		    	case "dropBoxRedirectURL" :  // Case when action is to give drop box third party URL					
		    		return _that.dropBoxRedirectURL(iObject);
		    	//	break;		
				
		    	case "dropBoxAddAccount" :   // Case when route action after redirect URL to fetch data from third party
		    		return _that.dropBoxAddAccount(iObject);
		    	//	break;
			    
		    	case "boxDriveRedirectURL" : // Case when action is to give box drive third party URL					
		    		return _that.boxDriveRedirectURL(iObject);
		    //		break;
				
		    	case "boxDeriveAddAccount" : // Case when action is to add box drive account					
		    		return _that.boxDeriveAddAccount(iObject);
		    	//	break;
				
		    	case "googleDriveRedirectURL" :  // Case when action is to give google drive third party URL
		    		return _that.googleDriveRedirectURL(iObject);
		    	//	break;	
				
		    	case "googleDriveAddAccount" :  // Case when action is to add google drive account 					
		    		return _that.googleDriveAddAccount(iObject);
		    	//	break;
				
		    	case "skyDriveRedirectURL" :  // Case when action is to give sky drive third party URL					
		    		return _that.skyDriveRedirectURL(iObject);
		    	//	break;
				
		    	case "skyDriveAddAccount" :  // Case when action is to add sky drive account 					
		    		return _that.skyDriveAddAccount(iObject);
		    	//	break;
		    		
		    	case "googleContactRedirectURL" :  // Case when action is to give google drive third party URL					
		    		return _that.googleContactRedirectURL(iObject);
		    	//	break;
		    		
		    	case "googleContactAccount":  // Case when action is to add sky drive account 					
		    		return _that.googleContactAccount(iObject);
		    //		break;
		    
		    	case "ADD_FOLDER"     :       // For folder creation in cloud vault 
		    	case "DELETE_FOLDER"  :       // For folder deletion in cloud vault
		    	case "RENAME_FOLDER"  :     // For folder renaming  cloud vault 
		    	case "ADD_FILE"	      :   	//For file creation in cloud vault 
		    	case "RENAME_FILE"    : 	// For file renaming  cloud vault 
		    	case "DELETE_FILE"    : 	//For file deletion in cloud vault
		    	case "MOVE_FOLDER_TO_TRASH": //For move file to trash
		    	case "MOVE_FILE_TO_TRASH": //For move file to trash
		    	case "MOVE_FOLDER_FROM_TRASH"://For move folder from trash
		    	case "MOVE_FILE_FROM_TRASH"://For move folder from trash
		    	case "UPDATE_FILE" : //Added SJ :  Rushikesh
		    	case "UPDATE_FOLDER"://Added SJ : Rushikesh
		     	case "MARK_IMP"://Added by SJ : Rushikesh
		    	case "UNMARK_IMP"://Added by SJ : Rushikesh
		    	/*case "renameFile"    :       // Case to rename file on given drive
		    	case "uploadFile"    :       // Case to upload file on given drive 
		    	case "moveFile"      :       // Case to move File on given drive
		    	case "copyFile"      :       // Case to copy File on given drive
		    	case "deleteFile"    :       // Case to delete File on given drive
		    	case "moveFolder"    :       // Case to move File on given drive
		    	case "copyFolder"    :       // Case to move File on given drive
		    	case "deleteAccount" :       // Case to delete Account on given drive					
		    	case "shareContact1"  :       // Case to share Contact on given drive
*/		    		
		    		if(iObject.insertObj!=null){
                	   _type=iObject.insertObj.dataArray[0].ACTION_ARRAY[0];
                	    obj=iObject;
                  }else{
                	   _type=iObject.updateObj.dataArray[0].ACTION_ARRAY[0];
                	   obj={
                			   clientInfo:iObject.clientInfo,  
                			   broadcast:iObject.broadcast,
                			   extraParam:iObject.extraParam,
                			   updateObj:iObject.updateObj,
                			   moduleName:iObject.moduleName
                	   }
                  }
                		  var _obj={
		    				   type                :_type,
		    				   data                :obj,
		    				   account_configured  : true
                		  };
                		  
		    		return _obj;
		    	//	break;
		    		
		    	case "shareContact"  :       // Case to share Contact on given drive
		    		 _that.shareContact(iObject)
		    		break;
			    
		    	default:
		    		logger.error('In etCloudvaultActionCreator : actionCreators : default case ');	
		    	break;			    
			}	
		}				
	}catch( error ){
		logger.error('In etCloudvaultActionCreator : actionCreators  : exception ', error );
	}
}

/**
 * @author : RMM 
 * @purpose : function to  convert Request To standard Format
 * @date : 07/06/2016
 * @param : iConvertObject
 */
actionCreators.prototype.convertRequestToStdFormat =function( iConvertObject , iConvertRequestToStdFormatCB ){
	logger.info("In etCloudvaultActionCreator : convertRequestToStdFormat :");
	var _convretedObjectIntoStdFormat = {};
	if( iConvertObject.hasOwnProperty('insertObj')){
		_convretedObjectIntoStdFormat = {
				insertObj  : 	{ action : "INSERT", dataArray  : iConvertObject.insertObj.dataArray },
				moduleName :    iConvertObject.insertObj.dataArray[0].KEY_TYPE,
				clientInfo :    iConvertObject.clientInfo,
			};
	}else{
		_convretedObjectIntoStdFormat = {
				updateObj  : 	{ action : iConvertObject.updateObj.action, dataArray  : iConvertObject.updateObj.dataArray },
				moduleName :    iConvertObject.updateObj.dataArray[0].CON_PARAM.KEY_TYPE,
				clientInfo :    iConvertObject.clientInfo,
			};
	}
	if( iConvertRequestToStdFormatCB ){
		iConvertRequestToStdFormatCB( _convretedObjectIntoStdFormat );
	}
};

/**
 * @author : RMM 
 * @purpose :  to get sub action for send to java process
 * @date :  07/06/2016
 * @param : iGetSubActionObject
 */
actionCreators.prototype.getSubActionFromOnject = function( iGetSubActionObject, iGetSubActionCB ){
	try{
		logger.info("In etCloudvaultActionCreator : getSubActionFromOnject :"); 
        switch(  iGetSubActionObject.extraParam.subAction ){
			case "moveFile" :             		
				return  "MOVE_FILE_CV";  
			//	break;
				
			case "copyFile" :         				
				return "COPY_FILE_CV";
				//break;
				
			case "uploadFile" :          				
				return "UPLOAD_FILE_CV";
				//break;
				
			case "deleteFile" :               		
				return "DELETE_FILE_CV";
				//break;
				
			case "moveFolder" :           		
				return "MOVE_FOLDER_CV";
				//break;
			
			case "deleteAccount" :          					
				return "DELETE_ACCOUNT_CV";
			//	break;
			
			case "copyFolder" :          	
				return "COPY_FOLDER_CV";
			//	break;
				
			case "addFolder" :         			
				return "ADD_FOLDER_CV";
			//	break;
				
			case "deleteFolder" :           			
				return "DELETE_FOLDER_CV";
			//	break;
				
			case "renameFolder" :           			
				return "RENAME_FOLDER_CV";
			//	break;
			
			case "renameFile" :          			
				return "RENAME_FILE_CV";
				//break;
				
			default:
			   logger.info('In etCloudvaultActionCreator : getSubActionFromOnject : default case');	
			//	break;		    
	 }		 
	}
	catch( error ){
		logger.error("In etCloudvaultActionCreator : getSubActionFromOnject  : exception "+ error );
	}	
};

/**
 * @author : RMM 
 * @purpose : function to return drop box redirect URL
 * @date : 25/05/2016
 * @param : iAddDropBoxAccountObject
 */
actionCreators.prototype.dropBoxRedirectURL = function( iAddDropBoxAccountObject, iAddDropBoxAccountCB ){
	try{
		//add logger
		var redirectURL = "https://www.dropbox.com/1/oauth2/authorize?client_id=" + cloudvault.dropapp_key +
		                 "&response_type=code&redirect_uri=" + hostName + "/dropBoxCallBack";		
		
		logger.info("In etCloudvaultActionCreator : addDropBoxAccount : redirectURL :", redirectURL );				
		iAddDropBoxAccountObject.reply.redirect(redirectURL);
		
		return {
			   type                : "REDIRECT_URL",
			   account_configured  : true};
	}catch( error ){
		logger.error('In etCloudvaultActionCreator : addDropBoxAccount  : exception :', error );
	}	
};

/**
 * @author : RMM 
 * @purpose : function to configure drop box account
 * @date : 25/05/2016
 * @param : iDropBoxAddAccountObject
 * ModifyBy : GSS
 */
actionCreators.prototype.dropBoxAddAccount = function( iDropBoxAddAccountObject, iDropBoxAddAccountCB ){
	logger.info("In etCloudvaultActionCreator : dropBoxAddAccount  :");
	try{		
		iDropBoxAddAccountObject.reply.redirect('/mstorm#/home/close');	
		logger.info("In etCloudvaultActionCreator : dropBoxAddAccount  : after close");
		
		logger.info("In etCloudvaultActionCreator : dropBoxAddAccount  : getCookie ");	
		var Cookie=iDropBoxAddAccountObject.request.headers.cookie;
		var cookiename='myInfo';
		var cookiestring=RegExp(""+cookiename+"[^;]+").exec(Cookie);
		// Return everything after the equal sign, or an empty string if the cookie name not found
		var info=unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
		var Cookie=JSON.parse(info);
		
		var addDropboxAccountInfo={
				userId      : Cookie.myInfo.userEmail,
			   	requestCode : iDropBoxAddAccountObject.request.query.code,
		};
		
		return {
				  type        : "ACC_CONF_DROPBOX",
				  _addDropboxAccountInfo : addDropboxAccountInfo,
				  account_configured      : true
	    };
		
	}catch( error ){
		logger.error("In etCloudvaultActionCreator : dropBoxAddAccount  : exception ", error );
	}	
};

/**
 * @author : RMM 
 * @purpose : function to return google drive redirect URL
 * @date : 31/5/2016
 * @param : iGoogleDriveRedirectURLObject
 */
actionCreators.prototype.googleDriveRedirectURL = function( iGoogleDriveRedirectURLObject, iGoogleDriveRedirectURLCB ){
	try{
		var redirectURL = oauth2Client.generateAuthUrl({
			  access_type     : 'offline',
			  approval_prompt : 'force',
			  scope           : 'https://mail.google.com https://www.googleapis.com/auth/plus.me ' +
			                    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive ' + 
			                    'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks ' + 
			                    'https://www.googleapis.com/auth/userinfo.email'
			});
		logger.info("In etCloudvaultActionCreator : googleDriveRedirectURL : redirectURL :", redirectURL );
		iGoogleDriveRedirectURLObject.reply.redirect(redirectURL);
		return {
				   type                : "REDIRECT_URL",
				   account_configured  : true};
	}catch( error ){
		logger.error('In etCloudvaultActionCreator : googleDriveRedirectURL  : exception ', error );
	}	
};

/**
 * @author : AMS
 * @purpose : function to configure google drive account
 * @date : 15/6/2016
 * @param : iGoogleDriveAddAccountObject
 */

actionCreators.prototype.googleDriveAddAccount = function( iGoogleDriveAddAccountObject, iGoogleDriveAddAccountCB ){
	try{
		logger.info("In etCloudvaultActionCreator : googleDriveAddAccount  :  ");	 
		
			var _type = null;
			var addGoogleDriveAccountInfo = {};
		if(iGoogleDriveAddAccountObject.request.headers.hasOwnProperty('cookie')){
			
			logger.info("In etCloudvaultActionCreator : googleDriveAddAccount  : getCookie ");	
			var Cookie=iGoogleDriveAddAccountObject.request.headers.cookie;
			var cookiename='myInfo';
			var cookiestring=RegExp(""+cookiename+"[^;]+").exec(Cookie);
			// Return everything after the equal sign, or an empty string if the cookie name not found
			var info=unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
			var Cookie=JSON.parse(info);
				
			 addGoogleDriveAccountInfo = {
					requestCode : iGoogleDriveAddAccountObject.request.query.code,
					userId      : Cookie.myInfo.userEmail
			};

			_type       = "ACC_CONF_GOOGLEDRIVE";
			logger.info("In etCloudvaultActionCreator : googleDriveAddAccount  : after close");
			iGoogleDriveAddAccountObject.reply.redirect('/mstorm#/home/close');	
		}else{
			logger.info("In etCloudvaultActionCreator : googleDriveAddAccount  : Non-clouzer ");	
			_type       = "NONCLOUZER";
			 addGoogleDriveAccountInfo = {
					requestCode : iGoogleDriveAddAccountObject.request.query.code,
					//userId      : Cookie.myInfo.userEmail,
			};
			addGoogleDriveAccountInfo['redirectObj'] =iGoogleDriveAddAccountObject;//MSA added
		}
				
		return {
			   type        : _type,
			   _addGoogleDriveAccountInfo : addGoogleDriveAccountInfo,
			   account_configured      : true
		};
		
	}catch( error ){
		logger.error("In etCloudvaultActionCreator : googleDriveAddAccount  : exception ", error );
	}	
};

/**
 * @author : GSS
 * @purpose : function to configure google drive account
 * @date : 30-03-2017
 * @param : iGoogleImportContactObject
 */

actionCreators.prototype.googleContactRedirectURL = function( iGoogleContactRedirectURLObject, iGoogleContactRedirectURLCB ){
	try{
		
		const url = oauth2ClientForContact.generateAuthUrl({
			access_type: 'offline',
			approval_prompt: 'force',
			scope: 'https://www.google.com/m8/feeds https://mail.google.com https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.email',
		});
		
		logger.info("In etCloudvaultActionCreator : googleContactRedirectURL : redirectURL :", url );
		iGoogleContactRedirectURLObject.reply.redirect(url);
		return {
				   type                : "REDIRECT_URL",
				   account_configured  : true};
	}catch( error ){
		logger.error('In etCloudvaultActionCreator : googleContactRedirectURL  : exception ', error );
	}	
};

actionCreators.prototype.googleContactAccount = function( iGoogleContactObject, iGoogleContactRedirectURLCB ){
	try{
		var code = iGoogleContactObject.request.query.code;
		iGoogleContactObject.reply.redirect('/mstorm#/close');
		var Cookie=iGoogleContactObject.request.headers.cookie;
		var cookiename='myInfo';
		var cookiestring=RegExp(""+cookiename+"[^;]+").exec(Cookie);
		// Return everything after the equal sign, or an empty string if the cookie name not found
		var info=unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
		var Cookie=JSON.parse(info);
		
		 addGoogleContactInfo = {
					requestCode : iGoogleContactObject.request.query.code,
					userId      : Cookie.myInfo.userEmail
			};
		
		return {
			   type : "ACC_CONF_GOOGLE_CONTACTS",
			   _addGoogleContactInfo : addGoogleContactInfo,
			   account_configured    : true
		};
	}catch(err){
		
	};
}



/**
 * @author : AMS
 * @purpose : function to return sky drive redirect url
 * @date :  25/6/2016
 * @param : iSkyDriveRedirectURLObject
 */
actionCreators.prototype.skyDriveRedirectURL = function( iSkyDriveRedirectURLObject , iSkyDriveRedirectURLCB){
	try{
		logger.info("In etCloudvaultActionCreator : skyDriveRedirectURL :");
		var redirectURL = 'https://login.live.com/oauth20_authorize.srf?client_id='+skydriveAppId+
		                  '&scope=wl.emails,wl.imap,wl.basic,wl.skydrive,wl.skydrive_update,wl.offline_access&response_type=code&redirect_uri='+
		                  skydriveredirect_url;
		
		iSkyDriveRedirectURLObject.reply.redirect(redirectURL);
		return {
			   type                : "REDIRECT_URL",
			   account_configured  : true};
	}catch(e){
		logger.error('In etCloudvaultActionCreator : skyDriveRedirectURL  : exception ', e );
	}
};

/**
 * @author : AMS
 * @purpose : function to return sky drive redirect url
 * @date :  25/6/2016
 * @param : iSkyDriveAddAccountObject
 */
actionCreators.prototype.skyDriveAddAccount = function( iSkyDriveAddAccountObject , iSkyDriveAddAccountCB){
	try{
		logger.info("In etCloudvaultActionCreator : skyDriveAddAccount :");
		
		logger.info("In etCloudvaultActionCreator : skyDriveAddAccount  : getCookie ");	
		var Cookie=iSkyDriveAddAccountObject.request.headers.cookie;
		var cookiename='myInfo';
		var cookiestring=RegExp(""+cookiename+"[^;]+").exec(Cookie);
		// Return everything after the equal sign, or an empty string if the cookie name not found
		var info=unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
		var Cookie=JSON.parse(info);
		
		var addSkyDriveAccountInfo = {
				requestCode : iSkyDriveAddAccountObject.request.query.code,
				userId      : Cookie.myInfo.userEmail
		};
		
		return {
			   type                : "ACC_CONF_SKYDRIVE",
			   _addSkyDriveAccountInfo:addSkyDriveAccountInfo,
			   account_configured  : true};
//			   iSkyDriveAddAccountObject.reply.redirect('/mstorm#/home/close');
	}catch(e){
		logger.error('In etCloudvaultActionCreator : skyDriveAddAccount  : exception ', e );
	}
};
/**
 * @author : RMM 
 * @purpose : function to return box drive redirect URL
 * @date : 28/5/2016
 * @param : iAddBoxDriveAccountObject
 */
actionCreators.prototype.boxDriveRedirectURL = function( iAddBoxDriveAccountObject, iAddBoxDriveAccountCB ){
	try{	
		var redirectURL = 'https://www.box.com/api/oauth2/authorize?response_type=code&client_id=' + boxAppId;
		iAddBoxDriveAccountObject.reply.redirect( redirectURL );
		
		logger.info("In etCloudvaultActionCreator : boxDriveRedirectURL : redirectURL :", redirectURL );
		return {
			   type                : "REDIRECT_URL",
			   account_configured  : true};
	}catch( error ){
		logger.error('In etCloudvaultActionCreator : boxDriveRedirectURL  : exception :', error );
	}	
};

/**
 * @author : RMM 
 * @purpose : function to configure drop box account
 * @date : 28/5/2016
 * @param : iBoxDeriveAddAccountObject
 */
actionCreators.prototype.boxDeriveAddAccount = function( iBoxDeriveAddAccountObject, iBoxDeriveAddAccountCB ){
	
	logger.info("In etCloudvaultActionCreator : boxDeriveAddAccount  :55");	
	try{		
//		iBoxDeriveAddAccountObject.reply.redirect('/mstorm#/home/close');	
		
		logger.info("In etCloudvaultActionCreator : boxDeriveAddAccount  : getCookie ");	
		var Cookie=iBoxDeriveAddAccountObject.request.headers.cookie;
		var cookiename='myInfo';
		var cookiestring=RegExp(""+cookiename+"[^;]+").exec(Cookie);
		// Return everything after the equal sign, or an empty string if the cookie name not found
		var info=unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
		var Cookie=JSON.parse(info);
		
		var addboxDriveAccountInfo = {
				requestCode : iBoxDeriveAddAccountObject.request.query.code,
				userId      : Cookie.myInfo.userEmail
		};
		
		return {
			   type                    : "ACC_CONF_BOX",
			   _addboxDriveAccountInfo : addboxDriveAccountInfo,
			   account_configured      : true  };
	}catch( error ){
		logger.error("In etCloudvaultActionCreator : boxDeriveAddAccount  : exception ", error );
	}	
};

/**
 * @author : RMM 
 * @purpose :  switch case to give require variable of file
 * @date : 27/05/2016
 * @param : iFindProvider
 */
actionCreators.prototype.findProvider = function( iFindProvider, iFindProviderCB ){
	try{		
		logger.info('In etCloudvaultActionCreator : findProvider :' );	
		 
		switch( iFindProvider.providerName ){
			case "google" :            // Case when source is google					
				return  googleDriveOperations;  
			//	break;
				
			case "skydrive" :          // Case when source is sky drive						
				return skyDriveOperations;
				//break;
			
			case "dropbox" :          // Case when source is drop box				
				return dropBoxOperations;
			//	break;
			
			case "box" :              // Case when source is box					
				return boxOperations;
			//	break;
			
			default:
				logger.info('In etCloudvaultActionCreator : findProvider : default case');	
			//	break;		    
		}
	}
	catch( error ){
		logger.error("In etCloudvaultActionCreator : findProvider  : exception " + error );
	}	
};

/**
 * @author : RMM 
 * @purpose :  to route request of add folder to particular drive
 * @date : 27/05/2016
 * @param : iAddFolderObject
 */
actionCreators.prototype.addFolder = function( iAddFolderObject, iAddFolderCB ){
	try{
		var _that = this;
		logger.info("In etCloudvaultActionCreator : addFolder  :" );		
		var _serviceProvider = _that.findProvider( { providerName : iAddFolderObject.iSource } );
		_serviceProvider.addFolder(iAddFolderObject);
	}
	catch( error ){
		logger.error("In etCloudvaultActionCreator : addFolder  : exception :"+ error );
	}	
};

/**
 * @author : RMM 
 * @purpose :  to route request of upload file to particular drive
 * @date : 27/05/2016
 * @param : iUploadFileObject
 */
actionCreators.prototype.uploadFile = function( iUploadFileObject, iUploadFileCB ){
	try{
		var _that = this;
		logger.info("In etCloudvaultActionCreator : uploadFile  : " );
		var _serviceProvider = _that.findProvider( { providerName : iUploadFileObject.iSource } );
		_serviceProvider.uploadFile( iUploadFileObject );
	}
	catch( error ){
		logger.error("In etCloudvaultActionCreator : uploadFile  : exception "+ error );
	}	
};

/**
 * @author : RMM 
 * @purpose :  to route request of delete file to particular drive
 * @date : 27/05/2016
 * @param : iDeleteAccountObject
 */
actionCreators.prototype.deleteAccount = function( iDeleteAccountObject, iDeleteAccountCB ){
	try{		
		logger.info("In etCloudvaultActionCreator : deleteAccount :" );
		// Initial update of redux state for delete account 
		var _deleteAccount = {
				  type            : "DELETE_ACCOUNT_CV",
				  userId          : iDeleteAccountObject.clientInfo.userId,
				  accountName     : iDeleteAccountObject.iSource,
				  update_in_hbase : true 
	    };
		// call dispatch of redux form common
		common.reduxBackendStore.dispatch( _deleteAccount );
		iDeleteAccountCB();		 
	}
	catch( error ){
		logger.error("In etCloudvaultActionCreator : deleteAccount  : exception "+ error );
	}	
};

/**
 * @author : RMM 
 * @purpose :  to route request of delete folder to particular drive
 * @date : 27/05/2016
 * @param : iDeleteFolderObject
 */
actionCreators.prototype.deleteFolder = function( iDeleteFolderObject, iDeleteFolderCB ){
	try{
		var _that = this;	
		logger.info("In etCloudvaultActionCreator : deleteFolder  : " );
		var _serviceProvider = _that.findProvider( { providerName : iDeleteFolderObject.iSource } );
		_serviceProvider.deleteFolder( iDeleteFolderObject );
	}
	catch( error ){
		logger.error("In etCloudvaultActionCreator : deleteFolder  : exception "+ error );
	}	
};

/**
 * @author : RMM 
 * @purpose :  to route request of rename folder to particular drive
 * @date  : 27/05/2016
 * @param : iRenameFolderObject
 */
actionCreators.prototype.renameFolder = function( iRenameFolderObject, iRenameFolderCB ){
	try{
		var _that = this;	
		logger.info("In etCloudvaultActionCreator : renameFolder  :" );
		var _serviceProvider = _that.findProvider( { providerName : iRenameFolderObject.iSource } );
        _serviceProvider.renameFolder( iRenameFolderObject );
	}
	catch( error ){
		logger.error("In etCloudvaultActionCreator : renameFolder  : exception :"+ error );
	}	
};

/**
 * @author : RMM 
 * @purpose :  to route request of sync Drive to particular drive
 * @date : 27/05/2016
 * @param : iShareContactObject
 */
actionCreators.prototype.shareContact = function( iShareContactObject, iShareContactCB ){
	try{
		var _that = this;	
		logger.info("In etCloudvaultActionCreator : shareContact  :" );
		var _serviceProvider = _that.findProvider( { providerName : iShareContactObject.iSource } );
		 _serviceProvider.shareContact( iShareContactObject );
	}
	catch( error ){
		logger.error("In etCloudvaultActionCreator : shareContact  : exception "+ error );
	}	
};
//Export functions - 
exports.actionCreators = actionCreators;