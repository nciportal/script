/**
* Author  :RMM 
* Purpose : etDropBoxOperations file used to perform any operations related with Drop Box Drive
* Date    : 27/05/2016
*/

// Required files and modules - 
'use strict';
const common = require('./common');
const logger=common.logger;
const cloudvault = require('./msProperties').CloudObj;
const hostName  = cloudvault.hostNamecloud;
const request_Req = require('request');
const fs  = require('fs');
const USER_FS_PATH  = common.EIPS2_USERS_PATH;
const EMAIL_ATTACHMENT_PATH_FROM_USER_FS_PATH  = '/Drop Box';
const userPath  = common.EIPS2_USERS_PATH; 

class dropDox{
	constructor(){}
	/**
	 * @author : RMM 
	 * @purpose : function to  convert Request To standard Format
	 * @date : 28/05/2016
	 * @Modified on : 10/06/2016
	 * @param : iConvertObject
	 */
	convertRequestToStdFormat( iConvertObject , iConvertRequestToStdFormatCB ){
		try{
			logger.info("In etDropBoxOperations : convertRequestToStdFormat : ");
			let _convretedObjectIntoStdFormat = {};
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
		}catch( error ){
			logger.error("In etCloudvaultActionCreator : convertRequestToStdFormat : exception : "+ error );
		}	
	}
	

	/**
	 * @author : RMM 
	 * @purpose : to get sub action for send to java process
	 * @date : 10/06/2016
	 * @param : iGetSubActionObject
	 */
	getSubActionFromOnject( iGetSubActionObject){
		try{
			 logger.info("In etDropBoxOperations : getSubActionFromOnject : "); 
	        switch(  iGetSubActionObject.extraParam.subAction ){
				case "moveFile" :             		
					return  "MOVE_FILE_CV";  
					
				case "copyFile" :         				
					return "COPY_FILE_CV";
					
				case "uploadFile" :          				
					return "UPLOAD_FILE_CV";
					
				case "deleteFile" :               		
					return "DELETE_FILE_CV";
					
				case "moveFolder" :           		
					return "MOVE_FOLDER_CV";
				
				case "deleteAccount" :          					
					return "DELETE_ACCOUNT_CV";
				
				case "copyFolder" :          	
					return "COPY_FOLDER_CV";
					
				case "addFolder" :         			
					return "ADD_FOLDER_CV";
					
				case "deleteFolder" :           			
					return "DELETE_FOLDER_CV";
					
				case "renameFolder" :           			
					return "RENAME_FOLDER_CV";
				
				case "renameFile" :          			
					return "RENAME_FILE_CV";
					
				default:
				    logger.info('In etDropBoxOperations : getSubActionFromOnject : default case ');	
					break;		    
		 }		 
		}catch( error ){
			logger.error("In etCloudvaultActionCreator : getSubActionFromOnject : exception : "+ error );
		}	
	}
	
	/**
	 * @author : RMM 
	 * @purpose :  to get data from third party for adding new drop box account
	 * @date : 28/05/2016
	 * @param : iDropBoxAddAccountObject
	 */
	dropBoxAddAccount( iDropBoxAddAccountObject , iDropBoxAddAccountObjectCB ){
		 logger.info("In etDropBoxOperations : dropBoxAddAccount : ");
		try{
			let _that                = this;
			const code =iDropBoxAddAccountObject.requestCode;
			const _user =  iDropBoxAddAccountObject.userId;
			
			request_Req.post({
				
				'url': "https://api.dropbox.com/1/oauth2/token?code=" + code
				     + "&grant_type=authorization_code&client_id="    + cloudvault.dropapp_key + "&client_secret="
				     + cloudvault.dropapp_secret + "&redirect_uri="   + hostName + "/dropBoxCallBack"
			},( error ,result , body )=>{
				logger.info("In etCloudvaultActionCreator : dropBoxAddAccount  : 3rd party cb");	
				if( body ){
					
					const _returnDataFromThirdParty  = JSON.parse( body );
					const _access_token              = _returnDataFromThirdParty.access_token;	
					
					const _configureDropBoxObject = {
													userInfo   : _user,
													accesToken : _access_token
					};
					_that.configureDropBox( _configureDropBoxObject ,( iDriveInfo)=>{				 
						if( iDriveInfo ){	
							
							const userInfo={
									userEmialId:iDriveInfo.accountInfo.email,
									userId:_user
							};
							
							const _data = { clientInfo:userInfo,
							     token : _returnDataFromThirdParty,
								  insertObj: 
								   { dataArray: 
								      [ { ACTION_ARRAY:"ADD_CLOUDVAULT_ACCOUNT",
								          CML_PROVIDER:"DROPBOX"
								       } ] },
								  moduleName: 'CloudVault',
								  extraParam: { subAction: 'ADD_ACCOUNT_CV'} 
							};
							
							if(iDropBoxAddAccountObjectCB){
								iDropBoxAddAccountObjectCB(_data);
							}
						}				 		
			 		});						
				}					
			});	
		}catch( error ){
			 logger.error("In etDropBoxOperations : dropBoxAddAccount : exception ", error );
		}	
	}
	
