/**
* Author  :RMM 
* Purpose : etBoxOperations file used to perform any operations related with Box Drive
* Date    : 27/05/2016
*/


var request_Req         					 = require('request');
var util                                     = require("util") ;
var fs                                       = require('fs');
var common                                   = require('./common');
var cloudvault                               = require('./msProperties').CloudObj;
var https 	                                 = require('https');
var boxAppId                                 = cloudvault.boxAppId;
var boxsecret                                = cloudvault.boxsecret;
var logger                                   = common.logger;
var userPath                                 = common.EIPS2_USERS_PATH; 
var USER_FS_PATH                             = common.EIPS2_USERS_PATH;
var EMAIL_ATTACHMENT_PATH_FROM_USER_FS_PATH  = '/Drop Box';

var dropBoxOp                                = require('./etDropBoxOperations');
var dropBoxOperations                        = new dropBoxOp.dropDox();


var box= function(){
	return this;
};

box.prototype = {
		constructor  :  box
};


/**
 * @author : RMM 
 * @purpose : to add box drive account
 * @date : 28/5/2016
 * @param : iBoxDeriveAddAccountObject
 */
box.prototype.boxDeriveAddAccount = function( iBoxDeriveAddAccountObject, iBoxDeriveAddAccountCB ){
	try{
		 logger.debug("in etBoxOperations : boxDeriveAddAccount : ");
		
		var _that       = this;	
		var code        = iBoxDeriveAddAccountObject.requestCode;
		var user        = iBoxDeriveAddAccountObject.userId;
		var userUrl     = 'https://www.box.com/api/oauth2/token';
		
		request_Req.post({
						     uri           : userUrl
						   , headers       : { 'content-type' : 'application/x-www-form-urlencoded' }
						   , body          : require('querystring').stringify( { 
							 grant_type    : 'authorization_code', 
							 code          : code, 
							 client_id     : boxAppId,
							 client_secret : boxsecret } )	   
	    }, function ( error, result , body ) {
	    	
		if( !error ){
			var token = JSON.parse( body );
			
			request_Req.get({
							  uri     : 'https://api.box.com/2.0/users/me'
							, headers : { 'Authorization' : 'Bearer ' + token.access_token }
							, qs      : {} 	   
			}, function ( error , result , userInfo ) {
				
				var account          = JSON.parse( userInfo );
				
				var userInfo={
						userEmialId : account.login,
						userId     : user
				};
				
				var _data = { clientInfo:userInfo,
					     token : token,
						  insertObj: 
						   { dataArray: 
						      [ { ACTION_ARRAY:"ADD_CLOUDVAULT_ACCOUNT",
						          CML_PROVIDER:"BOX"
						       } ] },
						  moduleName: 'CloudVault',
						  extraParam: { subAction: 'ADD_ACCOUNT_CV'} 
					};
				
				if(iBoxDeriveAddAccountCB){
					iBoxDeriveAddAccountCB(_data);
				}
				
			});
		}else
			logger.error("in etBoxOperations :boxDeriveAddAccount  : exception " + error );
	 });
	}
	catch( error ){
		logger.error("in etBoxOperations :boxDeriveAddAccount  : exception " + error );
	}	
};

/**
 * @author : RMM 
 * @purpose : to route request of add folder to particular drive
 * @date : 27/05/2016
 * @param : iConfigureBoxObject
 */
box.prototype.configureBox = function( iConfigureBoxObject, iConfigureBoxCB ){
	try{
		 logger.debug("in etBoxOperations : configureBox :");
		var _userObj       = iConfigureBoxObject.user;
		var _account       = iConfigureBoxObject.account;				 
		var _userTempObj   = { 'userId' : _userObj.username, 'userUID' : _userObj.username };
		var _userId        = _userObj.username;
		var _getAllUadKeys = _userId + "#" +'UAD' + ':' + "Settings" + "_" +  "CloudVault_BOX" ;
		var _driveName     = "B";
		var _driveInfo     =  {
						    		totalCapDrive 		: _account.space_amount + '',
						    		allocateCapDrive    : _account.space_used + '',
						    		getAllUadKeys	    : _getAllUadKeys,
						    		driveName		    : _driveName,
						    		userInfo		    : _userTempObj
		};
		if( iConfigureBoxCB ){
			iConfigureBoxCB( _driveInfo );
		}		
	}
	catch( error ){
		logger.error("in etBoxOperations :configureBox  : exception " + error );
	}	
};


