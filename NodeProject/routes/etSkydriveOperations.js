/**
* Author  :AMS
* Purpose : etSkyDriveOperations file used to perform any operations related with Sky Drive
* Date    : 27 June 2016
*/
var common              					  = require('./common');
var cloudvault                              = require('./msProperties').CloudObj;
var hostName                                  = cloudvault.hostNamecloud;
var redisPS                                   = require('./redisPubSub');
var redisps                                   = new redisPS();
var request_Req                               = require('request');
var skydriveAppId                             = cloudvault.skydriveAppId;
var skydrivesecret                            = cloudvault.skydrivesecret;
var skydriveredirect_url                      = hostName+cloudvault.skydriveRedUrl;
var EMAIL_ATTACHMENT_PATH_FROM_USER_FS_PATH   = '/Drop Box';
var USER_FS_PATH                              = common.EIPS2_USERS_PATH;
var dropBoxOp                                 = require('./etDropBoxOperations');
var dropBoxOperations                         = new dropBoxOp.dropDox();
var userPath                                  = common.EIPS2_USERS_PATH;
var fs                                        = require('fs');


var skyDrive= function(){
	return this;
};

skyDrive.prototype = {
		constructor  :  skyDrive
};

/**
 * @author       : AMS 
 * @purpose      : function to get data from third party to configure and add account to skydrive
 * @date         : 27/06/2016
 * @param        :iskyDriveAddAccountObject
 */

skyDrive.prototype.skyDriveAddAccount = function(iskyDriveAddAccountObject , iskyDriveAddAccountCB){
	try{						
				logger.debug("in etSkydriveOperations :skyDriveAddAccount  :");
				
		        var _that         = this;
			    var _userId       = iskyDriveAddAccountObject.userId;	
			    
			    _that.configureSkyDrive( iskyDriveAddAccountObject , function( iConfigureSkyDriveObject , iConfigureSkyDriveCB ){
			    	
				var _token        = iConfigureSkyDriveObject.token;
				var emailId=iConfigureSkyDriveObject.driveInfo.accountInfo.email;
								
				var userInfo={
						user_AC_nm:emailId,
						User_nm:_userId.userId
				};
				

				var _data = { clientInfo:userInfo,
					     token : _token,
						  insertObj: 
						   { dataArray: 
						      [ { ACTION_ARRAY:"ADD_CLOUDVAULT_ACCOUNT",
						          CML_PROVIDER:"SkyDrive"
						       } ] },
						  moduleName: 'CloudVault',
						  extraParam: { subAction: 'ACC_CONF_SKYDRIVE'} 
					};
				
				if(iskyDriveAddAccountCB){
					return iskyDriveAddAccountCB(_data);
				}
			});
			
	}
	catch(error){
		logger.error("in etSkydriveOperations :skyDriveAddAccount  : error "+ error );
	}
};


/**
 * @author   : AMS 
 * @purpose  : function to configure sky drive account.
 * @date     : 29/06/2016
 * @param    : iConfigureSkyDriveObject
 */