	/**
	 * @author : RMM 
	 * @purpose : to route request of add folder to particular drive
	 * @date : 27/05/2016
	 * @param : iAddFolderObject
	 */
	addFolder( iAddFolderObject, iAddFolderCB ){
		try{	
			logger.info("In etDropBoxOperations : addFolder : ");
			let _that                = this;
			let iUserInfo                = iAddFolderObject.iUserInfo;
			let iParam                   = iAddFolderObject.iParam;
			let _param               = iParam;
			const _srcParams           = _param.SRC_PARAM ;
			const _accountId           = _srcParams.accountId;
			const _folderPathOnDropbox = _srcParams.cldParent;
			const _folderName          = _srcParams.folderName;
			const _accessToken         = _srcParams.accessToken;		
			let _folderpath          = null;
			
			// Initial updation of redux state for add folder 
			let addDropBoxFolder = {
					  type        : "ADD_FOLDER_CV",
					  userId      : iUserInfo.userId,
					  accountName : "DROPBOX",
		    };
			// call dispatch of redux form common
			common.reduxBackendStore.dispatch( addDropBoxFolder );
			if( _srcParams.account ){
				if( _srcParams.flag && _srcParams.flag === true ){
					 _folderpath = _folderPathOnDropbox;
				}else{
					 _folderpath = _folderPathOnDropbox + "/" + _folderName;
				}
			}
			request_Req.post( {
				               'url'    : "https://api.dropbox.com/1/fileops/create_folder?root=dropbox&path=" + _folderpath,
				                headers : {  
							               'Authorization': 'Bearer ' + _accessToken
					                      },
				
			},( error ,addFolderResult, addedFolderBody )=>{
				 
				if( addedFolderBody ){
					// Updation of redux state for after add folder on provider
					const _addFolderOnThirdParty = {
							  type                : "ADD_FOLDER_ON_PROVIDER",
							  added_on_thirdParty : true
		                    };
					// call dispatch of redux form common
					common.reduxBackendStore.dispatch( _addFolderOnThirdParty );
					
					logger.info("In etDropBoxOperations : addFolder : 3rd party cb " );
					
					const _addedFolderNewData = JSON.parse( addedFolderBody );
					if( _addedFolderNewData && _addedFolderNewData.is_dir === true ){					
						
			  			const _addedFolderReturnObject = {
			  					CON_PARAM    :  {
							  						PK       :  "CML_ID",
							  						PKVAL    :  _srcParams.folderId,
							  						KEY_TYPE : "NDD"
			  					},
			  					RECORD       :  {
							  						SYNC_PENDING_STATUS      :  '1',
							  						CML_DESCRIPTION          : _addedFolderNewData.path	
			  						
			  					},
			  					TN           :  "NODE_DETAILS_DISPLAY"						  
			  			  };
			  			
			  			let _updateObject                 = {};
						_updateObject.clientInfo          = iAddFolderObject.iUserInfo;
						_updateObject.updateObj           = {};
						_updateObject.updateObj.action    = "UPDATE";
						_updateObject.updateObj.dataArray = [];
						_updateObject.updateObj.dataArray.push( _addedFolderReturnObject );			  			
			  			
			  			const _spaceCheckObject = {
								 				 moduleName  : 'DROPBOX',
												 url         : 'https://api.dropbox.com/1/account/info',
												 token       : _accessToken,
												 uad         : _accountId,
												 userInfo    : iUserInfo
						                        };		  			
			  									
				  			_that.convertRequestToStdFormat( _updateObject ,( iConvertedData )=>{
							 
								iConvertedData.extraParam = {
										subAction :  "ADD_FOLDER_CV"
								};
								if( iAddFolderObject.socketId ){
									iConvertedData.socketId =  iAddFolderObject.socketId ;				
								}
								const _dataSendToJavaFun = {
										data : iConvertedData
								};
														
								// Updation of redux state while update of add folder In hbase
								const _addFolderOnThirdParty = {
										  type                    : "ADD_FOLDER_UPDATE_HBASE",
										  add_folder_update_hbase : true
					                    };
								// call dispatch of redux form common
								common.reduxBackendStore.dispatch( _addFolderOnThirdParty );
								
								common.queueLibs.sendToJavaProcess( _dataSendToJavaFun , common.appConfigObj.client['mode'] );			
							});
							
							if( iAddFolderCB ){
			  					iAddFolderCB( _addedFolderNewData.path , _spaceCheckObject );
			  				}									
					}else{
						if(iAddFolderCB)iAddFolderCB();
				  }
				}else{
					logger.error("In etDropBoxOperations : addFolder  :exception : " + error );
				}
			});	
		}
		catch( error ){
			logger.error("In etDropBoxOperations : addFolder : exception : " + error );
		}	
	}