/**
 * @author : RMM 
 * @purpose : to read Box account info from third party app
 * @date : 27/05/2016
 * @param : iReadBoxObject
 */
box.prototype.readBox = function( iReadBoxObject , iReadBoxCB ) {
	try{	
		 logger.debug("in etBoxOperations : readBox :"); 
		var folders    = iReadBoxObject.folders;
		var token      = iReadBoxObject.token;
		var AllFolder  = [];
		var item_arr   = [];
		AllFolder.push( folders );
		item_arr       = folders.item_collection.entries;
		if( item_arr.length > 0 ){
			AllFolder  = AllFolder.concat( item_arr );
		}			
		var _exe       =  function( AllFolder, index )
		{
		  var iAccount = AllFolder[ index ];
					
			  if( iAccount.type == 'folder' ){
					request_Req.get({
									  uri     : 'https://api.box.com/2.0/folders/' + iAccount.id
									, headers : { 'Authorization' : 'Bearer ' + token.access_token }
									,  qs     : {} 	   
					}, function (err, res, body) {
						var folder = JSON.parse(body);
						
						if ( folder.item_collection.total_count > 0 ){
							AllFolder = AllFolder.concat( folder.item_collection.entries );
						} 							
					
						if( index++ == ( AllFolder.length - 1 ) ){
							iReadBoxCB( AllFolder );
						}else{
							_exe( AllFolder, index );
						}							
					});
				  }else{
					  if( index++ == ( AllFolder.length - 1 ) ){
							iReadBoxCB( AllFolder );
						}else{
							_exe( AllFolder, index );
						}							
				  }		
		};
		if( AllFolder != undefined && AllFolder.length > 1 ){
			_exe( AllFolder, 1 );	
		}else{
			iReadBoxCB( AllFolder );
		}			
	}catch( error ){
		logger.error("in etBoxOperations :readBox  : exception :" + error );
	}	
}; 


/**
 * @author : RMM 
 * @purpose : to route request of add folder to particular drive
 * @date : 27/05/2016
 * @param :  userObj, folders, token, account, iMailBoxes, mainPrntId, iAccountObj
 */
//box.prototype.readAllBox = function( userObj, folders, token, account, iMailBoxes, mainPrntId, iAccountObj, iCallBack ) {}; 


/**
 * @author : RMM 
 * @purpose : function to  convert Request To standard Format
 * @date : 28/05/2016
 * @param : iConvertObject
 * @Modified on 10/06/2016
 */
box.prototype.convertRequestToStdFormat =function( iConvertObject , iConvertRequestToStdFormatCB ){
	
	 logger.debug("in etBoxOperations : convertRequestToStdFormat :");
	var _convretedObjectIntoStdFormat = {};
	
	if( iConvertObject.insertObj ){
		
		_convretedObjectIntoStdFormat = {
				insertObj  : 	{ action : "INSERT", dataArray  : iConvertObject.insertObj.dataArray },
				moduleName :    iConvertObject.insertObj.dataArray[0].KEY_TYPE,
				clientInfo :    iConvertObject.clientInfo,
			};
	}else if( iConvertObject.updateObj ){
		_convretedObjectIntoStdFormat = {
				updateObj  : 	{ action : "UPDATE", dataArray  : iConvertObject.updateObj.dataArray },
				moduleName :    iConvertObject.updateObj.dataArray[0].CON_PARAM.KEY_TYPE,
				clientInfo :    iConvertObject.clientInfo,
			};
	}else{		
		_convretedObjectIntoStdFormat = {
			insertObj  : 	{ action : "INSERT", dataArray  : iConvertObject },
			moduleName :    "UAD",
			clientInfo :    { userId : "nm" }
		};
	}
	
	if( iConvertRequestToStdFormatCB ){
		iConvertRequestToStdFormatCB( _convretedObjectIntoStdFormat );
	}
};


/**
 * @author : RMM 
 * @purpose : function to  get refresh token
 * @date : 28/05/2016
 * @param : iUserInfo, iObj
 * @Modified on 10/06/2016
 */