skyDrive.prototype.configureSkyDrive = function( iConfigureSkyDriveObject , iConfigureSkyDriveCB ){
	try{
		
		logger.debug("in etSkydriveOperations :configureSkyDrive  :");
		var _that   = this;
		var userId  = iConfigureSkyDriveObject.userId;
		var code    = iConfigureSkyDriveObject.requestCode;
				
		if( code != undefined ){
			
			var userUrl = 'https://login.live.com/oauth20_token.srf';			
						request_Req.post({
												uri: userUrl
												, headers:{'content-type': 'application/x-www-form-urlencoded'}
												, body:require('querystring').stringify({grant_type:'authorization_code', code:code, client_id:skydriveAppId, client_secret:skydrivesecret, redirect_uri : skydriveredirect_url})//	   
										}, function ( err, res, body ) {
											
											if( ! err ){
												
												var token        = JSON.parse(body);
												var _accessToken = token.access_token;
																								
												request_Req.get({
					        						uri: 'https://apis.live.net/v5.0/me'
					        						, headers : {'Authorization': 'Bearer ' + _accessToken}
					        						,  qs: {}//	   
					        					}, function ( err, res , body ) {
					        					    var _userTempObj    = {'userId':userId.username,'userUID':userId.userId};  
					        						var _account        = JSON.parse(body);
					        						var email           = _account.emails.account;
					        						_account.email      = email;
					        						  
					        						_that.getDetailsOfSkyDrive(_accessToken , function(iObjNew){
					        						 						        						 					        						 		
					        						var _userId              =userId.username;
					        						var _moduleName          ="CloudVault";
					        						var _provider            ="SKYDRIVE";
					        						var _accountid           =_account.id;
					        						var _getAllUadKeys       = _userId + "#" +'UAD'+':'+ "Settings" + "_" +  _moduleName +"_" +_provider;
					        						var _dateInMilliseconds  = new Date().getTime();
					        						var _rowkey1             = _userId + "#" +'UAD' +':' + "Settings" + "_" +  _moduleName + "_" + _provider + "_" 
					        								                            + _accountid + "#"+_dateInMilliseconds;
					        						var _driveName = "S"; 
					        						var _driveInfo =  {
						        							    		totalCapDrive 		: iObjNew.totalCap + '',
						        							    		allocateCapDrive    : iObjNew.allocatedCap + '',
						        							    		getAllUadKeys	    : _getAllUadKeys,
						        							    		driveName		    : _driveName,
						        							    		userInfo		    : _userTempObj,
						        							    		UAD_CML_ID          : _rowkey1,
						        							    		accountInfo         : _account
					        							  };
					        						var _obj       = {
					        											driveInfo       : _driveInfo,
					        											token           : token,
					        											
					        							};
					        							
					        								if( iConfigureSkyDriveCB )iConfigureSkyDriveCB( _obj );
					        						 	});

					        								
					        					});
												
										}
								});
			
		}
		
	}catch(e){
		logger.error("in etSkydriveOperations :configureSkyDrive  : error "+ e );
	}
	
};


/**
 * @author : AMS 
 * @purpose : function to read sky drive account 
 * @date : 29/06/2016
 * @param : iReadSkyDrive
 */
skyDrive.prototype.readSkyDrive = function( iReadSkyDrive , iReadSkyDriveCB ){
	try{
		
		logger.debug("in etSkydriveOperations :readSkyDrive  :");
		var _that        = this;		
		var _token       = iReadSkyDrive.token;
		var _accessToken = _token.access_token;		
		
	    var url          = 'https://apis.live.net/v5.0/me/skydrive/files';				
				request_Req.get({
									url : url
									, headers : { 'Authorization': 'Bearer ' + _accessToken }
				                    ,  qs: {}//	   
							}, function (err, res, body) {
								var allData = JSON.parse(body);
								
								var _obj    = {
												folders       : allData.data,
												accessToken   : _accessToken
								};
								_that.readSkyDriveData( _obj, function( iRecord ){
																		
									if( iReadSkyDriveCB )iReadSkyDriveCB( iRecord );
								});								
						});	
		
	}catch(e){
		logger.error("in etSkydriveOperations :readSkyDrive  : error "+ e );
	}
};

/**
 * @author : AMS 
 * @purpose : function to get details of account on sky drive
 * @date : 27/06/2016
 * @param : token 
 */

skyDrive.prototype.getDetailsOfSkyDrive = function(token, iGetDetailsOfSkyDriveCB) {
	try{
		logger.debug("In etSkyDriveOperations : getDetailsOfSkyDrive");
		request_Req.get({
			uri: 'https://apis.live.net/v5.0/me/skydrive/quota',
			headers : {'Authorization': 'Bearer ' + token},
			qs: {}//	   
		}, function (err, res, body) {
			var account          = JSON.parse(body);			
			var _totalCap        = account.quota;
			var _allocatedCap    = _totalCap - account.available;
			
			var _newObj = {
					totalCap	    : _totalCap + '',
					allocatedCap	: _allocatedCap + ''
			};
			
			if( iGetDetailsOfSkyDriveCB ){
				iGetDetailsOfSkyDriveCB( _newObj );
			}
		});
		
	}catch( e ){
		logger.error("Exception catched in etSkydriveOperation.js",e);
	}
};

/**
* @author    : AMS 
* @purpose   :  function to get folders and files of account on sky drive
* @date      : 27/06/2016
* @param     : iReadSkyDriveDataObject
*/