	/**
	 * @author : RMM 
	 * @purpose : to route request of rename file to particular drive
	 * @date : 27/05/2016
	 * @param : iRenameFileObject
	 */
	renameFile( iRenameFileObject, iRenameFileCB ){
		try{
			let _that = this;	
			 logger.info("In etDropBoxOperations : renameFile : ");
			_that.renameFolder( iRenameFileObject , iRenameFileCB );
		}
		catch( error ){
			logger.error("In etDropBoxOperations : renameFile : exception : " + error );
		}	
	}
	

	/**
	 * @autho : RMM 
	 * @purpose : to route request of move file to particular drive
	 * @date : 27/05/2016
	 * @param : iMoveFileObject
	 */
	moveFile( iMoveFileObject, iMoveFileCB ){
		try{
			
			 logger.info("In etDropBoxOperations : moveFile : ");
			let _that                = this;
			let iUserInfo            = iMoveFileObject.iUserInfo;
			let iParam               = iMoveFileObject.iParam;				
			let _param               = iParam;
			let _srcParams           = _param.SRC_PARAM;
			let _accountId           = _srcParams.accountId;
			let accessToken          = _srcParams.accessToken;
			let _file                = userPath + _srcParams.filepath.substring( 4 );
			
			// Initial updation of redux state for upload file 
			const uploadFile = {
					  type        : "UPLOAD_FILE_CV",
					  userId      : iUserInfo.userId,
					  accountName : "DROPBOX",
		    };
			// call dispatch of redux form common
			common.reduxBackendStore.dispatch( uploadFile );
			
			
			   fs.stat( _file,( ierr,istats )=>{
			    let _exists = null;
				  if( !ierr && istats && istats.isFile() ){
					  _exists = true; 
					  if( _exists ){
						   const fstatus = fs.statSync( _file );
						  fs.open( _file, 'r',( status, fileDescripter )=>{
							  
				    		/*   if ( status ) {
				    	    	  fileUploadCalBack( status.message );			    	    	  
				    	          return;
				    	      }*/
				    	      const buffer = new Buffer( fstatus.size );
				    	      
				    	      fs.read( fileDescripter, buffer, 0, fstatus.size, 0,( err, num ,content )=> {
				      	    	   
				      	    	    let _path;
				      	    	    
				      	    		if( _param.OPERATION !== "uploadFile" ){
				      	    			_path =_srcParams.cldParent + '/' + _srcParams.folderName;			      	    			 
				      	    		}else{
				      	    			if( _srcParams.flag && _srcParams.flag === true){
				      	    				_path = _srcParams.cldParent;
				      	    			}else{
				      	    				_path = _srcParams.cldParent + '/' + _srcParams.folderName;
				      	    			}
				      	    		}
				      	    		request_Req.post({
				      	    			              'url'     : "https://api-content.dropbox.com/1/files_put/auto/" + _path + "?param=val",
				      	    			              'headers' : {  
				      	    						               'Authorization' : 'Bearer ' + accessToken
				      	    				                      },
				      	    			              body      : content
				      	    			
				      	    		},( err ,foldRes, foldBody )=>{
				      	    			
				      	    			if( foldBody ){
				      	    				
				      	    			   // Updation of redux state for after upload file on provider
				      	    			let _uploadFileOnThirdParty = {
				      	    						  type                   : "UPLOAD_FIEL_ON_PROVIDER",
				      	    						  uploaded_on_thirdParty : true
				      	    		                };
				      	    				// call dispatch of redux form common
				      	    				common.reduxBackendStore.dispatch( _uploadFileOnThirdParty );
				      	    				
				      	    				 logger.info("In etDropBoxOperations : moveFile : 3rd party cb " );
				      	    				 const _filenewData = JSON.parse( foldBody );

						      		    	if( _filenewData.path ){
						      		    		 const  _updateObj = {
											          	    	   CON_PARAM  :  {
											          	    		               PK       : "CML_ID", 
											          	    		               PKVAL    : _srcParams.folderId , 
											          	    		               KEY_TYPE : "NDD" 
											          	    		             },
											          	    		 RECORD   :  {
											          	    			           CML_DESCRIPTION     :  _filenewData.path, 
											          	    			           SYNC_PENDING_STATUS : "1", 
											          	    			           KEY_TYPE            : "NDD" 
											          	    			         },
											          	    		 TN       :  "NODE_DETAILS_DISPLAY"
								          	     };
								          	    
						      		    		let _updateObject                 = {};
						    					_updateObject.clientInfo          = iMoveFileObject.iUserInfo;
						    					_updateObject.updateObj           = {};
						    					_updateObject.updateObj.action    = "UPDATE";
						    					_updateObject.updateObj.dataArray = [];
						    					_updateObject.updateObj.dataArray.push( _updateObj );
						    					
						    					_that.convertRequestToStdFormat( _updateObject ,( iConvertedData )=>{
						   						 
													iConvertedData.extraParam = {
															subAction :  "UPLOAD_FILE_CV"
													};
													
													if( iMoveFileObject.socketId ){
														iConvertedData.socketId =  iMoveFileObject.socketId ;				
													}
													const _dataSendToJavaFun = {
															data : iConvertedData
													};
													
													// Updation of redux state while update of UPLOAD FILE In hbase
													let _addFolderOnThirdParty = {
															  type                     : "UPLOAD_FILE_UPDATE_HBASE",
															  upload_file_update_hbase : true
											                };
													// call dispatch of redux form common
													common.reduxBackendStore.dispatch( _addFolderOnThirdParty );
													
													common.queueLibs.sendToJavaProcess( _dataSendToJavaFun , common.appConfigObj.client['mode'] );			
												});
									  			 
									  				const _spaceChkObj = {
														 				moduleName : 'DROPBOX',
																		url        : 'https://api.dropbox.com/1/account/info',
																		token      : accessToken,
																		uad        : _accountId,
																		userInfo   : iUserInfo
													};
									  				if( iMoveFileCB )iMoveFileCB( null ,_spaceChkObj );								   	   		 
						      		    	}
						      		    	else{
						      		    		if( iMoveFileCB )iMoveFileCB();
						      		    	}
									  }else{			      	    				
				      	    				logger.error("Exception catched In etDropBox : moveFile : ",err);			      	    				
				      	    			}
				      	    		});
				      	      });
				    	  });
					  }else{
						  logger.info('In etDropBoxOperations : moveFile : exception : The file path does not exists!!!');
						  iMoveFileCB();
					  }
				  }
			});	
		}
		catch( error ){
			logger.error("In etDropBoxOperations : moveFile : exception " + error );
		}	
	}

