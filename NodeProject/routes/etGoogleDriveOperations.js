/**
* Author  :RMM 
* Purpose : etGoogleDriveOperations file used to perform any operations related with Google Drive
* Date    : 27 May 2016
*/
var common              					 = require('./common');
var msProp	  				                 = require('./msProperties');
var cloudvault                               = msProp.CloudObj;
var hostName           						 = cloudvault.hostNamecloud;
var request_Req         					 = require('request');
var gDrive                                   = require('google-drive');
var googleapis                               = require('googleapis');
//var CreateObjectStruct						 = require('./createObjectStruct').createObjectStruct;
var jwt 									 = require('jsonwebtoken');
var OAuth2                                   = googleapis.auth.OAuth2;
var dropBoxOp                                = require('./etDropBoxOperations');
var dropBoxOperations                        = new dropBoxOp.dropDox();
var appConfigObj                             = msProp.appConfig;
var clientObj                                = appConfigObj.client;
var fs 	                                     = require('fs');
var https 	                                 = require('https');
//var timstamp                                 = require('internet-timestamp');
var skydriveredirect_url                     = hostName+cloudvault.skydriveRedUrl;
var config                                   = {};
var logger                                   = common.logger;
var USER_FS_PATH                             = common.EIPS2_USERS_PATH;
var EMAIL_ATTACHMENT_PATH_FROM_USER_FS_PATH  ='/Drop Box';
var userPath                                 = common.EIPS2_USERS_PATH; 
var oauth2ClientForContact = new OAuth2(cloudvault.googleContactClientId, cloudvault.googleContactClientSecret, hostName+cloudvault.googleContactRedUrl);


var oauth2Client;
var googleDrive= function(){
	try{
		//added by AMS for googleapis@2.0.4
		var OAuth2    = googleapis.auth.OAuth2; 
		var plus      = googleapis.plus('v1');
		oauth2Client  =  new OAuth2(cloudvault.googleAppId, cloudvault.googleSecret, hostName + cloudvault.googleRedUrl);// google console from account nciportal1@gmail.com credentials need to use reference name	
	}
	catch(e){
		logger.debug("Exception catch in  etGoogleDrive : constructor ",e);		
	}
};

googleDrive.prototype = {
		constructor  :  googleDrive
};

// google Drive Add Account(AMS).........
/**
 * @author  : AMS 
 * @purpose : function to  get data from third party for adding new google drive account
 * @date    :  15 June 2016
 * @Param   : iGoogleDriveAddAccountObject 
 */
googleDrive.prototype.googleDriveAddAccount=function(iGoogleDriveAddAccountObject ,iGoogleDriveAddAccountCB){
			logger.info("in etgoogleDriveOperations :googleDriveAddAccount  :");
			var _that=this;
			try{
				var _userId = iGoogleDriveAddAccountObject.userId;				
				
				_that.configureGoogleDrive(iGoogleDriveAddAccountObject , function( iRecordDI,iRecordAI ){
					var oauth2Client=iRecordDI.Oauth2Client.credentials;	
					
					var token=oauth2Client;
					
					var userInfo={
							userEmialId:iRecordDI.driveInfo.accountInfo.user.emailAddress,
							userId:_userId
					};
					
					var _data = { clientInfo:{userId:userInfo.userId},
						     token : token,
							  insertObj: 
							   {  action :"INSERT",
								   dataArray: 
							      [ { ACTION_ARRAY:["ADD_ACCOUNT_CV"],
							          CML_PROVIDER:"GOOGLE",
							          ACTIVE_STATUS:"1",
							          KEY_TYPE :"UAD",
							          SUB_KEY_TYPE :"UAD",
							          CML_EMAIL_ID:userInfo.userEmialId,
							          ACCESS_TOKEN:token,
							          SYNC_PENDING_STATUS :"0",
							          TN :"GENERAL_INFO"
							       } ] },
							  moduleName: 'UAD',
							  extraParam: { subAction: 'ADD_ACCOUNT_CV'} 
						};
					
					if(iGoogleDriveAddAccountCB){
						return iGoogleDriveAddAccountCB(_data);
					}
				});				
			}catch(e){
				logger.error("in etGoogleDriveOperations :  googleDriveAddAccount  : error " + e );	
				
			}		
};

/**
 * @author  : AMS 
 * @purpose : function to configure or add new google drive account
 * @date    :  17 June 2016
 * @Param   : iconfigureGoogleDriveObject 
 */
