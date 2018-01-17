/*eslint-env es6*/

const redisPS=require('./redisPubSub');
const DBStore 	= require('./etDbStore');
const socketioJwt = require('socketio-jwt');
const common		= require('./common');
const promise = common.promise;
const redisps = new redisPS();
const dbStore = new DBStore.dbStore();
const logger=common.logger;

const wrapCallLib = require('./etWrapModules');
const actionReducerEmail = require('./etEmailActionCreator').actionCreators;
const emailOp = new actionReducerEmail();
const actionReducerOnDemand = require('./etOnDemandActionCreator').actionCreators;
const onDemandObj = new actionReducerOnDemand();
const actionReducerLogin = require('./etLoginActionCreator').actionCreators;
const loginOp = new actionReducerLogin();
const actionReducerIOT = require('./etIOTActionCreator').ActionCreators;
const iotOp = new actionReducerIOT();
wrapCall = new wrapCallLib({
	dbStore: dbStore,
});

const domain = require('domain');
const d = domain.create();

class dbSync {
	constructor() {}

	inIt(iSocketObj) {
		try{
			logger.info('In etServerSocket: inIt');
			const that=this;
			that.fSocketObj=iSocketObj;
			dbStore.userSockets = that.fSocketObj;
			common.serverSockets = iSocketObj;
			that.fRedisObj =redisps;
			that.inItPubSubObj();
			if(common.appConfigObj['webServer']['sslOn']) {
				that.fSocketObj.on('connection', socketioJwt.authorize({
					secret: common.secretkeycert,
					algorithms: 'RS256',
					 timeout: 15000 // 15 seconds to send the authentication message
				})).on('authenticated', (socket) => {
					logger.info(" In etserverSocket Init : authenticated :" ,new Date().getTime());
					socket.setMaxListeners(0);
					socket.userInfo = socket.decoded_token;
					socket.userInfo['deviceID'] = socket.id;
					socket.join(socket.decoded_token.userId);
					that.addEventListener(socket);
						
					if(socket.decoded_token.hasOwnProperty('requestFrom')){
					}else{
						common.redisCli.set(socket.id,socket.decoded_token.userId+"+/sync#"+socket.id, function(err, reply) {
							logger.info('set SocketId in redis : ',reply);
						});	
						
						common.redisCli.lrange(socket.decoded_token.userId, 0, -1, function(err, reply) {
	                        if(typeof reply == 'object' && reply.length != 0 && typeof reply[reply.length-1] == 'string'){
	                        	  var object = JSON.parse(reply[reply.length-1])
	                              
	                          	const _obj = {
	      								userId : socket.decoded_token.userId,
	      								topic  : "DIFF_SYNC",
	      								socketId : socket.id,
	      								abc  : true,
	      								syncTime : new Date().getTime(),
	      								logoutTime : object.logoutTime,
	      								moduleName : "SDIFF",
	      								deviceId : "/sync#"+socket.id,
	      								requestId : "/sync#"+socket.id+socket.decoded_token.userId+"#"+new Date().getTime(),
	      								userInfo : {
	      									syncTime :new Date().getTime(),
	      									userId   : socket.decoded_token.userId,
	      									userUID  : socket.decoded_token.userId
	      								}
	      						}
	                          	
	                          	common.queueLibs.sendToJavaProcess(_obj, common.appConfigObj.client['mode'], null, 'DIFF_SYNC');
	                        }
					
				});
					}
				});
			}else{
				that.fSocketObj.on('connection', (socket) => {
					logger.info("Connection Listenerr: : In etserver socket file : " , new Date().getTime());
					socket.setMaxListeners(0);
					that.addEventListener(socket);
				});
			}
			if(common.appConfigObj.client['kafka']) {
				const kafka = require('./etKafka');
				common.kafkalibs = new kafka();
				if(common.appConfigObj.client['kafka'] == 'local') {
					logger.info('local working for kafka');
					common.kafkalibs.initKafkaDeveloper();
				}
				if(common.appConfigObj.client['kafka'] == 'server') {
					logger.info('server working for kafka');
					common.kafkalibs.initKafka();
				}
			}
		}catch(e) {
			logger.error('In etServerSocket: inIt: Exception: ', e);
		}
	}