	/**
	 * @author : RMM 
	 * @purpose : to route request of copy file to particular drive
	 * @date : 27/05/2016
	 * @param : iCopyFileObject
	 */
	copyFile( iCopyFileObject, iCopyFileCB ){
		try{
			let _that = this;	
			 logger.info("In etDropBoxOperations : copyFile : ");
			_that.moveFile( iCopyFileObject, iCopyFileCB );
		}
		catch( error ){
			logger.error("In etDropBoxOperations : copyFile : exception : " + error );
		}	
	}

	/**
	 * @author : RMM 
	 * @purpose : to route request of upload file to particular drive
	 * @date : 27/05/2016
	 * @param : iUploadFileObject
	 */
	uploadFile( iUploadFileObject, iUploadFileCB ){
		try{
			let _that = this;
			 logger.info("In etDropBoxOperations : uploadFile : ");
			_that.moveFile( iUploadFileObject, iUploadFileCB );
		}
		catch( error ){
			logger.error("In etDropBoxOperations : uploadFile : exception " + error );
		}	
	}
	
	/**
	 * @author : RMM 
	 * @purpose : to route request of delete file to particular drive
	 * @date : 27/05/2016
	 * @para : iDeleteFileObject
	 */
	deleteFile( iDeleteFileObject){
		try{		 	
			logger.info("In etDropBoxOperations : deleteFile : ");
			let iUserInfo   = iDeleteFileObject.iUserInfo;
			let iParam      = iDeleteFileObject.iParam;
			let _that       = this;
			let _param      = iParam;
			let _srcParams  = _param.SRC_PARAM;
			//let _accountId  = _srcParams.accountId;
			let accessToken = _srcParams.accessToken;
			//let client      = dropboxApp.client(accessToken);
			let _path       = _srcParams.cldParent;
			
			// Initial updation of redux state for delete folder 
			let deleteDropBoxFolder = {
					  type        : "DELETE_FOLDER_CV",
					  userId      : iUserInfo.userId,
					  accountName : "DROPBOX",
		    };
			// call dispatch of redux form common
			common.reduxBackendStore.dispatch( deleteDropBoxFolder );		
			
			logger.info("In etDropBoxOperations : deleteFile : _path : ",_path );
			
			request_Req.post( {
				               'url'   : "https://api.dropbox.com/1/fileops/delete?root=dropbox&path=" + _path,
				               headers : {  
						                  'Authorization': 'Bearer ' + accessToken
					           },
				
			},( err ,foldRes, foldBody )=>{
				
				if(foldBody){
					logger.info("In etDropBoxOperations : deleteFile : 3rd party cb " );
					 
					const _deleteData = JSON.parse( foldBody );
					
					if( _deleteData && _deleteData.is_deleted === true ){
						
						// Updation of redux state for after delete folder on provider
						let _deleteFolderOnThirdParty = {
								  type                    : "DELETE_FOLDER_FROM_PROVIDER",
								  deleted_from_thirdParty : true
			                    };
						// call dispatch of redux form common
						common.reduxBackendStore.dispatch( _deleteFolderOnThirdParty );
						
			  			const _obj = {
				  					CON_PARAM    :  {
								  						PK       :  "CML_ID",
								  						PKVAL    :  _srcParams.fileId  || _srcParams.folderId,
								  						KEY_TYPE :  "NDD"
				  					                },
				  					RECORD       :  {
				  						                ACTIVE_STATUS   :  0,
				  					},  						  
				  					TN           :   "NODE_DETAILS_DISPLAY"						  
			  			  };
			  			let _updateObject                 = {};
						_updateObject.clientInfo          = iDeleteFileObject.iUserInfo;
						_updateObject.updateObj           = {};
						_updateObject.updateObj.action    = "UPDATE";
						_updateObject.updateObj.dataArray = [];
						_updateObject.updateObj.dataArray.push( _obj );	
			  			
			  				/*const _spaceChkObj = {
								 				moduleName : 'DROPBOX',
												url        : 'https://api.dropbox.com/1/account/info',
												token      : accessToken,
												uad        : _accountId,
												userInfo   : iUserInfo
							};*/
			  				_that.convertRequestToStdFormat( _updateObject ,( iConvertedData )=>{
								 
								iConvertedData.extraParam = {
										subAction :  "DELETE_FOLDER_CV"
								};
								if( iDeleteFileObject.socketId ){
									iConvertedData.socketId =  iDeleteFileObject.socketId ;				
								}
								const _dataSendToJavaFun = {
										data : iConvertedData
								};
								
								// Updation of redux state for after delete folder In hbase
								const _deleteFolderOnThirdParty = {
										  type                       : "DELETE_FOLDER_UPDATE_HBASE",
										  delete_folder_update_hbase : true
					                    };
								// call dispatch of redux form common
								common.reduxBackendStore.dispatch( _deleteFolderOnThirdParty );
								
								common.queueLibs.sendToJavaProcess( _dataSendToJavaFun , common.appConfigObj.client['mode'] );			
							});
			    			//if( iDeleteFileCB )iDeleteFileCB( updateJsonObj, _spaceChkObj );	    		
					}
				}else{
					logger.error("In etDropBoxOperations : deleteFile : err " + err );
				}
			});	
		}
		catch( error ){
			logger.error("In etDropBoxOperations : deleteFile : exception " + error );
		}	
	}
	/**
	 * @author : RMM 
	 * @purpose : to route request of delete folder to particular drive
	 * @date : 27/05/2016
	 * @param : iDeleteFolderObject
	 */
	deleteFolder( iDeleteFolderObject, iDeleteFolderCB ){
		try{
			let _that = this;	
			 logger.info("In etDropBoxOperations : deleteFolder : ");
			_that.deleteFile( iDeleteFolderObject, iDeleteFolderCB );
		}
		catch( error ){
			logger.error("In etDropBoxOperations : deleteFolder : exception " + error );
		}	
	}
	