googleDrive.prototype.configureGoogleDrive=function(iconfigureGoogleDriveObject , iConfigureGoogleDriveCB){
		logger.debug("in etgoogleDriveOperations :configureGoogleDrive :");
		
		var code = iconfigureGoogleDriveObject.requestCode;
		oauth2Client.getToken(code, function(err, tokens) {
			oauth2Client.credentials = tokens;			

		try{	
			var userInfo=null,_userTempObj=null;
			if(iconfigureGoogleDriveObject)
			{
				userInfo = iconfigureGoogleDriveObject;
				_userTempObj = {'userId':userInfo.userId['userId'],'userUID':userInfo.userId['userId']};
			}
			var _userId=_userTempObj.userId;
			var userUrl = 'https://www.googleapis.com/drive/v2/about'//user Info
				, queryParams = { access_token : oauth2Client.credentials.access_token, alt: 'json' };
								  request_Req.get({
												    url : userUrl
												  , qs  : queryParams
					}, function (err, res, body) {

						if(body){
							
							var account       = {},accInfo = JSON.parse(body);										
							account.uid       = accInfo.user.permissionId;//to unique id provided by google..........
							account.email     = accInfo.user.emailAddress;
							var _moduleName   = "CloudVault";
						    var _provider     = "GOOGLE";
							var _accountid    = account.uid;
												 
							 if(!iconfigureGoogleDriveObject){
								 	_userTempObj    =  { 'userId':account.email,'userUID':account.email };
							    	_userId		    =  account.email;						    	
							 }
							  
							var _getAllUadKeys       = _userId + "#" +'UAD'+':'+ "Settings" + "_" +  _moduleName +"_" +_provider;
							var _dateInMilliseconds  = new Date().getTime();
							var _rowkey1             = _userId + "#" +'UAD' +':' + "Settings" + "_" +  _moduleName + "_" + _provider + "_" 
							                            + _accountid + "#"+_dateInMilliseconds;
							 
							var _driveName           = "G";
							var _driveInfo           =  {								
												    		accountInfo         :accInfo,
												    		totalCapDrive 		: accInfo.quotaBytesTotal + '',
												    		allocateCapDrive    : accInfo.quotaBytesUsedAggregate + '',
												    		getAllUadKeys	    : _getAllUadKeys,
												    		driveName		    : _driveName,
												    		userInfo		    : _userTempObj,
												    		UAD_CML_ID			:_rowkey1
							  };						    
							var _obj                 = {
								    		driveInfo           : _driveInfo,
								    		Oauth2Client        : oauth2Client
							    };			  			   
							  
							   if(iConfigureGoogleDriveCB)iConfigureGoogleDriveCB( _obj,accInfo );	
						}
											   
					});								
		}catch(e){
			logger.error("in etGoogleDriveOperations :  googleDriveAddAccount  : error " + e );
			}
		});			
};

/**
 * : author : GSS
 * : purpose:Import Contact
 * : date :  June 2016
 */

googleDrive.prototype.importContactsOnGmail=function(importContactObject , importContactObjectCB){
	try{
		logger.info("In etGoogleDriveOperation : importContactsOnGmail ");
		
		let code=importContactObject.requestCode;
		oauth2ClientForContact.getToken(code, (err, token) => {
		if(!err && token) {
			console.log("Get token....",token);
			const _userId =importContactObject.userId;

			const userUrl = 'https://www.googleapis.com/drive/v2/about'; //user Info
			const queryParams = {access_token:token.access_token, alt: 'json'};
			
			request_Req.get({
				url: userUrl,
				qs: queryParams,
			},(err, res, body) =>{
				const accInfo = JSON.parse(body);//get scc info of google
				let accountEmailId = accInfo.user.emailAddress;
				
				let _data = {
						clientInfo:{userId:_userId},
					     token : token,
						  insertObj: 
						   { action : "INSERT",
							  dataArray: 
						      [ { ACTION_ARRAY:["IMPORT_CONTACT"],
						    	  KEY_VAL:_userId+"#CDE:"+accountEmailId,
						          CML_PROVIDER:"GOOGLE",
						          ACTIVE_STATUS:"1",
                                  KEY_TYPE : "CDE",
						          SUB_KEY_TYPE:'CDE',
						          CML_EMAIL_ID:accountEmailId,
						          ACCESSTOKEN:token,
						          SYNC_PENDING_STATUS : "0",
						          TN : "CONTACT_DETAILS"
						       } ] },
						  moduleName:'CDE',
					};
				
				if(importContactObjectCB){
					return importContactObjectCB(_data);
				}

				});//importcontactgmail closed
			
		}else{
			logger.info('In etRouteHandler2Page : googleContactsCallBack :token not present');
		}
	  });
	}catch(e){
		logger.error("In etGoogleDriveOperation : importContactsOnGmail :Error : ",e);
	}
	console.log("importContactObject...importContactObject",importContactObject)
};