box.prototype.refreshAccessToken = function( iUserInfo, iObj, iCallback ){
	try{
		 logger.debug("in etBoxOperations : refreshAccessToken :"); 
		var _accountId   = iObj.accountId;
		var _obj         = {};
		var _rowKey      =_accountId;
		var _toGetUADObj = { tableName : 'GENERAL_INFO', rowKey : _rowKey };
		
	}
	catch(e){
		logger.error("in etBoxOperations : refreshAccessToken "+ e );		
	}
};


/**
 * @author : RMM 
 * @purpose : to route request of add folder to particular drive
 * @date : 27/05/2016
 * @param : iAddFolderObject
 */
//box.prototype.addFolder = function( iAddFolderObject, iAddFolderCB ){};


/**
 * @author : RMM 
 * @purpose : to route request of upload file to particular drive
 * @date : 27/05/2016
 * @param : iUploadFileObject
 */
box.prototype.uploadFile = function( iUploadFileObject, iUploadFileCB ){
	try{
		 logger.debug("in etBoxOperations : uploadFile : iUploadFileObject");
		
		iUserInfo            = iUploadFileObject.iUserInfo;
		iParam               = iUploadFileObject.iParam;	
		var _that            = this;
		var _param           = iParam;
		var _srcParams       = {};
		_srcParams           = _param.SRC_PARAM;		
		var accessToken      = _srcParams.accessToken;
		var _accountId       = _srcParams.accountId;
		var fILE             = userPath + _srcParams.filepath.substring( 4 );	
		if( _srcParams.account )
		
			fs.stat(fILE, function(ierr,istats) {
			var _exists = null;		
			  if( !ierr && istats && istats.isFile() ){				
				  _exists = true;				
				  if( _exists ){
					  var fstatus = fs.statSync(fILE);
					  fs.open(fILE, 'r', function( status, fileDescripter ) {
			    		 if ( status ) {
			    	    	  fileUploadCalBack( status.message );
			    	        return;
			    	      }
			    	      var buffer = new Buffer( fstatus.size );
			      	      fs.read( fileDescripter, buffer, 0, fstatus.size, 0, function( err, num, buffer ) {
			      	    	  var _obj = {};
			      	    	 _obj      = {
				      	    			  accessToken      :  accessToken,
				      	    			  accountId        :  _accountId
			      	    	             };
			      	    	 
			      	    	_that.refreshAccessToken( iUserInfo, _obj, function( iObj ){
			      	    		var _accsTokn     = iObj.accessToken;
			      				var _token        = JSON.parse( _accsTokn ) ;
			      				var _access_token = _token.access_token;
			      				
			      				var r = request_Req.post({ 'url'     : 'https://upload.box.com/api/2.0/files/content',
				      	    		                       'headers' : { 'Authorization': 'Bearer ' + _access_token,
				      	    			                                 'content-type' : false,
				    	  				                                 'process-data' : false,
				    	  			                                    }
				          	     }, function( boxStatus, boxRes, boxFile ){	
				          	    	 if( boxFile.indexOf(":") != -1 ){
				          	    		 
				          	    		 var boxF = JSON.parse(boxFile);
				          	    		 
				          	    		 if(boxF.entries && boxF.entries.length>0){
				          	    			var _updateObj   = {
				          	    					CON_PARAM  :  { PK   :   "CML_ID", PKVAL : _srcParams.folderId,KEY_TYPE : "NDD" },
				          	    					RECORD     :  { CML_DESCRIPTION  :  boxF.entries[0].id,   SYNC_PENDING_STATUS :   "1" },
				          	    					TN         :  "NODE_DETAILS_DISPLAY"
							          	     };
				          	    			var _spaceChkObj = {
				        			 				moduleName : 'BOX_DRIVE',
				        							url        : 'https://api.box.com/2.0/users/me',
				        							token      : _accsTokn.access_token,
				        							uad        : _accountId,
				        							userInfo   : iUserInfo
				        					};
							          	    if( iUploadFileCB )iUploadFileCB( boxF.entries[0].id, _spaceChkObj );
							          	    var _updateObject                 = {};
					    					_updateObject.clientInfo          = iUploadFileObject.iUserInfo;
					    					_updateObject.updateObj           = {};
					    					_updateObject.updateObj.action    = "UPDATE";
					    					_updateObject.updateObj.dataArray = [];
					    					_updateObject.updateObj.dataArray.push( _updateObj );
							          	 								          	 		
							          	 		dropBoxOperations.convertRequestToStdFormat( _updateObject , function( iConvertedData ){
							          	 			
							          	 			iConvertedData.extraParam = {
															subAction :  "UPLOAD_FILE_CV"
													};
							          	 			
													if( iUploadFileObject.socketId ){
														iConvertedData.socketId =  iUploadFileObject.socketId ;				
													}
													
													var _sendToJavaSyncCB = {
															data : iConvertedData
													};							
													common.queueLibs.sendToJavaProcess( _sendToJavaSyncCB , common.appConfigObj.client['mode'] );			
												});
				          	    		 }
				          	    	 }
				          	    	 else{				          	    		
						          	    	if( iUploadFileCB )iUploadFileCB();
				          	    	 }
				          	     });
				      	    	var form = r.form();
				      	    	form.append( 'filename', buffer, { filename : _srcParams.folderName } );
				      	    	form.append( 'parent_id', _srcParams.cldParent );
			      	    	});
			      	      });
			    	  });
				  	}else{				  		
				  		logger.error( "in etBoxOperations :uploadFile : exception : The file path does not exist " );
				  		if( iUploadFileCB )iUploadFileCB();
				  	}	
				  }		
		});		
	}
	catch( error ){
		logger.error( "in etBoxOperations :uploadFile  : exception " + error );
	}	
};