	loginInit(iSocketObj) {
		const that = this;
		that.fSocketObj=iSocketObj;
		common.syncSockets[iSocketObj.name]= iSocketObj;
		that.fSocketObj.on('connection', (iSocket) => {
			logger.info(" In LoginInit function in etserverSocket  : " , new Date().getTime());
			iSocket.setMaxListeners(0);
			that.addEventListenerUnAuth(iSocket);
		});
	}
	
	deviceInit(iSocketObj){
		const that = this;
		that.fSocketObj=iSocketObj;
		common.deviceSockets = iSocketObj;
		 that.fSocketObj.on('connection', (iSocket) => {
				iSocket.setMaxListeners(1000);
				that.addEventListener(iSocket);
		 });
	}

	iotInit(iSocketObj) {
		const that = this;
		common.iotSockets[iSocketObj.name]= iSocketObj;
		that.fSocketObj=iSocketObj;
		if(common.appConfigObj['webServer']['sslOn']) {
			that.fSocketObj.on('connection', socketioJwt.authorize({
				secret: common.secretkeycert,
				algorithms: 'RS256',
			})).on('authenticated', (socket) => {
				socket.setMaxListeners(0);
				logger.info('Authenticated.....For IOT');
				socket.on('serverOperationIOT1', (idataObj, iCB) => {
					logger.info('In etServerSocket : serverOperationIOT 111: ', idataObj['insertObj']['dataArray'][0]);
					idataObj.socketId = socket.id;
					const _objectName = idataObj['insertObj']['dataArray'][0]['type'];
					const _roomname = idataObj['insertObj']['dataArray'][0].id;
					logger.info('Sensor Type : ' + _roomname);
					const _broadCastObj = {
							action: 'DISPLAY',
							dataArray: [],
							extraParams: {
								action: 'SENSOR_DATA',
							},
					};
					const _dateZ = new Date(idataObj['insertObj']['dataArray'][0].timestamp);
					const _toCalMail = {
							TN: 'CAL_MAIL',
							CML_ID: '1#' + _objectName + '#' + new Date(_dateZ).getTime(),
							CML_REF_ID: '1',
							CML_DATA_POINT: idataObj['insertObj']['dataArray'][0]['present_value'],
							CML_SENSOR_TYPE: idataObj['insertObj']['dataArray'][0]['type'],
							CREATED_ON: _dateZ.toJSON(),
							ACTIVE_STATUS: '1',
							SYNC_PENDING_STATUS: '1',
							SUB_KEY_TYPE: 'IOT',
							KEY_TYPE: 'IOT',
					};
					_toCalMail['KEY_VAL'] = _toCalMail['CML_ID'];
					_broadCastObj['dataArray'].push(_toCalMail);
					if(_objectName == 'Temperature' || _objectName == 'Humidity') {
						for( var i = 2; i <= 5; i++ ) {
							const _newObj = JSON.parse(JSON.stringify(_toCalMail));
							_newObj['CML_ID'] = i + '#' + _objectName + '#' + new Date().getTime();
							_newObj['KEY_VAL'] = _newObj['CML_ID'];
							_newObj['CML_REF_ID'] = ''+ i +'';
							if(i%2 == 0) {
								_newObj['CML_DATA_POINT'] = idataObj['insertObj']['dataArray'][0]['present-value'][0] + Math.floor((Math.random() * 5) + 1);
							}else{
								_newObj['CML_DATA_POINT'] = idataObj['insertObj']['dataArray'][0]['present-value'][0] - Math.floor((Math.random() * 5) + 1);
							}

							_broadCastObj['dataArray'].push(_newObj);
						}
					}
					common.serverSockets.to(_roomname).emit('onDemand', JSON.stringify(_broadCastObj));//send Data based on
					idataObj['topic'] = 'IOTDATA';
					common.queueLibs.sendToJavaProcess(idataObj, common.appConfigObj.client['mode'], null, 'IOTDATA');
				});//serverOperationIOT closed
				
			});
		}else{
			that.fSocketObj.on('connection', (socket) => {
				socket.setMaxListeners(0);
				that.addEventListener(socket);
			});
		}
	}