skyDrive.prototype.readSkyDriveData = function(iReadSkyDriveDataObject, iReadSkyDriveDataCB) {

	try{
			var folders   = iReadSkyDriveDataObject.folders;
		    var acc_token = iReadSkyDriveDataObject.accessToken ;
		    
		    var _exe =  function( AllFolder , index )
			{
				var iAccount = AllFolder[ index ];
				  if( iAccount.id.indexOf( "folder" ) != -1 ){
					  request_Req.get({
							uri: 'https://apis.live.net/v5.0/'+iAccount.id+'/files'
							, headers : {'Authorization': 'Bearer ' + acc_token}
							, qs: {}//	   
					}, function ( err, res , body ) {
						if( !body ){
							_exe( AllFolder , index );
						}							
						else{
							var folder            = JSON.parse(body);
							var folderFilesArr    = new Array();
							folderFilesArr        = folder.data ;
							if ( folderFilesArr.length > 0 ) {
								AllFolder         = AllFolder.concat( folderFilesArr );
							}
							if( index++ == ( AllFolder.length - 1 )){
								iReadSkyDriveDataCB( AllFolder );
							}else
								_exe( AllFolder , index );
						}
						
						});
					  }else{
						  if( index++ == ( AllFolder.length - 1 )){
							  iReadSkyDriveDataCB( AllFolder );
							}else
								_exe( AllFolder , index );
					  }		
			};
			if( folders != undefined && folders.length > 0 )
				_exe( folders , 0 );	
			else{
				iReadSkyDriveDataCB( folders );
			}		
	}catch(e){
		logger.error("in etSkydriveOperations :readSkyDriveData  : error "+ e );
	}	
};
//
/**
 * @author   : AMS
 * @purpose  : function to add folder to Sky drive
 * @date     : 4/07/2016
 * @param : iAddFolderObject
 */
skyDrive.prototype.addFolder = function( iAddFolderObject, iAddFolderCB ){/*
	try{
		logger.debug("in etSkydriveOperations : addFolder  :  ");
		
		
		var _that = this;		
		iUserInfo            = iAddFolderObject.iUserInfo;
		iSource              = iAddFolderObject.iSource;
		iDestination         = iAddFolderObject.iDestination;
		iParam               = iAddFolderObject.iParam;
		iSocketId			 = iAddFolderObject.socketId;
		
		var _param           = iParam;
		var _srcParams       = _param.SRC_PARAM;
		var _folderIdOnCloud = _srcParams.cldParent;
		var _folderName      = _srcParams.folderName;
		var _accountId       = _srcParams.accountId;
		var _accessToken     = _srcParams.accessToken;
		
		var _objct           = { name  :  _folderName };
		var _objs            = JSON.stringify(_objct);		
		
		var _obj             = {
						  			accessToken      :  _accessToken,	  			
						  			accountId        :  _accountId
	  	                      };
		
		_that.refreshAccessToken( iUserInfo , _obj ,function( iObj ){
			var _accsTokn    = iObj.accessToken;
			if( typeof _accsTokn === "string" ){
				_accsTokn    = JSON.parse( _accsTokn );
			}		     
			
			var _accessToken = _accsTokn.access_token;
		    		   
    		request_Req.post({
    			'url'   : 'https://apis.live.net/v5.0/'+_folderIdOnCloud,
    			headers : {  'Authorization': 'Bearer ' + _accessToken,
    				         'content-type' : 'application/json'
    					  },
    			body    :   _objs
    			
    		}, function( err ,reply , body ){
    			if( !err && body.indexOf(":") != -1 ){
    				
    				logger.debug("in etSkydriveOperations : addFolder : 3rd party cb " );
    				
    				var foldObj = JSON.parse( body );
    				var upObj   = {
									
									CON_PARAM   :   { PK  :  "CML_ID" , PKVAL :  _srcParams.folderId , KEY_TYPE:"NDD"},
		    						RECORD      :   { CML_DESCRIPTION  :  foldObj.id , SYNC_PENDING_STATUS : 1},
		    						TN          :   "NODE_DETAILS_DISPLAY"		    																
							}; 							       
						    
					if( foldObj && foldObj.parent_id ){
						upObj.RECORD.NDD_PARENT_THIRD_PARTY_ID = foldObj.parent_id;
	    			}
					var _updateObject                 = {};
					_updateObject.clientInfo          = iAddFolderObject.iUserInfo;
					_updateObject.updateObj           = {};
					_updateObject.updateObj.action    = "UPDATE";
					_updateObject.updateObj.dataArray = [];
					_updateObject.updateObj.dataArray.push( upObj );	
					
					var _spaceChkObj = {
			 				moduleName    : 'SKY_DRIVE',
							url           : 'https://apis.live.net/v5.0/me/skydrive/quota',
							token         : _accsTokn.access_token,
							uad           : _accountId,
							userInfo      : iUserInfo
					};	
					if( iParam['moveFolder'] ){
						if(iAddFolderCB)iAddFolderCB( foldObj.id , _spaceChkObj );
					}
					else{
						
						dropBoxOperations.convertRequestToStdFormat( _updateObject , function( iConvertedData ){
							
							iConvertedData.extraParam = {
									subAction :  "ADD_FOLDER_CV"
							};
							
							if(iSocketId ){
								iConvertedData.socketId =  iSocketId ;				
							}
							
							var _temp = {
									data : iConvertedData
							};
							
							common.queueLibs.sendToJavaProcess( _temp , common.appConfigObj.client['mode'] );							
						});
						if( iAddFolderCB )iAddFolderCB( foldObj.id  , _spaceChkObj );						
					}					
    			}
    			else{
					logger.error("in etSkydriveOperations : addFolder  : error "+ err );
				}
    		});
		});
	}
	catch( error ){
		logger.error("in etSkydriveOperations :addFolder  : error "+ error );
	}	
*/};