	/**
	 * @author : RMM 
	 * @purpose : to route request of rename folder to particular drive
	 * @date : 27/05/2016
	 * @param : iRenameFolderObject
	 */
	renameFolder( iRenameFolderObject, iRenameFolderCB ){
		try{		 
			 logger.info("In etDropBoxOperations : renameFolder : " );
			 
			let iParam               = iRenameFolderObject.iParam;
			let _that                = this;
			let _param               = iParam;
			let _srcParams           = _param.SRC_PARAM;
			let _folderPathOnDropbox = _srcParams.cldParent  || _srcParams.cldFileId;
			let fldId                = _srcParams.folderId || _srcParams.fileId;
			let _folderName          = _srcParams.folderName;
			let _newName             = _folderPathOnDropbox.substring( 0, _folderPathOnDropbox.lastIndexOf( "/" ) +1 ) + _folderName;
			let accessToken          = _srcParams.accessToken;
			//let client               = dropboxApp.client( accessToken );
			
			// Initial updation of redux state for rename folder 
			let renameDropBoxFolder = {
					  type        : "RENAME_FOLDER_CV",
					  userId      : iRenameFolderObject.iUserInfo.userId,
					  accountName : "DROPBOX",
		    };
			// call dispatch of redux form common
			common.reduxBackendStore.dispatch( renameDropBoxFolder );
			
			request_Req.post( {
			 	        'url'   : "https://api.dropbox.com/1/fileops/move?root=dropbox&from_path=" + _folderPathOnDropbox+ "&to_path=" + _newName,
				        headers : {  
							        'Authorization': 'Bearer ' + accessToken
					              }			
			},( err ,foldRes, foldBody )=>{
				 
				if( foldBody ){
					logger.info("In etDropBoxOperations : renameFolder  : 3rd party cb " );
					
					// Updation of redux state for after rename folder on provider
					const _addFolderOnThirdParty = {
							  type                 : "RENAME_FOLDER_ON_PROVIDER",
							  rename_on_thirdParty : true
			                };
					// call dispatch of redux form common
					common.reduxBackendStore.dispatch( _addFolderOnThirdParty );
					
					const _data =JSON.parse( foldBody );
					if( _data && _data.path ){
						const upObj = {
								CON_PARAM  :  { 
												PK                    : "CML_ID",
												PKVAL                 : fldId ,
												KEY_TYPE              : "NDD" 
										      },
								RECORD     :  { 
									            CML_TITLE             :  _folderName, 
									            SYNC_PENDING_STATUS   :  '1', 
									            CML_DESCRIPTION       : _data.path
									           },
								TN         :  "NODE_DETAILS_DISPLAY"
						};									
						
						let _updateObject                 = {};
						_updateObject.clientInfo          = iRenameFolderObject.iUserInfo;
						_updateObject.updateObj           = {};
						_updateObject.updateObj.action    = "UPDATE";
						_updateObject.updateObj.dataArray = [];
						_updateObject.updateObj.dataArray.push( upObj );				
						
						_that.convertRequestToStdFormat( _updateObject ,( iConvertedData )=>{
							 
							iConvertedData.extraParam = {
									subAction :  "RENAME_FOLDER_CV"
							};
							
							if( iRenameFolderObject.socketId ){
								iConvertedData.socketId =  iRenameFolderObject.socketId ;				
							}
							const _dataSendToJavaFun = {
									data : iConvertedData
							};
							 
							// Updation of redux state while update of rename folder In hbase
							const _renameFolderOnThirdParty = {
									  type                       : "RENAME_FOLDER_UPDATE_HBASE",
									  rename_folder_update_hbase : true
					                };
							// call dispatch of redux form common
							common.reduxBackendStore.dispatch( _renameFolderOnThirdParty );
							
							common.queueLibs.sendToJavaProcess( _dataSendToJavaFun , common.appConfigObj.client['mode'] );			
						});				
					}else{
						if( iRenameFolderCB )iRenameFolderCB();
					}			
				}else{
					logger.error("In etDropBoxOperations : renameFolder : exception " + err );				
				}
			});	
		}
		catch( error ){
			logger.error("In etDropBoxOperations : renameFolder : exception " + error );
		}	
	}
	