/**
 * : author : AMS
 * : purpose :  to  upload file to Google drive
 * : date : 22 June 2016
 */
googleDrive.prototype.uploadFile = function( iUploadFileObject, iUploadFileCB ){
	try{
		logger.debug("in etGoogleDriveOperations : uploadFile  :  ");
				
		iUserInfo               = iUploadFileObject.iUserInfo;
		iSource                 = iUploadFileObject.iSource;
		iDestination            = iUploadFileObject.iDestination;
		iParam                  = iUploadFileObject.iParam;
		iSocketId			    = iUploadFileObject.socketId;
		
		var _param              = iParam;
		var _srcParams			= _param.SRC_PARAM;
		var fILE                = userPath + _srcParams.filepath.substring(4);
		var _accountId          = _srcParams.accountId;
		var _folderIdOnCloud    = _srcParams.cldParent;
        var _accessTokenObj     = null;   
        
        if(typeof _srcParams.accessToken == 'string'){
			_accessTokenObj = JSON.parse(_srcParams.accessToken);	
		}else{
			_accessTokenObj = _srcParams.accessToken;
		}
				
		var _refreshToken              = _accessTokenObj.refresh_token;
		var _bodyObjToSetForRootFolder = {};
		
		if( _folderIdOnCloud == '/' ){
			_bodyObjToSetForRootFolder = { "title": _srcParams.folderName,"mimeType": "application/octet-stream"};
		}
		else
			_bodyObjToSetForRootFolder = { "title": _srcParams.folderName, "parents": [{"id": _folderIdOnCloud}], 
			"mimeType": "application/octet-stream"};
		
		fs.stat( fILE, function( ierr , istats ) { 
		    var _exists = null;
			if( !ierr && istats && istats.isFile() ){
				_exists = true;
				if( _exists ){
					var fstatus = fs.statSync( fILE );
					fs.open( fILE , 'r', function( status , fileDescripter ) {
						
						if ( status ) {
			    			  fileUploadCalBack( status.message );			    	    	  
			    	          return;
			    	      }
			    		  var buffer = new Buffer( fstatus.size );
			    		  
			    		  fs.read( fileDescripter , buffer , 0 , fstatus.size , 0 , function( err , num , content ) {
			    			 
			    			  oauth2Client.refreshToken_( _refreshToken , function( err , result ){
			    				 
			    				  var _accsTokn = result.access_token;			    				 
			    				  request_Req.post({
									      	              'url'      : 'https://www.googleapis.com/upload/drive/v2/files',
									      	              'qs'       : {  'uploadType': 'multipart'	 },                 
									      	              'headers'  : { 'Authorization': 'Bearer ' + _accsTokn },	  			
									      	              'multipart':  [
									      	                             	{
													      	                  'Content-Type': 'application/json; charset=UTF-8',
													      	                  'body': JSON.stringify(_bodyObjToSetForRootFolder)
													      	                },
													      	                {
													      	                  'Content-Type': 'application/octet-stream',
													      	                  'body': content
													      	                }
													      	             ] 	              
				      	              				      	               
				      	            },function( status , response , body ){
				      	            	
				      	            	if( body ){				      	            		
				      	            		var _file = JSON.parse(body);				      	            		
				      	            		if( _file.id ){
				      	            							      	            			
				      	            			var upObj = {
				    									
				    									CON_PARAM   :   { PK  :  "CML_ID" , PKVAL :  _srcParams.folderId , KEY_TYPE:"NDD"},
				    		    						RECORD      :   { CML_DESCRIPTION  :  _file.id , SYNC_PENDING_STATUS : 1},
				    		    						TN          :   "NODE_DETAILS_DISPLAY"		    																
				    							}; 
				      	            			
				      	            			var _updateObject = {};
				    							_updateObject.clientInfo          = iUploadFileObject.iUserInfo;
				    							_updateObject.updateObj           = {};
				    							_updateObject.updateObj.action    = "UPDATE";
				    							_updateObject.updateObj.dataArray = [];
				    							_updateObject.updateObj.dataArray.push( upObj );
				    											    											      	            			
				    							var _spaceChkObj = {
					    				 				moduleName : 'GOOGLE_DRIVE',
					    								url        : 'https://www.googleapis.com/upload/drive/v2/files',
					    								token      : result.access_token,
					    								uad        : _accountId,
					    								userInfo   : iUserInfo
					    				 		};
				    							
				    							if( iUploadFileCB )iUploadFileCB( _updateObject , _spaceChkObj );
				    							dropBoxOperations.convertRequestToStdFormat(_updateObject , function(iConvertedData){
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
				      	            			
				      	            	}
				      	            	else{
				      	            				if( iUploadFileCB )iUploadFileCB();
				      	            	}
				      	            	
				      	            });
			    			  });
			    		  });
					});
				}
			}
			else{
				logger.error("in etGoogleDriveOperations : uploadFile  : error "+ ierr);
			}
		});
		
	}
	catch( error ){
		logger.error("in etGoogleDriveOperations : uploadFile  : error "+ error );
	}	
};

/**
 * : author : AMS
 * : purpose :  to  delete folder from google drive
 * : date : 21 June 2016
 */
googleDrive.prototype.deleteFolder = function( iDeleteFolderObject, iDeleteFolderCB ){
	try{         
		logger.debug("in etGoogleDriveOperations : deleteFolder  : deleteFolder :");
				
		iUserInfo               = iDeleteFolderObject.iUserInfo;
		iSource                 = iDeleteFolderObject.iSource;
		iDestination            = iDeleteFolderObject.iDestination;
		iParam                  = iDeleteFolderObject.iParam;
		
		var _param              = iParam;
		var _srcParams			= _param.SRC_PARAM;
		var _folderId			= _srcParams.folderId;
		var _accountId			= _srcParams.accountId;
		var _accessTokenObj     = null;   
		
		if( typeof _srcParams.accessToken == 'string' ){
			_accessTokenObj = JSON.parse( _srcParams.accessToken );	
		}else{
			_accessTokenObj = _srcParams.accessToken;
		}
		
        var _refreshToken		= _accessTokenObj.refresh_token;
       	
		var _folderIdOnCloud    =null;
		
		if( _srcParams.cldParent == undefined ){
			_folderIdOnCloud = _srcParams.cldFileId;			
		}
		else{
			_folderIdOnCloud = _srcParams.cldParent;			
		}
		
		oauth2Client.refreshToken_( _refreshToken , function( err , result ){
			if(!err && result != undefined ){
				request_Req.del({
					'url'     : 'https://www.googleapis.com/drive/v2/files/'+_folderIdOnCloud+"/",
					'headers' : {  'Authorization': 'Bearer ' + result.access_token }					
					
				}, function( err , res , body ){
					if( !err ){
					  
						var upObj = {
								CON_PARAM   :   { PK  :  "CML_ID", PKVAL :  _folderId,KEY_TYPE:"NDD"},
								RECORD      :   { ACTIVE_STATUS  :  0,SYNC_PENDING_STATUS : 1},
								TN          :   "NODE_DETAILS_DISPLAY"
						};
						var _updateObject                      = {};
						_updateObject.clientInfo               = iDeleteFolderObject.iUserInfo;
						_updateObject.updateObj                = {};
						_updateObject.updateObj.action         = "UPDATE";
						_updateObject.updateObj.dataArray      = [];
						_updateObject.updateObj.dataArray.push( upObj );
    					
    					var _spaceChkObj = {
				 				moduleName : 'GOOGLE_DRIVE',
								url : 'https://www.googleapis.com/drive/v2/about',//user Info,
								token : result.access_token,
								uad : _accountId,
								userInfo : iUserInfo
				 		};
					    
    					if(iDeleteFolderCB)iDeleteFolderCB(_updateObject , _spaceChkObj );
					    dropBoxOperations.convertRequestToStdFormat(_updateObject , function(iConvertedData){
					    	
					    	iConvertedData.extraParam={
					    		subAction    : "DELETE_FOLDER_CV"	
					    	};
					    	if(iDeleteFolderObject.socketId){
					    		iConvertedData.socketId = iDeleteFolderObject.socketId;
					    	}					    	
					    	var _temp = {
					    			
					    			data : iConvertedData
					    	};
					    	common.queueLibs.sendToJavaProcess( _temp , common.appConfigObj.client['mode'] );	
					    	
					    }); 					
					}
				});
			}
		});
	}
	catch( error ){
		logger.error("in etGoogleDriveOperations : deleteFolder  : error "+ error );
	}	
};

/**
 * : author : AMS
 * : purpose :  to  sync Google Drive 
 * : date : 25 June 2016
 */
googleDrive.prototype.syncDrive = function( iSyncDriveObject, iSyncDriveCB ){
	try{
		logger.debug("in etGoogleDriveOperations : syncDrive  :  ");
		
		iParam    	          =  iSyncDriveObject.iParam;
		iUserInfo             =  iSyncDriveObject.iUserInfo;
		
		var _srcParam         = iParam.SRC_PARAM;
		var _accessTokenObj   = _srcParam.accessToken;
		var _userId           = iUserInfo.userId;
		
		
		if(typeof(_accessTokenObj)=='string'){
			_accessTokenObj=JSON.parse(_accessTokenObj);
		}
		else{
				_accessTokenObj=_srcParam.accessToken;
		}
		
		var _refreshToken = _accessTokenObj.refresh_token;
		
		oauth2Client.refreshToken_( _refreshToken , function( err  , result ){
		
			var _accessToken  = result.access_token;
			gDrive( _accessToken ).files().list( { maxResults : '1000' }, function ( err , response , files ){
								
				if( files ) {
					
					var _gFiles = JSON.parse( files );
					
					var _googleFiles = [];
					for( var i = 0 ; i < _gFiles.items.length ; i++ ){
						if(_gFiles.items[i].labels['trashed'] != true){
							_googleFiles.push( _gFiles.items[i] );
						}
					}
					
					dropBoxOperations.convertRequestToStdFormat( _googleFiles , function( iConvertedData ) {
					
						iConvertedData.clientInfo =  { userId   : _userId };
						
						iConvertedData.extraParam = {
								 subAction :  "SYNC_DRIVE_CV",
								 AccountID :  iSyncDriveObject.iParam.SRC_PARAM.accountId,
								 Provider  :  "GOOGLE",
								 Token     :  _accessToken
	                            };				
					
					if( iSyncDriveCB )iSyncDriveCB( null , _googleFiles );
					var _temp = {
									data  :  iConvertedData
					};
					
					common.queueLibs.sendToJavaProcess( _temp , common.appConfigObj.client['mode'] );
					});
				}
				else{
						logger.debug("in etGoogleDriveOperations : syncDrive  : error",err);
				}
			});
			
		});
		
	}
	catch( error ){
		logger.error("in etGoogleDriveOperations : syncDrive  : error "+ error );
	}	
};

/**
 * : author : AMS
 * : purpose :  to  sync Google Drive 
 * : date : 27 June 2016
 * : param : 
 */
googleDrive.prototype.syncDriveCallBack = function( iSyncDriveCallBackObject, iSyncDriveCallBackCB ){
	try{
		logger.debug("in etGoogleDriveOperations :  syncDriveCallBack  :  " );
		var _accessToken        = iSyncDriveCallBackObject.Token;
		var _userId             = iSyncDriveCallBackObject.dataArray[ 0 ].CREATED_BY;
		var _arrayOfNewFiles    = iSyncDriveCallBackObject.dataArray;
		
		for( var i = 0; i < _arrayOfNewFiles.length; i++ ){
			
			var toCalPathArr                 = ( _arrayOfNewFiles[ i ].CML_DESCRIPTION ).split( "/" );
			var _fileNameWithSpecialCharOnFs = toCalPathArr[ toCalPathArr.length - 1 ].replace( /[^a-zA-Z0-9.]/g, "clz" );
			var _fileNameOnFS                = new Date().getTime() + '_' + _fileNameWithSpecialCharOnFs;
			var _cmlPath                     = '/fs/' + _userId + EMAIL_ATTACHMENT_PATH_FROM_USER_FS_PATH + '/' + _fileNameOnFS;
			var _actualPath                  = _cmlPath.split( '/fs/' );
			
			var _newPath                     =  USER_FS_PATH + _actualPath[1];
			var fileP                        = fs.createWriteStream(_newPath);//open write stream
		    var _nddDEscription              = _arrayOfNewFiles[ i ].CML_DESCRIPTION;
		    
		    
		    request_Req.get({
				url : "https://www.googleapis.com/drive/v3/files/"+_nddDEscription+"?alt=media"
			   ,headers :{'Authorization' : 'Bearer ' +_accessToken}
			   }).pipe(fileP);
		
		    
		    var upObj = {
					CON_PARAM  :  { 
									PK       : "CML_ID",
									PKVAL    : _arrayOfNewFiles[ i ].CML_ID ,
									KEY_TYPE : "NDD" 
							      },
					RECORD     :  { 
						            CML_IMAGE_PATH :  _cmlPath, 						           
						           },
					TN         :  "NODE_DETAILS_DISPLAY"
		    };		    
		    
		    var _updateObject                 = {};
			_updateObject.clientInfo          = { userId : _userId };
			_updateObject.updateObj           = {};
			_updateObject.updateObj.action    = "UPDATE";
			_updateObject.updateObj.dataArray = [];
			_updateObject.updateObj.dataArray.push( upObj );
			
			dropBoxOperations.convertRequestToStdFormat( _updateObject , function( iConvertedData ) {
			
				iConvertedData.extraParam = {
													subAction :  "ADD_FOLDER_CV"											
                       				};	
				
				if( iSyncDriveCallBackObject.socketId ){
					iConvertedData.socketId =  iSyncDriveCallBackObject.socketId ;				
				}
				iConvertedData.clientInfo   = { userId : _userId };
				
				var _temp = {
						data : iConvertedData
				};
				
				common.queueLibs.sendToJavaProcess( _temp , common.appConfigObj.client['mode'] );
			});
		}
	}catch(e){
		logger.error( "in etGoogleDriveOperations :  syncDriveCallBack  : Exception catch : ", e );
	}
};

/**
 * : author : MSA
 * : purpose :  to  sync NON clouzer
 * : date : 27 June 2016
 * : param : 
 */

googleDrive.prototype.registerNonClouzer=function(request, reply,iCB){
	try{
		logger.debug("In etrouteHandler2page : registerNonClouzer ");
		_that =this;
		 //  var createObjectStruct=new CreateObjectStruct();
		var code = request.query.code;
		if(code != undefined){
			oauth2Client.getToken(code, function(err, tokens) {
				if(err){
					logger.error("Error in getToken for non clouzer routine ",err);
					return;
				}
				oauth2Client.setCredentials(tokens);	
				//var cSt = new cloudStge.cloudStorage();			
				_newObjRegisterWithGmail = {
					oauth2Client	: oauth2Client
				};
				_that.RegisterWithGmailNewFlow(_newObjRegisterWithGmail,function(iFirstTimeRegister,iAlreadyRegistered){
					logger.info("In call back of RegisterWithGmailNewFlow");
					if(iFirstTimeRegister){
						
						 var user =null;/*= iFirstTimeRegister.user*/;
						 if(iFirstTimeRegister.user && iFirstTimeRegister.user.userId){
										user = iFirstTimeRegister.user;
						  }
						var getObj = {tableName:'LOGIN_MASTER',rowKey: user.userId };
//					    var createObjectStruct=new CreateObjectStruct();
					/*	createObjectStruct.getDataByRowKey(getObj ,function(iError,iOrgData){
							if(iOrgData){
								var dta = iOrgData[0];
								var _obj={};
								if(user && user['profile'] &&   user.userId){
									    user['profile']['userId'] = user.userId;
								}
							    _obj['myInfo']={userId:user.userId,username:user.userId,userEmail:user.userId,userUID:user.id,userName:user.userId,firstName : user.firstName ,lastName: user.lastName, status : user.status , profile_data : user.profile };//set myInfo
								_obj['serverInfo']=clientObj;  // global vars from app.properties
								_obj['myInfo']['firstName'] = dta['USM_EMAIL'];
								_obj['myInfo']['lastName'] = dta['USM_LAST_NAME'];
								_obj['myInfo']['status'] = "1";
								dta['USM_DEFAULT_WORKSPACE']['tn'] = "CAL_MAIL";
								dta['USM_DEFAULT_WORKSPACE']['modifiedBy'] = user.email;
								dta['USM_DEFAULT_WORKSPACE']['createdBy'] = user.email;
								dta['USM_DEFAULT_WORKSPACE']['createdOn'] = ""+new Date().toJSON()+"";
								dta['USM_DEFAULT_WORKSPACE']['lastName'] =dta['USM_LAST_NAME'];
								dta['USM_DEFAULT_WORKSPACE']['modifiedOn'] = ""+new Date().toJSON()+"";
								dta['USM_DEFAULT_WORKSPACE']['syncPendingStatus'] = "0";
								dta['USM_DEFAULT_WORKSPACE']['refId'] = dta['USM_EMAIL']+"#STG";
								dta['USM_DEFAULT_WORKSPACE']['category'] = '25';
								dta['USM_DEFAULT_WORKSPACE']['read'] = '0';
								dta['USM_DEFAULT_WORKSPACE']['keyVal']=dta['USM_DEFAULT_WORKSPACE']['cmlId'],
								dta['USM_DEFAULT_WORKSPACE']['cmlAccepted']='1',
								dta['USM_DEFAULT_WORKSPACE']['userId']=dta['USM_EMAIL'],
								_obj['myInfo']['profile_data'] = dta['USM_DEFAULT_WORKSPACE'];
								_obj['myInfo']['iat']= "1473314832";
							    var cookie_options = {
								      ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today 
								      encoding: 'none',    // we already used JWT to encode 
								      isSecure: true,      // warm & fuzzy feelings 
								      isHttpOnly: true,    // prevent client alteration 
								      clearInvalid: false, // remove invalid cookies 
								      strictHeader: true   // don't allow violations of RFC 6265 
							    };
								var jwttoken = jwt.sign(_obj['myInfo'], common.secretkey ,{ algorithm: 'RS256'});
								_obj['myInfo']['token'] = true;
								_obj['myInfo']['jwttoken'] = jwttoken;
								_obj['myInfo']['globalVars'] = clientObj;
								logger.info("In etRouteHandler2Page : login : login callback , success block ");
								var cookie = require('cookie');
								var setCookie = cookie.serialize('token',jwttoken ,cookie_options);
								var setCookie1 = cookie.serialize('myInfo',JSON.stringify(_obj) ,cookie_options);
								 reply(_obj)
								 .header("Set-Cookie" , setCookie1)
								 .state("token", jwttoken, cookie_options)
								 .redirect("/mstorm")
								 .header("Authorization", jwttoken)  ;
					       }else{
						 	logger.info("some isseee");
						   }
					  });*/
					}else{
					logger.debug("---------He is registered already so go to home page");
					
					reply.redirect('/mstorm');
				}
				});
	  		});	
		}else{
			
			logger.error('Request revoked from non clouzer');
			
		}
	}
	catch(e){
	  logger.error("In  etRouteHandler2Page: googleDriveCallBack : Exception : ",e);
	
	}	
};

googleDrive.prototype.RegisterWithGmailNewFlow= function(iObjNew, iRegisterWithGmailNewFlowCB) {
	try{
		logger.info("In RegisterWithGmailNewFlow");
		_that =this;
		var oauth2Client = iObjNew.oauth2Client;
		
		_that.configureGoogleDriveUsingRegisterWithGmail( oauth2Client, function(iObj,iAlreadyRegisterd){
			if(iObj && iObj.accountObj){
				var user = {'userId':iObj.user.userId,'userUID':iObj.user.userId , 'username':iObj.user.userId ,'id' : iObj.user.userId ,'regisetrWithGmail' : true, 'userEmail' :iObj.user.userId  , status : '1' };
				var _info = {
						user : user,
						oauth2Client : oauth2Client,
						iObj 		: iObj
				}
				if(iRegisterWithGmailNewFlowCB){
					iRegisterWithGmailNewFlowCB(_info,null)
				}
			}else{
				var _useriD = iAlreadyRegisterd.iFirstTimeReg.user[0]['USM_EMAIL'];
				var user = {'userId':_useriD,'userUID':_useriD , 'username':_useriD ,'id' : _useriD ,'regisetrWithGmail' : true , 'userEmail' : _useriD ,  status : '1'};
				var _info = {
						user : user,
						oauth2Client : oauth2Client,
						iObj 		: iObj
				}
				if(iRegisterWithGmailNewFlowCB){
					iRegisterWithGmailNewFlowCB(_info,null);
				}
			}
			
		});
		
	}catch(e){
		logger.error("In etGoogleDriveOperation : Exception catched in RegisterWithGmailNewFlow :"+e);
	}
};

googleDrive.prototype.configureGoogleDriveUsingRegisterWithGmail = function(authClient, iCallback) {
	try{
		logger.info("*******************************In configureGoogleDriveUsingRegisterWithGmail************************* ",authClient);
		logger.info(authClient)
	//	var createObjectStruct=new CreateObjectStruct();
		var DBStore 							   	 = require('./etDbStore');
		var dbStore		= new DBStore.dbStore();
		var _that = this;
		var userUrl = 'https://www.googleapis.com/drive/v2/about'//user Info
			, queryParams = { access_token: authClient.credentials.access_token, alt: 'json' };
		logger.info("In configureGoogleDriveUsingRegisterWithGmail : userUrl :"+userUrl);
		logger.info("In configureGoogleDriveUsingRegisterWithGmail : queryParams :"+queryParams);
			request_Req.get({
				url: userUrl
				, qs: queryParams
				}, function (err, res, body) {
					if(body){
					logger.info("In configureGoogleDriveUsingRegisterWithGmail : body");
					var account = {}, accInfo = JSON.parse(body);//get scc info of google
				    account.uid = accInfo.user.permissionId;//unique id by google to user
				    account.email = accInfo.user.emailAddress;
				    var _accountid=account.uid;
				    logger.info("In configureGoogleDriveUsingRegisterWithGmail : _accountid : ",_accountid);
				    var UAD = {
							'UAD_USER_NAME':accInfo.quotaBytesTotal,
							'UAD_USER_PASSWORD':accInfo.user.emailAddress,
							'UAD_PROVIDER': 'GOOGLE',
							'UAD_ID' :dbStore.rowKeyGenerationOfUAD(account.email,"CloudVault","GOOGLE",_accountid),
							'UAD_EMAIL_ID':account.email,
							'UAD_ACCOUNT_NAME': accInfo.user.displayName,
							'UAD_EASP_ID' : account.uid,
							'LAST_MODIFIED_BY' : account.email,
							'LAST_MODIFIED_ON' : new Date().toJSON(),
							'CREATED_ON' : new Date().toJSON(),
							'CREATED_BY' : account.email,
							"UAD_ACCESS_TOKEN_JSON" : JSON.stringify(authClient.credentials),
							'TN' :'USER_ACCOUNT_DETAILS',
							'KEY_TYPE': 'UAD',
							'ACTIVE_STATUS':'1',
							'UAD_ACCOUNT_TYPE':'CLOUD_VAULT',
							'SYNC_PENDING_STATUS' : '1'
					};
					UAD.KEY_VAL = UAD.UAD_ID;
					logger.info("-----------<<<<<<<<<<<UADUADUADUADUAD"+UAD);
					var _userTempObj={'userId':account.email ,'userUID':accInfo.quotaBytesTotal};
					
					_that.registerThisUserInApp(_userTempObj,function(iFirstTimeReg,iRegistered){
						if(iFirstTimeReg){
							logger.info("-----------First time configure"+iFirstTimeReg);
							var _jsonObject = {};
							_jsonObject.action = "INSERT";
							_jsonObject.userInfo = _userTempObj;
							_jsonObject.dataArray = new Array();
							_jsonObject.dataArray.push(UAD);
							_jsonObject.emitFlg=true;
							/*createObjectStruct.updateHbase(_jsonObject,function(iData){
									
				   	   		});//outer updateServerHDb closed
*/						
							
							var _object = {
									accountObj   :  UAD,
									user		 :_userTempObj,
									iFirstTimeReg : iFirstTimeReg
								    //dbCon        :  iDB
									}
							if(iCallback)iCallback(_object,null);
						}else{
							var _object = {
									iFirstTimeReg : iRegistered
							 		}
							
							if(iCallback)iCallback(null,_object)
						}
						
					});
				   }
				});//err,res,body closed
			
			}catch(e){
				//logger.info("Exception catch in cloudStorage : configureGoogleDrive  :"+e);
		        logger.debug("Exception catch in cloudStorage : configureGoogleDrive  :"+e);
         }
};//configureGoogleDrive closed

googleDrive.prototype.registerThisUserInApp = function(iClientInfo, iRegisterThisUserInAppCB) {
	try{
		 //var createObjectStruct=new CreateObjectStruct();
		  _that =this;
		logger.info("----------In registerThisUserInApp of etGoogleDriveOperation.js");
		logger.info(iClientInfo)
		var user = iClientInfo.userId;
		var _toGetUserObj={ 
				tableName  :'LOGIN_MASTER',
				rowKey     : user };

				var _regUser = {};
				_regUser['firstName']= user;
				_regUser['lastName']="";
				_regUser['userName']= user,
				_regUser['userName']=_regUser['userName'].toLowerCase(),
				_regUser['password']=_regUser['userName'].toLowerCase(),//MSA changes password to email Id ,worked with HRS
				_regUser['status'] = '1';
				_regUser['registerWithGmail'] = true;
				_regUser['nickName'] = _regUser['userName'].toLowerCase();
			/*	createObjectStruct.addUser(_regUser,function(iMessage,isSuccess,iStatusObj){
					var success = {
							'key' : 'Now registering in app',
							'user' : user
					}
					var _objToExecuteScript = _regUser;
					_objToExecuteScript.status = 1;
					createObjectStruct.executeScript(_objToExecuteScript , function(){
						if(iRegisterThisUserInAppCB){
							iRegisterThisUserInAppCB(success,null)
						}
					});
					fileSystem.createUserDir(_regUser.userName);
					if(iRegisterThisUserInAppCB){
						iRegisterThisUserInAppCB(success,null)
					}
				});
			
		});*/
		
	}catch(e){
		logger.error("Exception catched in registerThisUserInApp"+e);
	}
}


exports.googleDrive = googleDrive;