/**
 * @author : RMM 
 * @purpose : to route request of delete file to particular drive
 * @date : 27/05/2016
 * @param : iDeleteFileObject
 */
box.prototype.deleteFile = function( iDeleteFileObject, iDeleteFileCB ){
	try{
		 logger.debug("in etBoxOperations : deleteFile :");		 
		iUserInfo            = iDeleteFileObject.iUserInfo;
		iParam               = iDeleteFileObject.iParam;
		var _that            = this;
		var _param           = iParam;
		var sourceParams     = _param.SRC_PARAM;
		var accessToken      = sourceParams.accessToken;		
		var _accountId       = sourceParams.account[0].CML_PARENT_ID;
		var _obj = {
	  			accessToken       :  accessToken,	  			
	  			accountId         :  _accountId
	  	 };		
		_that.refreshAccessToken( iUserInfo, _obj, function( iObj ) {
			var _accsTokn         = iObj.accessToken;
				var _token        = JSON.parse( _accsTokn ) ;
				var _access_token = _token.access_token;
	  		request_Req.del( {'url'     : 'https://api.box.com/2.0/files/' + sourceParams.cldParent,
	  			              'headers' : {
				  							'Authorization': 'Bearer ' + _access_token,
				  							'content-type' : false,
					    	  				'process-data' : false
	  						               }
	  	  }, function( delStatus, delRes, delBody ){	  		  
	  		  if( !delStatus && delBody.indexOf(":") ==-1 ){
	  			  var _obj = {
		  					  CON_PARAM  :  {
					  						  PK              : "CML_ID",
					  						  PKVAL           : sourceParams.folderId,
					  						  KEY_TYPE        : "NDD"
		  					                },
		  					  RECORD     :  {
		  						              ACTIVE_STATUS   :  0
		  					                },						  
		  					  TN         : "NODE_DETAILS_DISPLAY"						  
	  			  };
	  			var _updateObject                 = {};
				_updateObject.clientInfo          = iDeleteFileObject.iUserInfo;
				_updateObject.updateObj           = {};
				_updateObject.updateObj.action    = "UPDATE";
				_updateObject.updateObj.dataArray = [];
				_updateObject.updateObj.dataArray.push( _obj );
          	 								          	 		
          	 		dropBoxOperations.convertRequestToStdFormat( _updateObject , function( iConvertedData ){
          	 			
          	 			iConvertedData.extraParam = {
								subAction :  "DELETE_FOLDER_CV"
						};
						
          	 			if( iDeleteFileObject.socketId ){
							iConvertedData.socketId =  iDeleteFileObject.socketId ;				
						}
          	 			
						var _sendToJavaSyncCB = {
								data : iConvertedData
						};							
						common.queueLibs.sendToJavaProcess( _sendToJavaSyncCB , common.appConfigObj.client['mode'] );			
					});
	  			
	  			var _spaceChkObj = {
					 				moduleName : 'BOX_DRIVE',
									url        : 'https://api.box.com/2.0/users/me',
									token      :  _accsTokn.access_token,
									uad        : _accountId,
									userInfo   : iUserInfo
	            };
	  			
		        if( iDeleteFileCB )iDeleteFileCB( _updateObject,_spaceChkObj );		
	  		  }else{
	  			  logger.error("in etBoxOperations : deleteFile  : delStatus : " + delStatus );
	  			 
	  			  if( iDeleteFileCB )iDeleteFileCB();
	  		  }
	  	  });
		});	
		
	}
	catch( error ){
		logger.error("in etBoxOperations :deleteFile  : exception " + error );
	}	
};