	/**
	 * @author MSA
	 * setting listener for redis subscribed clients
	 * @modify by RBK
	 */
	inItPubSubObj() {
		try{
			logger.info('In etServerSocket : inItPubSubObj');
			dbStore.redisConnPub.setMaxListeners(0);
			dbStore.redisConnSub.setMaxListeners(0);
			dbStore.redisConnSub.on('message', (channel, msg) => {
				let _channel = null;
				if(channel.split('#')) {
					_channel=channel.split('#')[0];
				}else{
					_channel=channel;
				}
				let _message = msg;
				if(typeof msg == 'string') {
					_message = JSON.parse(msg);
				}
				if(_message.hasOwnProperty('room')) {
					_channel=_message.room;
				}
				if(_channel == 'local') {
					dbStore.emitByUserId(_channel, _message);
				}else{
					dbStore.emitOnSubListener(_channel, _message);
				}
			});

			dbStore.redisConnSub.on('error', (isuberr) => {
				logger.error('In etServerSocket: inItPubSubObj: redisConnSub', isuberr);
			});
			dbStore.redisConnPub.on('error', (ipuberr) => {
				logger.error('In etServerSocket: inItPubSubObj: redisConnPub', ipuberr);
			});
			dbStore.redisConnPub.on('end',(ierr, ipuberr) => {
				logger.error('In etServerSocket: inItPubSubObj: COnnection Lost by redis published client');
			});
			dbStore.redisConnSub.on('end', (ierr, isuberr) => {
				logger.error('In etServerSocket: inItPubSubObj: COnnection Lost by redis subscribed client');
			});
			dbStore.redisConnSub.on('connect', (ierr, isuberr) => {
				logger.info('In etServerSocket: inItPubSubObj: redis subscribed client connected successfully');
			});
			dbStore.redisConnPub.on('connect', (ierr, ipuberr) => {
				logger.info('In etServerSocket: inItPubSubObj: redis published client connected successfully');
			});
			dbStore.redisConnSub.on('ready', (ierr, isuberr) => {
				logger.info('In etServerSocket: inItPubSubObj: redis subscribed client ready successfully');
			});
			dbStore.redisConnPub.on('ready', (ierr, ipuberr) => {
				logger.info('In etServerSocket: inItPubSubObj: redis published client ready successfully');
			});
		}catch(e) {
			logger.error('In etServerSocket: inItPubSubObj: Exception', e);
		}
	}

