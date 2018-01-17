/*eslint-env es6*/
'use strict';
const musicMetadata=require('musicmetadata');
const path = require('path');
const fs = require('fs');
const googleapis = require('googleapis');
const common=require('./common');
const uploadFile	 = require('./uploadFile');
const msProp=require('./msProperties');
const appConfigObj=msProp.appConfig;
const clientObj =appConfigObj.client;
const cloudvault=msProp.CloudObj;
const hostName=cloudvault.hostNamecloud;
const skydriveAppId = cloudvault.skydriveAppId;
const skydriveredirect_url = hostName+cloudvault.skydriveRedUrl;
let subDomain = {};
if(appConfigObj && appConfigObj.orgTemplate){
	 subDomain = appConfigObj.orgTemplate.subDomain;
}
const logger = common.logger;
let oauth2Client = null;
const RedisPS=require('./redisPubSub');
const redisps = new RedisPS();
const DBStore 	= require('./etDbStore');
const dbStore = new DBStore.dbStore(redisps);
const _cancelReq ={};
const readChunk = require('read-chunk'); // npm install read-chunk
const fileType = require('file-type');
const ActionReducerProject = require('./etProjectActionCreator').actionCreators;
const prjOp=new ActionReducerProject();
const root = __dirname;
const ActionReducerCloudVault = require('./etCloudVaultActionCreator').actionCreators;
const cloudValut = new ActionReducerCloudVault();
const igniteObj = require('./etNodeIgnite').nodeIgnite;
const ignite = new igniteObj();
class Handler {
	constructor() {
		try{
			const OAuth2 = googleapis.auth.OAuth2;
			oauth2Client = new OAuth2(cloudvault.googleAppId, cloudvault.googleSecret, hostName+cloudvault.googleRedUrl);// google console from account nciportal1@gmail.com credentials need to use reference name
			return this;
		}	catch(e) {
			logger.error('In etRouteHandler2Page : constructor : Exception : ', e);
		}
	}