/**
 * @author : RMM 
 * @purpose : to route request of delete file to particular drive
 * @date : 27/05/2016
 * @param : iDeleteAccountObject
 */
box.prototype.deleteAccount = function( iDeleteAccountObject, iDeleteAccountCB ){
	try{
		 logger.debug("in etBoxOperations : deleteAccount :");	
	}
	catch( error ){
		logger.error("in etBoxOperations :deleteAccount  : exception " + error );
	}	
};


/**
 * @author : RMM 
 * @purpose : to route request of delete folder to particular drive
 * @date : 27/05/2016
 * @param : iDeleteFolderObject
 */
box.prototype.deleteFolder = function( iDeleteFolderObject, iDeleteFolderCB ){
	try{
		 logger.debug("in etBoxOperations : deleteFolder :");	
		var _that = this;
		if( iDeleteFolderObject.iParam && iDeleteFolderObject.iParam.SRC_PARAM && iDeleteFolderObject.iParam.SRC_PARAM.folderId ){
			
			var _toGetUADObj = { tableName : 'CAL_MAIL' , rowKey : iDeleteFolderObject.iParam.SRC_PARAM.folderId };
			
		}else{
			logger.error( "in etBoxOperations :deleteFolder  : folder id was not found "  );
			if( iDeleteFolderCB )iDeleteFolderCB();
		}		
	}
	catch( error ){
		logger.error("in etBoxOperations :deleteFolder  : exception " + error );
	}	
};


/**
 * @author : RMM 
 * @purpose : to route request of rename folder to particular drive
 * @date : 27/05/2016
 * @param : iRenameFolderObject
 */