	/**
	 * @author : RMM 
	 * @purpose : to get data for sync Drive and send to java process 
	 * @date : 26/05/2016
	 * @Modified On : 22/05/2016
	 * @param : iSyncDriveObject
	 */
	syncDrive( iSyncDriveObject , iSyncDriveCB ){
		try{
			 logger.info("In etDropBoxOperations : syncDrive : ");
			let _that = this;	
			
			let _accessToken = iSyncDriveObject.iParam.SRC_PARAM.accessToken;
			
			request_Req.post({
							  url     : 'https://api.dropbox.com/1/delta',
							  headers : { 
								          'Authorization': 'Bearer ' + _accessToken 
								        },
							  timeout : 60000
							, qs      : {}
			},( err, res, body )=>{
				
				if( body ){
					logger.info("In etDropBoxOperations : syncDrive : 3rd party cb ");
					
					// Initial updation of redux state for sync drive 
					let syncDriveAction = {
							  type        : "SYNC_DRIVE_CV",
							  userId      : iSyncDriveObject.iUserInfo.userId,
							  accountName : "DROPBOX",
				    };
					// call dispatch of redux form common
					common.reduxBackendStore.dispatch( syncDriveAction );				
					
					const _reply = JSON.parse( body );
					if( _reply.entries !==undefined ){
						const dBoxFiles  =  _reply.entries;
						
						_that.convertRequestToStdFormat( dBoxFiles ,( iConvertedData )=>{
							iConvertedData.clientInfo = { userId   : iSyncDriveObject.iUserInfo.userId };
							iConvertedData.extraParam = {
														 subAction :  "SYNC_DRIVE_CV",
														 AccountID :  iSyncDriveObject.iParam.SRC_PARAM.accountId,
														 Provider  :  "DROPBOX",
														 Token     :  _accessToken
							                            };				
							if( iSyncDriveObject.socketId ){
								iConvertedData.socketId =  iSyncDriveObject.socketId ;				
							}
							const _dataSendToJavaFun = {
									data : iConvertedData
							};
							
							// sending third party data to java 
							const _sendToJavaSync = {
									  type                : "SEND_TO_JAVA_SYNC",
									  send_to_java        : true
					                };
							// call dispatch of redux form common
							common.reduxBackendStore.dispatch( _sendToJavaSync );
							
							common.queueLibs.sendToJavaProcess( _dataSendToJavaFun , common.appConfigObj.client['mode'] );			
						});					
						 const _spaceChkObj = {
											 moduleName : 'DROPBOX',
											 url        : 'https://api.dropbox.com/1/account/info',
											 token      : iSyncDriveObject.iParam.SRC_PARAM.accessToken ,
											 uad        : iSyncDriveObject.iParam.SRC_PARAM.accountObj.CML_ID,
											 userInfo   : iSyncDriveObject.iUserInfo
				         };			
				         if( iSyncDriveCB )iSyncDriveCB( dBoxFiles, _spaceChkObj );					
					}								
				}else{
					let _errorMsg = {
							errorMsg : 'Not getting files from dropbox'
					};
					
					if( iSyncDriveCB ){
						iSyncDriveCB( _errorMsg, null );
					}
				}
			}).on( 'error',( e )=>{
			    logger.info( "In etDropBoxOperations : syncDrive : Error : ", e );
			 }).end();		
			
		}catch( e ){
			logger.error( "In etDropBoxOperations : syncDrive : Exception catch : ", e );
		}
	}
	