	addEventListener(iSocket) {
		try{
			const socket	=iSocket;
			const _that	=this;
		
			/**
			 * @author MSA
			 * listener for socket disconnect
			 */
			socket.on('disconnect', (iSocket) => {
				try{
					logger.info('In etServerSocket :  disconnect', socket.id);
					const _time = new Date().getTime();
					common.redisCli.get(socket.id, function(err, reply) {
						logger.info('in disconnect : socket Id',reply);
						if(reply != null){
							var id = reply;
							common.redisCli.del(socket.id);
							var chunks = id.split("+");
						
							var _obj = {
									logoutTime : _time,
									socketId   : socket.id
							}
							var object= JSON.stringify(_obj);
							common.redisCli.rpush(chunks[0],object, function(err, reply) {
							    	  const _obj = {
												userId : chunks[0],
												topic  : "DIFF_SYNC",
												socketId : socket.id,
												syncTime : _time,
												logoutTime : _time,
												moduleName : "SDIFF",
												deviceId : "/sync#"+socket.id,
												requestId : "/sync#"+socket.id+chunks[0]+"#"+new Date().getTime(),
												userInfo : {
													syncTime :_time,
													userId   : chunks[0],
													userUID  : chunks[0]
												}
										}
							    	  common.queueLibs.sendToJavaProcess(_obj, common.appConfigObj.client['mode'], null, "DIFF_SYNC");	    	
							});
						}
					});
				}catch(err) {
					logger.error('In etServerSocket :  disconnect: Exception ', err);
				}
			});

			/**
			 * MSA
			 * 13-5-2015
			 * added for on demand calls on monthly-yearly and task panel
			 */
			socket.on('OnDemandCall', (iInfoObject, iDemandCB) =>{
				try{
					logger.info(' In etServerSockt OnDemand : iInfoObject ');
					if(!iInfoObject.hasOwnProperty('baton')){
						let baton = [];
						iInfoObject.baton = baton;
						iInfoObject.baton.push({Location: 'etserverSocket_OnDemandCall : node', Timestamp: new Date().getTime()});
						
					}else{
						iInfoObject.baton.push({Location: 'etserverSocket_OnDemandCall : node', Timestamp: new Date().getTime()});
					}
					iInfoObject['socketId'] = socket.id;
					let _errFUnc = function() {
						let _err = {
								msg: 'Worng object for ondemand call object is ',
								object: iInfoObject,
						};
						logger.error('In etServerSocket : OnDemandCall : Exception', iInfoObject);

						if(iDemandCB)iDemandCB(_err, null);
					};
					if(((iInfoObject.hasOwnProperty('clientInfo')) || (iInfoObject.hasOwnProperty('userInfo')) || (iInfoObject.hasOwnProperty('userId')))) {
						let mainObj = {};
						if(iInfoObject.hasOwnProperty('extraParam')) {
							mainObj.moduleName = iInfoObject.extraParam.moduleName;
						}else if(iInfoObject.hasOwnProperty('moduleName')) {
							mainObj.moduleName = iInfoObject.moduleName;
						}
						if(mainObj && mainObj.hasOwnProperty('moduleName')) {
							switch(mainObj.moduleName) {
							case "EVT":
							case "ONDEMAND_SECTION_COUNT":
							case "ONDEMAND_TASKS":
							case 'CLD' : 
			  					common.reduxBackendStore.dispatch(onDemandObj.onDemandInit(iInfoObject));
			  					break;
							case 'CloudVault':
								common.reduxBackendStore.dispatch(cloudValut.cloudValutInit(iInfoObject));
								break;
							case 'EML' : 
								common.queueLibs.sendToJavaProcess(iInfoObject,common.appConfigObj.client['mode'],null,"THIRDPARTY_OPERATION");
									 break;
							case 'CGR' : 
							case 'CAL' :
							case 'PROJECT' :
							case  'ARCHIVE':
							case 'CAL_IMG':
								common.queueLibs.sendToJavaProcess(iInfoObject,common.appConfigObj.client['mode'],null,"ONDEMAND_REQUESTS");
					        break;
					        
							case 'TSK':
							case 'PRJ':	
							case 'ORG':
							case 'SCR':
							case 'GEN':
								common.reduxBackendStore.dispatch(onDemandObj.onDemandInit(iInfoObject));
							break;
							
							case "PROJECT_LIST":
							case "ARCHIVE_PROJECTS" :
								common.queueLibs.sendToJavaProcess(iInfoObject,common.appConfigObj.client['mode'],null,"ONDEMAND_REQUESTS");
								break;
								
							case "DELETED_PROJECTS" :
								common.queueLibs.sendToJavaProcess(iInfoObject,common.appConfigObj.client['mode'],null,"ONDEMAND_REQUESTS");
				                   break;
				                   
							case "UNSUBSCRIBE_PROJECT" :
								common.queueLibs.sendToJavaProcess(iInfoObject,common.appConfigObj.client['mode'],null,"ONDEMAND_REQUESTS");
								break;

							case "CHECK_CONFLICT":
								common.queueLibs.sendToJavaProcess(iInfoObject,common.appConfigObj.client['mode'],null,"ONDEMAND_REQUESTS");
				  				return;
							   break;
							case "EVENT_PROPOSED_SLOT":
						  	common.queueLibs.sendToJavaProcess(iInfoObject,common.appConfigObj.client['mode'],null,"FREE_SLOT");
						  				return;
									break;
							case "NEWS":		
					   			logger.info("In etServerSocket : OnDemandCallForNews iInfoObject is as : ",iInfoObject);
					   			if(iInfoObject && iInfoObject.hasOwnProperty('projectName') && iInfoObject.sectionFlag==true){
					   				logger.info("In etServerSocket : OnDemandCall : Listener : section fetch request for projectName ",iInfoObject.projectName);
					 				//fetch news projects from redis
					   				var _keyId;
					   				if(iInfoObject.projectName.indexOf("NYT")!=-1){
					   					 _keyId="NYT_NEWS_SECTION";
					   					logger.info("In etServerSocket : OnDemandCallForNews : fetch NYT_NEWS_SECTION satsidfiieddd");
					   				}else if(iInfoObject.projectName.indexOf("FT")!=-1){
					   					 _keyId="FT_NEWS_SECTION";
					    					logger.info("In etServerSocket : OnDemandCallForNews : fetch FT_NEWS_SECTION satsidfiieddd");
					   				}else{
					   					 _keyId="GUARDIAN_NEWS_SECTION";
					     					logger.info("In etServerSocket : OnDemandCallForNews : fetch GUARDIAN_NEWS_SECTION satsidfiieddd");
					   					
					   				}
					   			}else if(iInfoObject && iInfoObject.projectName && iInfoObject.taskFlag==true){
					   				logger.info("In etServerSocket : OnDemandCallForNews : fetch the  tasks under the selected section",iInfoObject.projectName);
					   				iInfoObject.moduleName="ON_DEMAND_CALL_FOR_NEWS";
					   				common.queueLibs.sendToJavaProcess(iInfoObject,common.appConfigObj.client['mode'],null,"ONDEMAND_REQUESTS");
					   				}
								break;
									
			  				}//switch case closed
						}else{
							_errFUnc();
						}
					}else{
						_errFUnc();
					}
				}catch(err) {
					logger.error('In newServerSocket : OnDemandCall : Exception', err);
				}
			});
			
			/**
			 *@author MSA
			 * send data to server listener from client side
			 *  iClientInfo - userId and userUID
			 *  iUpdateEventObj - update object
			 *  iInsertEventsObj-insert object
			 *  ibroadcast - flag for broadcast - true if broadcasting to be done
			 *  moduleName : from which req came
			 *  Modified by : PBS, RBK
			 *  date 3 aug 2015
			 */
			socket.on('serverOperation', (idataObj, iCB) => {
				try{
					if(!idataObj.hasOwnProperty('baton')){
						let baton = [];
						idataObj.baton = baton;
						idataObj.baton.push({Location: 'etServerSocket_serverOperation : node', Timestamp: new Date().getTime()});
						logger.info("In etServerSocket serverOperation :" , idataObj.baton);
					}else{
						idataObj.baton.push({Location: 'etServerSocket_serverOperation : node', Timestamp: new Date().getTime()})
					}
						logger.info('In etServerSocket : serverOperation: listener : STEP 1 : UserId : ', idataObj.userId);
					    idataObj.socketId = socket.id;
					
					//for diff sync updateCLientserver versions
					function _failedReq() {
						if(idataObj.hasOwnProperty('socket')) {
							idataObj.socket = undefined;
						}
						//logger.error(JSON.stringify(idataObj));
						if(idataObj.offLineRequest == true) {
							dbStore.redisConnPub.publish('FAILURE_DAEMON', JSON.stringify(idataObj));
						}
						if(socket) {
							idataObj.socketId = socket.id;
						}
					}
					function _callBack(iSuccess) {
						//added this to give callback to frontend
						if(iCB)iCB(iSuccess);
					}//_callBack function closed
					try{
						function moduleCall(iDataBaseObj) {
							if(iDataBaseObj.offLineRequest == true) {
								socket.emit('clearOfflineRequest', JSON.stringify(iDataBaseObj));
							}
							wrapCall.wrapMyModulesFromSocketCall(iDataBaseObj, socket);
						}
						function _vallidate() {
							dbStore.vallidationOfObjects(idataObj, (insertObj, iupdateObj, iErrObjCallBack, iDataInfo) => {
								if(iErrObjCallBack) {
									_failedReq();
									socket.emit('ErrorFromServer', iErrObjCallBack);
								}else{
									if(iDataInfo) {
										logger.info('In etServerSocket : serverOperation: listener: iDataInfo of insert/update obj is AND user name is',socket.userInfo.userId);
										logger.info(iDataInfo);
									}
									moduleCall(idataObj);
								}
							});
						}
								_vallidate();
					}catch(e) {
						logger.error('In etServerSocket : serverOperations : Exception', e);
					}
				}catch(e) {
					logger.error('In etServerSocket :  serverOperations : Exception', e);
				}
			});
 
			socket.on('SERVER_DIFF_SYNC', (iUserInfo) => {
				if(common.appConfigObj.client['cache']) {
					iUserInfo['moduleName'] = "SDIFF";
					if(iUserInfo.completeSync != false) {
						common.queueLibs.sendToJavaProcess(iUserInfo, common.appConfigObj.client['mode'], null, 'DIFF_SYNC');
					}
				}
			});
			
			socket.on('hubToClouzer', (idataObj, iCB) => {
				if(idataObj && idataObj.hasOwnProperty('insertObj') && idataObj.insertObj.dataArray[0].ACTION_ARRAY[0] == "ADD_NODE_RECEIVER"){
					common.deviceSockets['devices'] = {};
					common.deviceSockets['devices'][idataObj]=socket.id;
					socket.join(idataObj.extraParam.deviceId,()=>{
		    		 logger.info('joined room  : ');
		    		 });
				}else if(idataObj && idataObj.hasOwnProperty('extraParam') && idataObj.extraParam.hasOwnProperty('deviceList')){
					//for ADD_NODE_DEVICE
					iSocket.join(idataObj.extraParam.deviceList.collectorId,function(){
					});
				}	
				idataObj['extraParam']['socketId'] = socket.id;
				common.reduxBackendStore.dispatch(iotOp.iotInit(idataObj));
			});
			
			socket.on('joinRoom', function(idataObj) {
				iSocket.join(idataObj[0].CML_SERIAL,function(){
			});
			});
			
			socket.on('CloudsToHub', (idataObj,iCB) => {
				common.deviceSockets.to(idataObj.dataArray[0].hub).emit('IOEToHub',idataObj.dataArray[0]);
			});
				  
		}catch(e) {
			logger.error('In etServerSocket:  UserConnected: Exception: ', e);
		}
	}
	
	addEventListenerUnAuth(iSocket){
		iSocket.on('LOGIN', (iUserInfo, iCB) => {
			iSocket.join(iSocket.id);
			common.syncSockets['login']= iSocket;
			if(typeof iUserInfo === "string"){
				iUserInfo = JSON.parse(iUserInfo);
				if(iUserInfo.hasOwnProperty('baton')){
					iUserInfo.baton.push({Location: 'etServerSocket_login : node',Timestamp: new Date().getTime()});
					logger.info("In etServerSocket LOGIN baton : " , iUserInfo.baton);
				}
			}else{
				if(iUserInfo.hasOwnProperty('baton')){
					iUserInfo.baton.push({Location: 'etServerSocket_login : node',Timestamp: new Date().getTime()});
					logger.info("In etServerSocket LOGIN baton : " , iUserInfo.baton);
				}
				
			}
			const obj = {
					socketId : iSocket.id,
					requestId :  "/sync#"+iSocket.id+iUserInfo.username+"#"+new Date().getTime()
			}
			Object.assign(iUserInfo,obj);
			common.reduxBackendStore.dispatch(loginOp.loginInit(iUserInfo));
		});
	}
}
exports.dbSync = dbSync;