box.prototype.renameFolder = function( iRenameFolderObject, iRenameFolderCB ){
	try{
		 logger.debug("in etBoxOperations : renameFolder :");	
		
		iUserInfo            = iRenameFolderObject.iUserInfo;
		iParam               = iRenameFolderObject.iParam;
		var _that            = this;		
		
		var _param           = iParam;
		var _srcParams       = _param.SRC_PARAM;
		var folderIdOnBox    = _srcParams.cldParent || _srcParams.cldFileId;
		var accessToken      = JSON.parse( _srcParams.accessToken );
		var _accessTokenTime = _srcParams.accessTokenTime;
		var _accountId       = _srcParams.accountId;
		var fldId            = _srcParams.folderId || _srcParams.fileId;
		var _folderName      = _srcParams.folderName;
		var _bodyObj         = JSON.stringify( { name   :  _folderName } );
		
		var _obj             = {
					  			accessToken      :  accessToken,
					  			accessTokenTime  :  _accessTokenTime,
					  			accountId        :  _accountId
	  	 };
		_that.refreshAccessToken( iUserInfo,_obj, function( iObj ){
			var _accsTokn     = iObj.accessToken;
			var _token        = JSON.parse( _accsTokn ) ;
			var _access_token = _token.access_token;
			var uri           = "https://api.box.com/2.0/folders/"+ folderIdOnBox;			
    		request_Req.put( {
			    			  'url'     : uri ,
			    			  'headers' : {
			    				           'Authorization': 'Bearer ' + _access_token,
			    			               'content-type' : 'application/x-www-form-urlencoded',
    			                          },
    			              'body'    : _bodyObj	
    		}, function(err, renRes, renBody){
    			
    			if( !err && renBody.indexOf( ":" ) != -1 ){
    				var upObj = {
	    						 CON_PARAM  :  { PK  : "CML_ID", PKVAL  :  fldId  , KEY_TYPE:"NDD" },
	    						 RECORD     :  { CML_NAME   :  _folderName, SYNC_PENDING_STATUS   :  '1' },
	    						 TN         :  "NODE_DETAILS_DISPLAY"
    				};
    				
    				var _updateObject                 = {};
					_updateObject.clientInfo          = iRenameFolderObject.iUserInfo;
					_updateObject.updateObj           = {};
					_updateObject.updateObj.action    = "UPDATE";
					_updateObject.updateObj.dataArray = [];
					_updateObject.updateObj.dataArray.push( upObj );				
					
					dropBoxOperations.convertRequestToStdFormat( _updateObject , function( iConvertedData ){
						 
						iConvertedData.extraParam = {
								subAction :  "RENAME_FOLDER_CV"
						};
						
						if( iRenameFolderObject.socketId ){
							iConvertedData.socketId =  iRenameFolderObject.socketId ;				
						}
						
						var _sendToJavaSyncCB = {
								data : iConvertedData
						};						 
						common.queueLibs.sendToJavaProcess( _sendToJavaSyncCB , common.appConfigObj.client['mode'] );			
					});
		    }
    		else{
    			logger.error(" in etBoxOperations :renameFolder  : request" + err );
    			if( iRenameFolderCB )iRenameFolderCB();
    		}		
    	  });
		});	
	}
	catch( error ){
		logger.error("in etBoxOperations :renameFolder  : exception " + error );
	}	
};


/**
 * @author : RMM 
 * @purpose : to route request of sync Drive to particular drive
 * @date : 27/05/2016
 * @param : iSyncDriveObject
 * @Modifid : 22/06/2016
 */
box.prototype.syncDrive = function( iSyncDriveObject, iSyncDriveCB ){
	
	 logger.debug("in etBoxOperations : syncDrive : ");
	try{
		var _that            = this;	
		var iUserInfo        = iSyncDriveObject.iUserInfo;
		var iParam           = iSyncDriveObject.iParam;				
		
		var _param           = iParam;
		var _srcParams       = _param.SRC_PARAM;
		var accessToken      = _srcParams.accessToken;
		var _accountId       = _srcParams.accountId;
		var _obj             = {
					  			accessToken      :  accessToken,		  			 
					  			accountId        :  _accountId
	  	                       };
		
		_that.refreshAccessToken( iUserInfo,  _obj, function( iObj ){
			if(iObj){
				var _accsTokn     = iObj.accessToken;
				var _token        = JSON.parse( _accsTokn ) ;
				var _access_token = _token.access_token;
				
	    		request_Req.get({
				    			  uri     : 'https://api.box.com/2.0/folders/0'
								, headers : { 'Authorization': 'Bearer ' + _access_token }
								,  qs     : {} 
	    		}, function( err, res, body ){
	    			if(body){
						var folders = JSON.parse( body );
						var _folderAndTokenObject = {
								                      folders : folders,
									                  token : _access_token,
						};
						
						_that.getAllFilesAndFoldersOnBox( _folderAndTokenObject, function( allFolders ){
							var _folderObject = {  folders : allFolders, access_token : _access_token   };
							_that.fetchAllFilesFromBox( _folderObject ,function( iArrMailBox ){
								dropBoxOperations.convertRequestToStdFormat( iArrMailBox , function( iConvertedData ){
									iConvertedData.extraParam = {
																 subAction :  "SYNC_DRIVE_CV",
																 AccountID :  iSyncDriveObject.iParam.SRC_PARAM.accountId,
																 Provider  :  "BOX",
																 Token     :  _access_token
									};	
									if( iSyncDriveObject.socketId ){
										iConvertedData.socketId =  iSyncDriveObject.socketId ;				
									}
									iConvertedData.clientInfo = { userId   : iSyncDriveObject.iUserInfo.userId };
									var _sendToJavaSyncCB = {
											     data : iConvertedData
									};
									common.queueLibs.sendToJavaProcess( _sendToJavaSyncCB , common.appConfigObj.client['mode'] );			
								});					
								
								var _spaceChkObj = {
									 				moduleName : 'BOX_DRIVE',
													url        : 'https://api.box.com/2.0/users/me',
													token      : _accsTokn.access_token,
													uad        : _accountId,
													userInfo   : iUserInfo
								};
								
								if( iSyncDriveCB )iSyncDriveCB( null, _spaceChkObj );
							});						
						} );						
					}else{
						logger.error("in etBoxOperations :syncDrive  : error : Request revoked from box.ne t" );							
					}
	    		});
			}
		});	
	}
	catch( error ){
		logger.error("in etBoxOperations :syncDrive  : exception "  + error );
	}	
};