/**
 * @author   : AMS 
 * @purpose  : function to  delete folder in Skydrive
 * @date     : 4/07/2016
 * @param    : iDeleteFolderObject
 */
skyDrive.prototype.deleteFolder = function( iDeleteFolderObject, iDeleteFolderCB ){/*
	try{
		var _that = this;	
		logger.debug("in etSkydriveOperations :deleteFolder  : ");
		
		
		iUserInfo            = iDeleteFolderObject.iUserInfo;
		iSource              = iDeleteFolderObject.iSource;
		iDestination         = iDeleteFolderObject.iDestination;
		iParam               = iDeleteFolderObject.iParam;
		iSocketId			 = iDeleteFolderObject.socketId;
		
		var _param           = iParam;
		var _srcParams       = _param.SRC_PARAM;
		var _folderIdOnCloud = _srcParams.cldParent;
		var _accountId       = _srcParams.accountId;
		var _accessToken     = _srcParams.accessToken;
		
		var _obj             = {
						  			accessToken      :  _accessToken,
						  			accountId        :  _accountId
								};
		
		_that.refreshAccessToken( iUserInfo , _obj , function(iObj){
			var _accsTokn  = iObj.accessToken;
			if(typeof _accsTokn === "string")
 			     _accsTokn = JSON.parse(_accsTokn);
			
			var _accessToken  = _accsTokn.access_token;
		    
		    request_Req.del({
		    	url : 'https://apis.live.net/v5.0/'+_folderIdOnCloud+'?access_token='+_accessToken
		    	
		         },function( err , reply , body ){
		    	 if( !err ){
		    		 
		    		 var upObj = {
											CON_PARAM   :   { PK  :  "CML_ID", PKVAL :  _srcParams.folderId,KEY_TYPE:"NDD"},
											RECORD      :   { ACTIVE_STATUS  :  0,SYNC_PENDING_STATUS  :  1},
											TN          :   "NODE_DETAILS_DISPLAY"
						             };
		    		 
		    		 var _updateObject                    = {};
					 _updateObject.clientInfo             = iDeleteFolderObject.iUserInfo;
					 _updateObject.updateObj              = {};
					 _updateObject.updateObj.action       = "UPDATE";
					 _updateObject.updateObj.dataArray    = [];
					 _updateObject.updateObj.dataArray.push( upObj );
					
					 var _spaceChkObj = {
				 				moduleName   : 'SKY_DRIVE',
								url          : 'https://apis.live.net/v5.0/me/skydrive/quota',
								token        : _accessToken,
								uad          : _accountId,
								userInfo     : iUserInfo
						};	
						
						if( iDeleteFolderCB )iDeleteFolderCB( _updateObject , _spaceChkObj );
						dropBoxOperations.convertRequestToStdFormat(_updateObject , function(iConvertedData){
							
							iConvertedData.extraParam = {
									subAction :  "ADD_FOLDER_CV"
							};
							
							if(iSocketId ){
								iConvertedData.socketId =  iSocketId ;				
							}
							
							var _temp = {
									data : iConvertedData
							};
														
							common.queueLibs.sendToJavaProcess( _temp , common.appConfigObj.client['mode'] );						
						});				 
		    	 }
		    	 else{
						logger.error("in etGoogleDriveOperations : addFolder  : error "+ err );
					}	    	
		    });		    
		});		
	}
	catch( error ){
		logger.error("in etSkydriveOperations :deleteFolder  : error "+ error );
	}	
*/};