	homePage(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : homePage ');
			if(request.auth.isAuthenticated) {
				let file = appConfigObj['projectPath'].filePath+'clzDesktop.html';
				let fileToServe = path.join(root,file);
				return reply.file(fileToServe,{ confine: false });
			}else{
				reply.redirect('/');
			}
		}catch(e) {
			logger.error('In  etRouteHandler2Page: homePage : Exception : ', e);
		}
	}

	/**
	 * @author    :   AYK
	 * @purpose   :  Function to load files on browser
	 * @param request  :  Http request
	 * @param reply	   :   Http respnonse
	 * @returns
	 */
	localfileUpload(request, reply) {
		try{
			console.log("<----in the upload file senario---  request-----> : " );
			if(appConfigObj['environment'] && appConfigObj['environment'].environment === 'production') {
				let compath = null; let path1 = request.path;//.substring(4);

				compath = common.EIPS2_USERS_PATH+path1;
				let resize = path1.split('/');
				let _path1;
				if(resize[2] && resize[2].indexOf('x') !== '-1') {
					const widHt1 = resize[2].split('x')[0];//"^"+userId+"#[0-9]{13}#PRJ:*"
					const widHt2 = resize[2].split('x')[1];
					   _path1 = null;
					if(Number(widHt1) !== 'NaN' && Number(widHt2) !== 'NaN') {
						_path1 = path1.replace('/fs/', '/ifs_');
					}else{
						_path1 = path1.replace('/fs/', '/ifs/');
					}
				}else{
					_path1 = /*"/ifs/"+*/path1.replace('/fs/', '/ifs/');
				}

				reply().header('X-Accel-Redirect', _path1);
			}else{
				let compath = null, path1 = request.query.path.substring(4);
				compath = common.EIPS2_USERS_PATH+path1;
				reply.file(compath, {confine: false});
			}
		}catch(e) {
			logger.error('In  etRouteHandler2Page: localfileUpload : Exception : ', e);
		}
	}

	/**
	 * @author    :   MSA
	 * @purpose   :  Function to upload file on server
	 * @param request  :  Http request
	 * @param reply	   :   Http respnonse
	 * @returns
	 */
	uploadItem(request, reply) {
		try {
			console.log("in  the upload file item function");
			logger.info('In etRouteHandler2Page : uploadItem ');
			let _responseArray = [];
			let windowId = null;
			if(request.payload && request.payload.windowId!=null) {
				windowId = request.payload.windowId;
			}
			let _pathObj = {};
			let _req=null;
			let _filelenArr = null;
			const _uploadedFilesId = request.payload.id;
			const _uploadedFilesName = request.payload.name;
			let oneflag = null; let _cLbkDumyy = {};
			if(request.payload.stream) {
				_req = request.payload.stream;
				_filelenArr = request.payload.size;
			}else{
				if(request.payload.id) {
					_cancelReq[request.payload.id] = request.payload.id;
				}
			}
			const userSessionObj=request.auth.credentials;
			let _userObj=null; let _userId='Test@mstorm.com';

			if(userSessionObj!==undefined) {
				_userObj=userSessionObj;
				if(_userObj.username !==undefined) {
					_userId=_userObj.username;
				}
				logger.info('In etRouteHandler2Page : uploadItem :  user session object');
			}else{
				logger.info('In etRouteHandler2Page : uploadItem : logged user has not session sepecific informtion .');
			}

			const _baseDestinationDir=common.EIPS2_USERS_PATH+_userId+'/Cloud Vault/Media/Upload';
			const date = new Date();
			let _uploadFunc = (irequest, iId, isize, iName, iCalbak, iWind)=>{
				let count = '0'; let uploadlen = 0; let totallen = 0;
				uploadFile.isYearAndMonthDirecotryExists(_userId, irequest, _baseDestinationDir, (_userId, _uploadedFiles, iObject, iAppendDirectoryPath) =>  {
					_pathObj[iId] = {
							upload_file_path: _baseDestinationDir+'/'+iAppendDirectoryPath+'/',
							nginxPath: '/fs/'+_userId+'/Cloud Vault/Media/Upload/'+iAppendDirectoryPath+'/',
							name: date.getTime() + '_'+Math.floor((Math.random() * 10000))+'_'+ iName.replace(/[^a-zA-Z0-9.]/g, 'clz'),

					};
					_pathObj[iId]['newFile'] = _pathObj[iId].upload_file_path + _pathObj[iId].name;
					_pathObj[iId]['nginxfilep'] = _pathObj[iId].nginxPath + _pathObj[iId].name;
					let len = parseInt(isize, 10);

					let writable = fs.createWriteStream(_pathObj[iId].newFile);//writable stream for readed data ( Node.js filesystem );

					let body = '';
					irequest.pipe(writable, {end: false});

					irequest.on('data', (chunk) => {
						let _percentage = '';
						if(chunk.length) {
							totallen = totallen + chunk.length/len*100;
							_percentage = Math.floor((totallen));
							uploadlen = uploadlen + _percentage;
						}

						const result = JSON.stringify(fileType(chunk));
						if(result && result != 'null') {
							_pathObj[iId]['contentType'] = result;
						}


						const _fileObj = {
								'fileName': iName,
								'path': _pathObj[iId].nginxfilep,
								'contentType': result, //irequest.hapi.headers['content-type']
						};
						if(result === 'null' || result == null || result === 'false') {
							if(_pathObj[iId]['contentType'] && _pathObj[iId]['contentType'] !== 'false') {
								_fileObj['contentType'] = _pathObj[iId]['contentType'];
							}else{
								if(irequest.hapi.headers['content-type'])
									_fileObj['contentType'] = irequest.hapi.headers['content-type'];
							}
						}
						if(!_cLbkDumyy[iId]) {
							_responseArray.push(_fileObj);
							_cLbkDumyy[iId] = true;
						}

						const _result = {
								fileId: iId,
								fileObj: _fileObj,
								windowId: iWind,
						};
						body += chunk;
						_result.percentage = uploadlen;
						if(uploadlen < 100 ) {
							if(count !== uploadlen) {
								count = uploadlen;
								if(_cancelReq[iId] !== iId) {
									dbStore.emitByUserId(_userObj.username, null, 'ProgressBar', JSON.stringify(_result));
								}
							}
						}
					});
					irequest.on('end', () => {
						const buffer = readChunk.sync(_pathObj[iId].newFile, 0, 262);
						const orginalBuff = fileType(buffer);
						const result = JSON.stringify(orginalBuff);
						const _fileObj = {
								'fileName': iName,
								'path': _pathObj[iId].nginxfilep,
								'contentType': result, //irequest.hapi.headers['content-type']
						};
						if(!_cLbkDumyy[iId]) {
							_responseArray.push(_fileObj);
							_cLbkDumyy[iId] = true;
						}
						if(result === null || result === 'false' ) {
							if(_pathObj[iId]['contentType'] && _pathObj[iId]['contentType'] !== 'false') {
								_fileObj['contentType'] = _pathObj[iId]['contentType'];
							}else{
								if(irequest.hapi.headers['content-type'])
									_fileObj['contentType'] = irequest.hapi.headers['content-type'];
							}
						}

						const _result = {
								fileId: iId,
								fileObj: _fileObj,
								windowId: iWind,
						};
						_result.percentage = 100;
						let flag=false;
						if(orginalBuff && orginalBuff['ext'] && orginalBuff['ext']==='mp3') {
							flag=true;
							let albumObj={};
							musicMetadata(fs.createReadStream(_pathObj[iId]['newFile']), (err, iMetadata) => {
								console.log("<-----in musicMetatadata----- callback function---->");
								if(iMetadata) {
									console.log("<-----print the metta--da-->");
									console.log(iMetadata);
									const _Obj={
											CML_ID: '1',
											ACTION_ARRAY: ['ADD_METADATA_TOALBUM'],
											userId: _userObj.userId,
											KEY_TYPE : 'PRJ',
											SUB_KEY_TYPE :'AUD',
											
									};
									albumObj={
											insertObj: {
												action: 'INSERT',
												dataArray: [_Obj],
												
											},
											moduleName: 'Media',
											clientInfo: {
												userId: _userObj.userId,
											},
									};
									if(iMetadata.picture.length>0) {
										const i=_pathObj[iId]['newFile'].split('.mp3');
										const iPath = _fileObj.path;
										const imgP = iPath.split('.mp3');
										const newPath=i[0]+'_albArt.'+iMetadata.picture[0].format;
										const audioImg = imgP[0]+'_albArt.'+iMetadata.picture[0].format;
										iMetadata.ALBUM_ART_PATH=audioImg;
										const writeStream=fs.createWriteStream(newPath);
										writeStream.write(iMetadata.picture[0].data);
										iMetadata.picture[0]='';
										_result.metadata=iMetadata;
										
										console.log("<-----in the albbumObje---- :   ");
										console.log(albumObj.insertObj);
										
										console.log("<----extra param in the album obj----->");
										console.log( albumObj.insertObj.extraparam);
										
										albumObj.insertObj.dataArray[0].result=_result;
										albumObj.insertObj.extraparam=_result;

										if(_cancelReq[iId] !== iId) {
											common.reduxBackendStore.dispatch(prjOp.projectInit(albumObj));
											dbStore.emitByUserId(_userObj.username, null, 'ProgressBar', JSON.stringify(_result));
										}
									}else{
										_result.metadata=iMetadata;

										albumObj.insertObj.dataArray[0].result=_result;
										albumObj.insertObj.extraparam=_result;

										if(_cancelReq[iId] !== iId) {
											common.reduxBackendStore.dispatch(prjOp.projectInit(albumObj));
											dbStore.emitByUserId(_userObj.username, null, 'ProgressBar', JSON.stringify(_result));
										}
									}
								}
							});
						}
						if(flag===false) {
							if(_cancelReq[iId] !== iId) {
								dbStore.emitByUserId(_userObj.username, null, 'ProgressBar', JSON.stringify(_result));
							}
						}
						if(oneflag) {
							if(iCalbak)iCalbak(iObject);
						}

						writable.end();
					});
					if(!oneflag) {
						if(iCalbak)iCalbak(iObject);
					}
				});
			};
			console.log("<----before the _uplaodFunction call --->");
			if(_req !== undefined && !(_req instanceof Array)) { // for 1 file upload
				oneflag = true;
				_uploadFunc(_req, _uploadedFilesId, _filelenArr, _uploadedFilesName, (iObj) => {
					let _obj={};
					_obj['parentFolder']=iObj;
					_obj['uploadFiles']=_responseArray;
					_obj['windowId'] = windowId;
					reply(_obj);
					return;
				}, windowId);
			}else{
				let _recFileUp = function(iStremArr, iIdArr, ifilelenArr, iFileName, iIndex, iWindowId) { // for multiple file upload
					const _mainStream = iStremArr[iIndex];
					const _id = iIdArr[iIndex];
					const _size = ifilelenArr[iIndex];
					const _name = iFileName[iIndex];
					const _window = iWindowId[iIndex];
					_uploadFunc(_mainStream, _id, _size, _name, (iObj) => {
						iIndex++;
						if(iIndex < iStremArr.length) {
							_recFileUp(iStremArr, iIdArr, ifilelenArr, iFileName, iIndex, iWindowId);
						}else{
							let _obj={};
							_obj['parentFolder']=iObj;
							_obj['uploadFiles']=_responseArray;
							_obj['windowId'] = windowId;
							reply(_obj);
							return;
						}
					}, _window);
				};
				if(_req) {
					_recFileUp(_req, _uploadedFilesId, _filelenArr, _uploadedFilesName, 0, windowId);
				}else{
					if(!_cancelReq) {
						let _obj={};
						_obj['parentFolder']=null;
						_obj['uploadFiles']='request Object was null';
						_obj['windowId'] = windowId;
						reply(_obj);
						return;
					}
				}
			}
		}catch(er) {
			logger.error('In  etRouteHandler2Page : uploadItem  : Exception : ', er, ' request.payload ', request.payload);
			return reply('error: ' + er.message);
		}
	}

	/**
	 * @Modified By     :   RMM for redux
	 */
	dropBox(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : dropBox ');
			let extraParam = {};
			extraParam.subAction = 'dropBoxRedirectURL';
			common.reduxBackendStore.dispatch(cloudValut.cloudValutInit({'extraParam': extraParam, 'request': request, 'reply': reply}));
		}	catch(e) {
			logger.error('In  etRouteHandler2Page: dropBox : Exception :  ', e);
		}
	}//dropbox function ends

	/**
	 * @author          :   SSD
	 * $purpose         :   Function to configure Dropbox account
	 * @param request   :   Http request
	 * @param reply     :   Http reply
	 * @Modified By     :   RMM for redux
	 */
	dropBoxCallBack(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : dropBoxCallBack ');
			let extraParam = {};
			extraParam.subAction = 'dropBoxAddAccount';
			common.reduxBackendStore.dispatch(cloudValut.cloudValutInit({'extraParam': extraParam, 'request': request, 'reply': reply}));
		}	catch(e) {
			logger.error('In  etRouteHandler2Page: dropBoxCallBack : Exception :  ', e);
		}
	}//dropboxcb ends

	/**
	 * @author          :   SSD
	 * $purpose         :   Function to configure googleDrive account
	 * @param request   :   Http request
	 * @param reply     :   Http reply
	 */
	googleDrive(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : googleDrive ');
			let extraParam = {};
			extraParam.subAction = 'googleDriveRedirectURL';
			common.reduxBackendStore.dispatch(cloudValut.cloudValutInit({'extraParam': extraParam, 'request': request, 'reply': reply}));
		}	catch(e) {
			logger.error('In  etRouteHandler2Page: googleDrive : Exception :  ', e);
		}
	}


	/**
	 * @author          :   GSS
	 * $purpose         :   Function to import Google Contacts
	 * @param request   :   Http request
	 * @param reply     :   Http reply
	 */
	googleContacts(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : googleContact ');
			let extraParam = {};
			extraParam.subAction = 'googleContactRedirectURL';
			common.reduxBackendStore.dispatch(cloudValut.cloudValutInit({'extraParam': extraParam, 'request': request, 'reply': reply}));
		  }catch(e) {
			logger.error('In  etRouteHandler2Page: googleContact : Exception :  ', e);
		}
	}

	/**
	 * @author          :   SSD
	 * $purpose         :   Function to import Google Contacts
	 * @param request   :   Http request
	 * @param reply     :   Http reply
     * @ModifyBy        :   GSS
	 */
	googleContactsCallBack(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : googleContactsCallBack');
			let extraParam = {};
			extraParam.subAction = 'googleContactAccount';

			common.reduxBackendStore.dispatch(cloudValut.cloudValutInit({'extraParam': extraParam, 'request': request, 'reply': reply}));
		}catch(e){
			logger.error('In  etRouteHandler2Page: googleContactsCallBack : Exception : ', e);
		}
	}

	/**
	 * @author          :   VNM
	 * $purpose         :   Shifting Load from api.clouzerindia.com
	 * @param request   :   Http request
	 * @param reply     :   Http reply
	 */
	apiAretas(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : apiAretas');
			let extraParam = {};
			extraParam.subAction = 'apiAretas';
			var payloadsensordata = request.payload;
			if(payloadsensordata == null || payloadsensordata == undefined){
				logger.info("payload missing at "+ Date.now());
			}else{
			var aretasObject={	"clientInfo":{"userId":"ruby.bell@mstorm.com"},
								"broadCast":true,
								"moduleName":"IOT",
								"insertObj":{	"action":"INSERT",
										"dataArray":[{	ACTION_ARRAY:['SAVE_DELOS_DATA'],
													"timestamp":payloadsensordata.t,
													"name":payloadsensordata.st,
													"id":payloadsensordata.m,
													"present_value":payloadsensordata.d}
													]},
								"socketId":"/iot#_URDMWYxTKB9Kl6GAAAM",
								"topic":"IOTDATA"}
			reply(payloadsensordata).code(200);
			common.queueLibs.sendToJavaProcess(aretasObject, common.appConfigObj.client['mode'], null, 'IOTDATA');}
		}catch(e){
			logger.error('In  etRouteHandler2Page: apiAretas : Exception : ', e);
		}
	}	
	
	/**
	 * @author          :   SSD
	 * $purpose         :   Function to configure boxDrive account
	 * @param request   :   Http request
	 * @param reply     :   Http reply
	 * modifed by       :   RMM on 13/05/2016
	 */
	boxDrive(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : boxDrive ');
			let extraParam = {};
			extraParam.subAction = 'boxDriveRedirectURL';
			common.reduxBackendStore.dispatch(cloudValut.cloudValutInit({'extraParam': extraParam, 'request': request, 'reply': reply}));
		}	catch(e) {
			logger.error('In  etRouteHandler2Page: boxDrive : Exception :  ', e);
		}
	}

	/**
	 * @author          :   SSD
	 * $purpose         :   Function to configure boxDrive account
	 * @param request   :   Http request
	 * @param reply     :   Http reply
	 * modifed by       :   RMM on 13/05/2016
	 */
	boxCallback(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : boxCallback ');
			let extraParam = {};
			extraParam.subAction = 'boxDeriveAddAccount';
			common.reduxBackendStore.dispatch(cloudValut.cloudValutInit({'extraParam': extraParam, 'request': request, 'reply': reply}));
			reply.redirect('/mstorm#/home/close');
		}catch(e) {
			logger.error('In  etRouteHandler2Page: boxCallback : Exception :  ', e);
		}
	}//box callback ends

	/**
	 * @author          :   SSD
	 * $purpose         :   Function to configure Skydrive account and to import hotmail Contacts
	 * @param request   :   Http request
	 * @param reply     :   Http reply
	 */
	skyDrive(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : skyDrive ');
			let extraParam = {};
			extraParam.subAction = 'skyDriveRedirectURL';

			const redirectURL = 'https://login.live.com/oauth20_authorize.srf?client_id='+skydriveAppId+
			'&scope=wl.emails,wl.imap,wl.basic,wl.skydrive,wl.skydrive_update,wl.offline_access&response_type=code&redirect_uri='+
			skydriveredirect_url;
			reply.redirect(redirectURL);
		}catch(e) {
			logger.error('In  etRouteHandler2Page: skyDrive : Exception :  ', e);
		}
	}

	/**
	 * @author          :   SSD
	 * $purpose         :   Function to configure Skydrive account and to import hotmail Contacts
	 * @param request   :   Http request
	 * @param reply     :   Http reply
	 */
	skyDriveCallBack(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : skyDriveCallBack ');
			let extraParam = {};
			extraParam.subAction = 'skyDriveAddAccount';
			common.reduxBackendStore.dispatch(cloudValut.cloudValutInit({'extraParam': extraParam, 'request': request, 'reply': reply}));
			reply.redirect('/mstorm#/home/close');
		}catch(e) {
			logger.error('In  etRouteHandler2Page: skyDriveCallBack : Exception :  ', e);
		}
	}
	pingServer(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : pingServer ');
			const _payload = request.payload;
			reply(_payload);
		}catch(e) {
			logger.error('In  etRouteHandler2Page: pingServer : Exception :  ', e);
		}
	}

	/**
	 * @author : AAP
	 * @Purpose : For register with gmail and googleDriveCallback and nonclouzer user
	 * @Date : 5/10/15 Modified on 8/12/15
	 * @param request
	 * @param reply
	 */
	googleDriveCallBack(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : googleDriveCallBack ');
			let extraParam = {};
			extraParam.subAction = 'googleDriveAddAccount';

			common.reduxBackendStore.dispatch(cloudValut.cloudValutInit({'extraParam': extraParam, 'request': request, 'reply': reply}));
		}	catch(e) {
			logger.error('In  etRouteHandler2Page: googleDriveCallBack : Exception : ', e);
		}
	}
	
	orgRedirect(request, reply) {
		var cookie = require('cookie');
		var	query = request.query [''];
		let orgName;
		if(typeof query === 'string'){
			orgName = query.toLowerCase();
		}else{
			orgName = query[0].toLowerCase();
		}

		let regExp = /^[A-Za-z0-9]+$/;
		let matched = orgName.match(regExp);
		 if(matched === null){
			 reply('ORG CONTAINS SPECIAL CHARACTERS')
		 }else{
				const encryptedData = query[1];
				
				ignite.checkOrgListInIgnite(orgName,(iObj)=>{
					if(iObj !== null){
						// console.log("ORG OBJECTT.....",iObj);
						let serverInfo = {};
						serverInfo.globalVars = clientObj;
						serverInfo.CML_ORG_WEB_SITE=iObj.CML_ORG_WEB_SITE;
						serverInfo.IS_HOME_PUBLISH=iObj.IS_HOME_PUBLISH;
						serverInfo.ORG_ID = iObj.ORG_ID;
						serverInfo.CML_IMAGE_PATH = iObj.CML_IMAGE_PATH;
						serverInfo.CML_TITLE = iObj.CML_TITLE;
						serverInfo.CML_TEMPLATE_ID = iObj.CML_TEMPLATE_ID;
						if(appConfigObj && appConfigObj.orgTemplate && appConfigObj.orgTemplate.subDomain){
						const cookie_options = {
								ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
								encoding: 'none',    // we already used JWT to encode
								isSecure: true,      // warm & fuzzy feelings
								isHttpOnly: true,    // prevent client alteration
								clearInvalid: false, // remove invalid cookies
								strictHeader: true,   // don't allow violations of RFC 6265,
								domain: appConfigObj.orgTemplate.domain,
								path : '/'
						};
						
							if(typeof query === 'string'){
								const cookies = cookie.serialize('ServerInfo', JSON.stringify(serverInfo),cookie_options);
								console.log('subDomainsubDomainsubDomainsubDomain : ',subDomain);
								reply.redirect(subDomain)
									.header('Set-Cookie',cookies);
							}
							else{
								serverInfo['encrypted'] = encryptedData;
								const cookies = cookie.serialize('ServerInfo', JSON.stringify(serverInfo),cookie_options);
								reply.redirect(subDomain)
									.header('Set-Cookie',cookies);
							}
						}else{
										var file = "../../NewBuilderOrgDynamic/dist/index.html";
										if(iObj && iObj.CML_SUB_DOMAIN){
											if(iObj.CML_SUB_DOMAIN == 'template1.clouzer.com'){
												file = "../../NewBuilderOrgDynamic/dist/index.html";
											}
											else{
												file = "../../InstallerOrgDynamic/dist/index.html";
											}
										}
										let fileToServe = path.join(root,file);	
										if(typeof query === 'string'){
											const cookies1 = cookie.serialize('ServerInfo', JSON.stringify(serverInfo));
											reply.file(fileToServe,{confine : false}).header('Set-Cookie', cookies1);
										}
										else{
											serverInfo['encrypted'] = encryptedData;
											const cookies1 = cookie.serialize('ServerInfo', JSON.stringify(serverInfo));
											reply.file(fileToServe,{confine : false}).header('Set-Cookie', cookies1);
										}
						}
					}
				});
		 } 
	
	
}
	getOrgPublishData(request,reply){
		if(request.payload && request.payload.orgName){
			const orgName = request.payload.orgName;
			ignite.getData(orgName,(iObj)=>{
				reply(iObj);
			});
		}
	}
}
exports.Handler=Handler;