/**
 * @author : RMM 
 * @purpose : to get all parent and child files and folders of box drive 
 * @date : 25/06/2016
 * @param : iGetAllFilesAndFoldersObject
 */
box.prototype.getAllFilesAndFoldersOnBox = function( iGetAllFilesAndFoldersObject, iGetAllFilesAndFoldersCB ){
	
	 logger.debug("in etBoxOperations : getAllFilesAndFoldersOnBox  :");
	try{
		var folders   = iGetAllFilesAndFoldersObject.folders;
		var token     = iGetAllFilesAndFoldersObject.token;		
		var allFolder = new Array(), item_arr = new Array();
		
		item_arr      = folders.item_collection.entries;
		allFolder.push(folders);		
		
		if( item_arr.length > 0 ){
			allFolder = allFolder.concat( item_arr );
		}			

		var _exe =  function( allFolder, index )
		{
			var iAccount = allFolder[ index ];
		
			  if( iAccount.type == 'folder' ){
					request_Req.get({
						              uri     : 'https://api.box.com/2.0/folders/' + iAccount.id
						            , headers : {
						            	          'Authorization': 'Bearer ' + token 
						            	        }
						           ,  qs      : {}  
					}, function ( err, res, body ) {
						
						var folder = JSON.parse( body );
						if ( folder.item_collection.total_count > 0 ){
							allFolder = allFolder.concat( folder.item_collection.entries );
						} 					
							
						if( index++ == ( allFolder.length - 1 ) ){
							iGetAllFilesAndFoldersCB( allFolder );
						}else
							_exe( allFolder, index );
					});
				  }else{
					  if( index++ == ( allFolder.length - 1 ) ){
						  iGetAllFilesAndFoldersCB( allFolder );
					  }else
						_exe( allFolder, index );
				  }		
		};
		if( allFolder != undefined && allFolder.length > 1 )
			_exe(allFolder, 1);	
		else
			iGetAllFilesAndFoldersCB( allFolder );
	}
	catch( error ){
		logger.error("in etBoxOperations :  getAllFilesAndFoldersOnBox  : Exception catch : ", error );
	}
};


/**
 * @author : RMM 
 * @purpose : to fetch all files and folders while sync 
 * @date : 23/06/2016
 * @param : iFoldersObj
 */
box.prototype.fetchAllFilesFromBox = function( iFoldersObj, iFetchAllFilesFromBoxCB ){
	try{
		 logger.debug("in etBoxOperations : fetchAllFilesFromBox :");
		var _folders = iFoldersObj.folders , _arrMailBox = [];
		var _token   = iFoldersObj.access_token;
		
		var _exeFoldersWise = function( iFolders,iInd ){
			var _eachFolder = iFolders[iInd];
			var item = iFolders[iInd];
			if(item.type == 'folder'){
				type = 'F';
				url = 'https://api.box.com/2.0/folders/'+_eachFolder.id;
			}else{
				type = 'C';
				url = 'https://api.box.com/2.0/files/'+_eachFolder.id;
			}
			
			request_Req.get({
							 uri     : url,
							 headers : { 'Authorization': 'Bearer ' + _token },
							 qs      : {}
				}, function ( err, res, body ) {
					if(body){
						 logger.debug("in etBoxOperations : fetchAllFilesFromBox : 3rd party cb" );
						var _mailBox = JSON.parse(body);
						_arrMailBox.push(_mailBox);
						
						iInd++;
						if(iInd < iFolders.length){
							_exeFoldersWise(iFolders,iInd);
						}else{
							if(iFetchAllFilesFromBoxCB){
								iFetchAllFilesFromBoxCB(_arrMailBox);
							}
						}
					}else{
						 logger.debug("in etBoxOperations :  fetchAllFilesFromBox  : Not getting res for that folder");
						iInd++;
						if(iInd < iFolders.length){
							_exeFoldersWise(iFolders,iInd);
						}else{
							if(iFetchAllFilesFromBoxCB){
								iFetchAllFilesFromBoxCB( _arrMailBox );
							}
						}
					}
					
			});
		};
		if(_folders && _folders.length > 0){
			_exeFoldersWise( _folders,0 );
		}
	}catch(e){
		logger.error("in etBoxOperations :  fetchAllFilesFromBox  : exception ",e);
	}
};