/**
 * @author  : AMS
 * @purpose : Function  to rename folder of Skydrive
 * @date    : 4/07/2016
 * @param   : iRenameFolderObject
 */
skyDrive.prototype.renameFolder = function( iRenameFolderObject, iRenameFolderCB ){/*
	try{

		logger.debug("in etSkydriveOperations :renameFolder  :  ");
		
		var _that = this;		
		iUserInfo            = iRenameFolderObject.iUserInfo;
		iSource              = iRenameFolderObject.iSource;
		iDestination         = iRenameFolderObject.iDestination;
		iParam               = iRenameFolderObject.iParam;
		iSocketId			 = iRenameFolderObject.socketId;
		
		var _param           = iParam;
		var _srcParams       = _param.SRC_PARAM;
		var _folderIdOnCloud = _srcParams.cldParent;
		var _folderName      = _srcParams.folderName;
		var _accountId       = _srcParams.accountId;
		var _accessToken     = _srcParams.accessToken;
		
		var _objct           = { name  :  _folderName };
		var _objs            = JSON.stringify(_objct);
		
		var _obj             = {
						  			accessToken      :  _accessToken,
						  			accountId        :  _accountId
	  	                       };
		
		
		_that.refreshAccessToken( iUserInfo , _obj ,function( iObj ){
			
			var _accsTokn      = iObj.accessToken;
			if(typeof _accsTokn === "string"){
				_accsTokn      = JSON.parse(_accsTokn);
			}		
			var _accessToken   = _accsTokn.access_token;
		  
		   request_Req.put({
    			'url': 'https://apis.live.net/v5.0/'+_folderIdOnCloud,
    			'headers' : {  'Authorization': 'Bearer ' + _accessToken,
    				'content-type' : 'application/json',
    			     //'process-data'  : false
    		},
    			'body'    : _objs	
    		}, function( err , reply , body ){
    			
    			if( !err ){
    				    				
    				 var upObj  = {
			    						CON_PARAM  :  {PK  : "CML_ID", PKVAL  :  _srcParams.folderId ,KEY_TYPE:"NDD"  },
			    						RECORD     :  {CML_NAME   :  _folderName, SYNC_PENDING_STATUS : 1 },
			    						TN         :  "NODE_DETAILS_DISPLAY"
			                      };
    				
    				 var _updateObject                    = {};
					 _updateObject.clientInfo             = iRenameFolderObject.iUserInfo;
					 _updateObject.updateObj              = {};
					 _updateObject.updateObj.action       = "UPDATE";
					 _updateObject.updateObj.dataArray    = [];
					 _updateObject.updateObj.dataArray.push( upObj );
										 
					 dropBoxOperations.convertRequestToStdFormat( _updateObject , function( iConvertedData ) {
						 
						 iConvertedData.extraParam = {
									subAction : "RENAME_FOLDER_CV"
							};
																
							if( iRenameFolderObject.socketId ){
								iConvertedData.socketId =  iRenameFolderObject.socketId ;				
							}
							var _temp = {
									data : iConvertedData
							};
							
							common.queueLibs.sendToJavaProcess( _temp , common.appConfigObj.client['mode'] );
					 });
    			}
    			else{
    				logger.error("in etSkydriveOperations : renameFolder  : error "+ err );
    			}
    		});
		});
		
	}
	catch( error ){
		logger.error("in etSkydriveOperations :renameFolder  : error "+ error );
	}	
*/};

/**
 * @author : AMS
 * @purpose : function  to upload file to the Skydrive
 * @date : 12 July 2016
 * @param : iUploadFileObject
 */