	/**
	 * @author : RMM 
	 * @purpose : to get data form Java sync Drive function and download the files 
	 * @date : 23/05/2016
	 * @param : iSyncDriveObject
	 */
	syncDriveCallBack( iSyncDriveObject){
		try{
			logger.info("In etDropBoxOperations : syncDriveCallBack : " );
			let _that = this;
			let _accessToken = iSyncDriveObject.Token;
			let _userId          = iSyncDriveObject.dataArray[ 0 ].CREATED_BY;
			let _arrayOfNewFiles = iSyncDriveObject.dataArray;
			
			for( let i = 0; i < _arrayOfNewFiles.length; i++ ){
				let toCalPathArr                 = ( _arrayOfNewFiles[ i ].CML_DESCRIPTION ).split( "/" );
				let _fileNameWithSpecialCharOnFs = toCalPathArr[ toCalPathArr.length - 1 ].replace( /[^a-zA-Z0-9.]/g, "clz" );
				
				let _fileNameOnFS                = new Date().getTime() + '_' + _fileNameWithSpecialCharOnFs;
				
				let _cmlPath                     = '/fs/' + _userId + EMAIL_ATTACHMENT_PATH_FROM_USER_FS_PATH + '/' + _fileNameOnFS;
				let _actualPath                  = _cmlPath.split( '/fs/' );
				
			    let _newPath                     =  USER_FS_PATH + _actualPath[1];
			    logger.info("In etDropBoxOperations : syncDriveCallBack : Path of new downloaded file : ", _newPath  );
			    
			    const fileP                        = fs.createWriteStream(_newPath);//open write stream
			    const _nddDEscription              = _arrayOfNewFiles[ i ].CML_DESCRIPTION;
			        	
			    request_Req.get( {
		               uri     : "https://api-content.dropbox.com/1/files/auto/" + _nddDEscription + "?root=dropbox",
		               headers : {
		            	           authorization : 'Bearer ' + _accessToken 
		            	         }
	               }).pipe( fileP ); 					    
			    	
			    const upObj = {
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
			    let _updateObject                 = {};
				_updateObject.clientInfo          = { userId : _userId };
				_updateObject.updateObj           = {};
				_updateObject.updateObj.action    = "UPDATE";
				_updateObject.updateObj.dataArray = [];
				_updateObject.updateObj.dataArray.push( upObj );		    
				_that.convertRequestToStdFormat( _updateObject , ( iConvertedData )=>{
			    	iConvertedData.extraParam = {
												 subAction :  "ADD_FOLDER_CV"											
					                            };	
					
					if( iSyncDriveObject.socketId ){
						iConvertedData.socketId =  iSyncDriveObject.socketId ;				
					}
					iConvertedData.clientInfo   = { userId : _userId };
					
					const _dataSendToJavaFun = {
							data : iConvertedData
					};
					
					// sending update data to java 
					const _sendToJavaSyncCB = {
							  type                    : "SYNC_DRIVE_UPDATE_HBASE",
							  sync_drive_update_hbase : true
			                };
					// call dispatch of redux form common
					common.reduxBackendStore.dispatch( _sendToJavaSyncCB );
					
					common.queueLibs.sendToJavaProcess( _dataSendToJavaFun , common.appConfigObj.client['mode'] );			
				});
			}		
		}catch( error ){
			logger.error( "In etDropBoxOperations : syncDriveCallBack : Exception : ", error );
		}
	}
	

	/**
	 * @author : RMM 
	 * @purpose : to route request of sync Drive to particular drive
	 * @date : 26/05/2016
	 * @param : iShareContactObject
	 */
	shareContact(){
		try{
			logger.info("In etDropBoxOperations : shareContact : ");
		}
		catch( error ){
			logger.error("In etDropBoxOperations : shareContact : exception " + error );
		}	
	}
	
}
exports.dropDox = dropDox;