/**
 * @author : RMM 
 * @purpose : to get data form Java sync Drive function and download the files 
 * @date : 23/06/2016
 * @param : iSyncDriveObject
 */
box.prototype.syncDriveCallBack = function( iSyncDriveObject , iSyncDriveCB ){
	try{
		 logger.debug("in etBoxOperations :  syncDriveCallBack :");
		var _that = this;
		
		var _userId          = iSyncDriveObject.dataArray[ 0 ].CREATED_BY;
		var _arrayOfNewFiles = iSyncDriveObject.dataArray;
		var _accessToken     = iSyncDriveObject.Token;
		
		if( _arrayOfNewFiles.length > 0 ){
			for( var i = 0; i < _arrayOfNewFiles.length; i++ ){
				
				var toCalPathArr                 = ( _arrayOfNewFiles[ i ].CML_DESCRIPTION ).split( "/" );
				var _fileNameWithSpecialCharOnFs = toCalPathArr[ toCalPathArr.length - 1 ].replace( /[^a-zA-Z0-9.]/g, "clz" );
				
				var _fileNameOnFS                = new Date().getTime() + '_' + _fileNameWithSpecialCharOnFs;
				
				var _cmlPath                     = '/fs/' + _userId + EMAIL_ATTACHMENT_PATH_FROM_USER_FS_PATH + '/' + _fileNameOnFS;
				var _actualPath                  = _cmlPath.split( '/fs/' );
				
			    var _newPath                     =  USER_FS_PATH + _actualPath[1];
			   
			    var fileP                        = fs.createWriteStream(_newPath);//open write stream
			    var _nddDEscription              = _arrayOfNewFiles[ i ].CML_DESCRIPTION;
			  
			    request_Req.get( {
			    	               uri     : 'https://api.box.com/2.0/files/' + _nddDEscription,
			    	               headers : {
			    	            	           authorization : 'Bearer ' + _accessToken, 
			    	            	         },
			    				  qs       : {} 
			                     }).pipe( fileP ); 
			    
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
			    
			    _that.convertRequestToStdFormat( _updateObject , function( iConvertedData ){
					 
					iConvertedData.extraParam = {
												 subAction :  "UPDATE_SYNC_DRIVE_CV"											
					                            };	
					
					if( iSyncDriveObject.socketId ){
						iConvertedData.socketId =  iSyncDriveObject.socketId ;				
					}
					iConvertedData.clientInfo   = { userId : _userId };
					
					var _sendToJavaSyncCB = {
							data : iConvertedData
					};
					common.queueLibs.sendToJavaProcess( _sendToJavaSyncCB , common.appConfigObj.client['mode'] );			
				});
			}
		}
				
	}catch( error ){
		logger.error("in etDropBoxOperations :  syncDriveCallBack  : Exception catch : ", error );
	}
};


/**
 * @author : RMM 
 * @purpose : to route request of sync Drive to particular drive
 * @date : 27/05/2016
 * @param : iShareContactObject
 */
box.prototype.shareContact = function( iShareContactObject, iShareContactCB ){
	try{
		 logger.debug("in etBoxOperations : shareContact :");	
	}
	catch( error ){
		logger.error("in etBoxOperations :shareContact  : exception " + error );
	}	
};


exports.box = box;