skyDrive.prototype.uploadFile = function( iUploadFileObject, iUploadFileCB ){/*
try{
		var _that = this;	
		logger.debug("in etSkydriveOperations :uploadFile  :  ",iUploadFileObject);
			
		iUserInfo            = iUploadFileObject.iUserInfo;
		iSource              = iUploadFileObject.iSource;
		iDestination         = iUploadFileObject.iDestination;
		iParam               = iUploadFileObject.iParam;
		iSocketId			 = iUploadFileObject.socketId;
		
		var _param = iParam;
		var _srcParams = _param.SRC_PARAM;
		var _folderIdOnCloud      = _srcParams.cldParent;
		var _folderName=_srcParams.folderName;
		var _accountId =  _srcParams.accountId;
		var _accessToken = _srcParams.accessToken;
		var fILE = userPath + _srcParams.filepath.substring(4);
		
		
		fs.stat(fILE, function( ierr , istats ) {
		
		var _exists = null;
		if(!ierr && istats && istats.isFile()){
		
			_exists = true;
				
			if(_exists){
				logger.info("path existss in case of upload file in etSkydrive");
				var fstatus = fs.statSync(fILE);
			  
				fs.open(fILE, 'r', function(status, fileDescripter) {
				if (status) {
					
			    	  fileUploadCalBack(status.message);
			          return;
		       }						  
			   var buffer = new Buffer(fstatus.size);
			   fs.read(fileDescripter, buffer, 0, fstatus.size, 0, function(err, num ,content) {
			   var _obj   = {
			      	    	     accessToken      :  _accessToken,
			      	       	     accountId        :  _accountId
			      	    };
			      	    
			      	   	_that.refreshAccessToken(iUserInfo, _obj, function( iObj ){
			       					      	    		
			    		var _accsTokn  = iObj.accessToken;
	      	    		if(typeof _accsTokn === "string")
			   			_accsTokn = JSON.parse(_accsTokn);
			      	    		
			      	    var uri='https://apis.live.net/v5.0/'+_folderIdOnCloud+'/files/'+_folderName+'?access_token='+_accsTokn.access_token;
			      	    request_Req({
							      	    method : 'PUT',
							      	    uri    : uri,
							      	    body   : content
			      	    			 },function( status , response , file ){
			      	    			
			      	    	       	 if(file){
						      	    			var _file=JSON.parse(file);
						      	    			if(_file.id){	
						      	    									      	    					
						      	    			var upObj = {
						    									
						    								CON_PARAM   : { PK  :  "CML_ID" , PKVAL :  _srcParams.folderId , KEY_TYPE:"NDD"},
						    	    						RECORD      : { CML_DESCRIPTION  :  _file.id , SYNC_PENDING_STATUS : 1},
						    	    						TN          : "NODE_DETAILS_DISPLAY"		    																
						   							}; 
						   	    											      	    					
						      	    				var _updateObject = {};
						    						_updateObject.clientInfo          = iUploadFileObject.iUserInfo;
						    						_updateObject.updateObj           = {};
						    						_updateObject.updateObj.action    = "UPDATE";
						    						_updateObject.updateObj.dataArray = [];
						    						_updateObject.updateObj.dataArray.push( upObj );						    						  							
						          									      	    					
						   	    					var _spaceChkObj = {
															 				moduleName    : 'SKY_DRIVE',
																			url           : 'https://apis.live.net/v5.0/me/skydrive/quota',
																			token         : _accsTokn.access_token,
																			uad           : _accountId,
																			userInfo      : iUserInfo
														                  };
					    	    											      	    					
					      	    					if( iUploadFileCB )iUploadFileCB( _updateObject , _spaceChkObj );
						      	    					
					      	    					 dropBoxOperations.convertRequestToStdFormat( _updateObject , function( iConvertedData ) {
	   			      	    						 logger.debug("in convertreqtostdformat.....",iConvertedData);	   			      	    					    			      	    						

						    						iConvertedData.extraParam = {
						    									subAction : "UPLOAD_FILE_CV"	
						    								};
						    								
						    						if( iUploadFileObject.socketId ){
																iConvertedData.socketId =  iUploadFileObject.socketId ;				
															}
						    						var _temp = {
						    												data : iConvertedData
						    									};
						    						common.queueLibs.sendToJavaProcess( _temp , common.appConfigObj.client['mode'] );
						      	    						 
						      	    			 });
						      	    		}
						      	    			else{
						      	    				   if(iUploadFileCB)iUploadFileCB();
						      	    			}
			      	    		    	}
			      	    	        });			      	    		
			      	    	});
			      	      });			      	    	
					  });
				  }
			}
		else{
			logger.error("in etSkydriveOperations :uploadFile  : error "+ ierr );
		}
		});
		
		
	}
	catch( error ){
		logger.error("in etSkydriveOperations :uploadFile  : error "+ error );
	}	
*/};


/**
 * @author : AMS
 * @purpose :  function to Syn Sky Drive
 * @date : 16/07/2016
 * @param : iSyncDriveObject
 */
skyDrive.prototype.syncDrive = function( iSyncDriveObject, iSyncDriveCB ){/*
	try{
		var _that  = this;	
		logger.debug("in etSkydriveOperations :syncDrive  :  ");
		iUserInfo  = iSyncDriveObject.iUserInfo;
		iParam     = iSyncDriveObject.iParam;
		
		var _srcParams         = iParam.SRC_PARAM;
		var _accessTokenObj    = _srcParams.accessToken;
		var _userId            = iUserInfo.userId;
		var _accountId		   = _srcParams.accountId;	
		

		if(typeof(_accessTokenObj)=='string'){
			_accessTokenObj=JSON.parse(_accessTokenObj);
		}
		else{
			 _accessTokenObj   =_srcParams.accessToken;
		}
		var _accessToken       = _accessTokenObj.access_token;
    	
		   var _obj = {
		      	    	accessToken      :  _accessToken,
		      	       	accountId        :  _accountId
		      	    };
		   _that.refreshAccessToken(iUserInfo, _obj, function(iObj){
			   if(iObj){
				   var _accTokn = iObj.accessToken;
				   if(typeof(_accTokn)=='string'){
					   _accTokn = JSON.parse(_accTokn);
				   }
				   else{
					   		_accTokn = _accTokn.access_token;
					   }
				   
				   var _access_token = _accTokn.access_token;
				   
				   request_Req.get({
		    			uri: 'https://apis.live.net/v5.0/me/skydrive/files'
						, headers : {'Authorization': 'Bearer ' + _access_token}
						,  qs: {}//
		    		}, function(err, res, body){
		    			if(body){
		    				var _allData = JSON.parse(body);
		    				dropBoxOperations.convertRequestToStdFormat( _allData , function( iConvertedData ) {
		    					iConvertedData.clientInfo =  { userId   : _userId };
		    					

								iConvertedData.extraParam = {
										 subAction :  "SYNC_DRIVE_CV",
										 AccountID : _accountId,
										 Provider  :  "SKYDRIVE",
										 Token     :  _access_token
			                            };	
								

								if( iSyncDriveCB )iSyncDriveCB( null , _allData );
								var _temp = {
												data  :  iConvertedData
								};
								common.queueLibs.sendToJavaProcess( _temp , common.appConfigObj.client['mode'] );
		    				});
		    				
		    			}
		    		});
			   }
		   });
		
	}
	catch( error ){
		logger.error("in etSkydriveOperations :syncDrive  : error "+ error );
	}	
*/};

/**
 * @author : RMM 
 * @purpose :  to route request of sync Drive to particular drive
 * @date : 26 May 2016
 */
/*skyDrive.prototype.syncDriveCallBack = function(iSyncDriveCallBackObject , iSyncDriveCallBackCB){
	try{
			url for downloading files......
			1. https://apis.live.net/v5.0/file.a6b2a7e8f2515e5e.A6B2A7E8F2515E5E!126/content?download=true?access_token=ACCESS_TOKEN
			2. https://apis.live.net/v5.0/file.a6b2a7e8f2515e5e.A6B2A7E8F2515E5E!126/content?suppress_redirects=true?access_token=ACCESS_TOKEN
		
		var _that = this;
		logger.debug("in etSkydriveOperations :syncDriveCallBack  :  ");
		
		var _accessToken        = iSyncDriveCallBackObject.Token;
		var _userId             = iSyncDriveCallBackObject.dataArray[ 0 ].CREATED_BY;
		var _arrayOfNewFiles    = iSyncDriveCallBackObject.dataArray;
		for( var i = 0; i < _arrayOfNewFiles.length; i++ ){
			
		}
	}
	catch( error ){
		logger.error("in etSkydriveOperations :syncDriveCallBack  : error "+ error );
	}	
};*/

/**
 * @author : RMM 
 * @purpose :  to route request of sync Drive to particular drive
 * @date : 26 May 2016
 */
skyDrive.prototype.shareContact = function( iShareContactObject, iShareContactCB ){
	try{
		var _that = this;
		logger.debug("in etSkydriveOperations :shareContact  :  ");
	}
	catch( error ){
		logger.error("in etSkydriveOperations :shareContact  : error "+ error );
	}	
};

exports.skyDrive = skyDrive;