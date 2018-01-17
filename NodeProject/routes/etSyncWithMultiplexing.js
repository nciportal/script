/*eslint-env es6*/
/**
 * @author MSA
 * @purpose - for sync related socket multiplexing and its listeners
 */
'use strict';
const common		= require('./common');
const logger=common.logger;
const domain = require('domain');
const d = domain.create();
const socketioJwt = require('socketio-jwt');
/**
 * @author - MSA
 * @purpose for setting on connection of socket listeners of sync
 * @param iSocketObj - socket server object
 */
class etSyncWithMultiplexing {
	constructor() {}

	inIt(iSocketObj) {
		logger.info('In etSyncWithmultiplexing : inIt ');
		this.fSocketObj=iSocketObj;
		common.syncSockets[iSocketObj.name]= iSocketObj;

		this.fSocketObj.on('connection', socketioJwt.authorize({
			secret: common.secretkeycert,
			algorithms: 'RS256',
			timeout: 15000
		})).on('authenticated', (socket) => {
			logger.info('In etSyncWithmultiplexing : inside authenticated listener : ');
			socket.setMaxListeners(0);
			this.addEventListener(socket);
		});
	}

	addEventListener(iSocket) {
		logger.info('In etSyncWithmultiplexing : addEventListener listener :');
		let socket	=iSocket;

		/**
		 * Basic module sync listener
		 */
		socket.on('basicSyncForIndexDb', (iClientInfo, iLoadModuleObj)=>{
			try{
				logger.info(`In etSyncWithmultiplexing : addEventListener : basicSyncForIndexDb listener : ForSync :  ${iClientInfo.userId}ModuleName : ${iLoadModuleObj.loadModule}Key Type : ${iLoadModuleObj.key}`);
				d.run(()=>{
					if(iLoadModuleObj.deviceId) {
						logger.info(`In etSyncWithmultiplexing : addEventListener : basicSyncForIndexDb listener : joining room by ${iClientInfo.userId} for device in basic sync ${iLoadModuleObj.deviceId}`);
						socket.join(iLoadModuleObj.deviceId);
					}
					if(iLoadModuleObj && iClientInfo.userId) {
						let _syncModuleObject={
								moduleName: iLoadModuleObj.loadModule,
								syncTime: iClientInfo.syncTime,
								action: 'basicSync',
								socket: socket.id,
								store: 'basic',
								device: iLoadModuleObj.deviceId,
								clientInfo: iClientInfo,
								baton:iLoadModuleObj.baton,
								syncStartTime : iClientInfo.syncStartTime,
								requestId : iLoadModuleObj.requestId
						};
						if(_syncModuleObject && _syncModuleObject.baton){
							_syncModuleObject.baton.push({Location: 'etSyncWithMultiplexing_'+iLoadModuleObj.key + " : " + "node", Timestamp: new Date().getTime()});
						}
				  	if(iLoadModuleObj.key) {
							_syncModuleObject.key =iLoadModuleObj.key;
						}
						if(iClientInfo.logkey) {
							_syncModuleObject.logkey =iClientInfo.logkey;
						}
						_syncModuleObject.topic = 'INITIAL_SYNC';//MSA as its required for spark processing
						if(iLoadModuleObj.loadModule==='basic') {
							let syncKey = `${iClientInfo.userId}$$${iLoadModuleObj.deviceId}$$${iLoadModuleObj.loadModule}$$${iLoadModuleObj.key}`;
							logger.info(`In etSyncWithmultiplexing : addEventListener : basicSyncForIndexDb listener : syncKey is ${syncKey}`);
							common.queueLibs.sendToJavaProcess(_syncModuleObject, common.appConfigObj.client['mode'], null, 'INITIAL_SYNC');
						}
					}
				});
			}catch(e) {
				logger.error(`In etSyncWithMultiplexing:  addEventListener : basicSyncForIndexDb : Exception ${e.message}`);
			}
		});

		/**
		 * calendar module sync listener
		 */
		socket.on('calendarSyncForIndexDb', (iClientInfo, iLoadModuleObj)=>{
			try{
				logger.info(`In etSyncWithmultiplexing : calendarSyncForIndexDb listener : ForSync : ${iClientInfo.userId}ModuleName : ${iLoadModuleObj.loadModule}Key Type : ${iLoadModuleObj.key}`);
				
				d.run(()=>{
					if(iLoadModuleObj && iClientInfo.userId) {
						if(iLoadModuleObj.deviceId) {
							logger.info(`In etSyncWithmultiplexing : addEventListener : calendarSyncForIndexDb listener : joining room by ${iClientInfo.userId} for device in basic sync ${iLoadModuleObj.deviceId}`);
							socket.join(iLoadModuleObj.deviceId);
						}
						let _syncModuleObject={
								moduleName: iLoadModuleObj.loadModule,
								syncTime: iClientInfo.syncTime,
								action: 'calendarSync',
								store: 'calendar',
								socket: socket.id,
								device: iLoadModuleObj.deviceId,
								clientInfo: iClientInfo,
								baton:iLoadModuleObj.baton,
								syncStartTime : iClientInfo.syncStartTime,
								requestId : iLoadModuleObj.requestId
						};
						if(_syncModuleObject && _syncModuleObject.baton){
							_syncModuleObject.baton.push({Location: 'etSyncWithMultiplexing_'+iLoadModuleObj.key + " : " + "node", Timestamp: new Date().getTime()});
						}
						if(iLoadModuleObj.key) {
							_syncModuleObject.key =iLoadModuleObj.key;
						}
						if(iClientInfo.logkey) {
							_syncModuleObject.logkey =iClientInfo.logkey;
						}
						_syncModuleObject.topic = 'INITIAL_SYNC';//MSA as its required for spark processing
						let syncKey =`${iClientInfo.userId}$$${iLoadModuleObj.deviceId}$$${iLoadModuleObj.loadModule}$$${iLoadModuleObj.key}`;
						logger.info(`In etSyncWithmultiplexing : addEventListener : calendarSyncForIndexDb listener : syncKey is ${syncKey}`);

						common.queueLibs.sendToJavaProcess(_syncModuleObject, common.appConfigObj.client['mode'], null, 'INITIAL_SYNC');
					}
				});
			}catch(e) {
				logger.error(`In etSyncWithMultiplexing:  addEventListener : calendarSyncForIndexDb : Exception ${e}`);
			}
		});

		/**
		 * organization module sync listener
		 */
		socket.on('orgSyncForIndexDb', (iClientInfo, iLoadModuleObj)=>{
			try{
				logger.info(`In etSyncWithmultiplexing : orgSyncForIndexDb listener : ForSync : ${iClientInfo.userId}ModuleName : ${iLoadModuleObj.loadModule}Key Type : ${iLoadModuleObj.key}`);

				d.run(()=>{
					if(iLoadModuleObj && iClientInfo.userId) {
						try{
							logger.info(`In etSyncWithmultiplexing : orgSyncForIndexDb listener :${iClientInfo.userId}`);

							d.run(()=>{
								if(iLoadModuleObj && iClientInfo.userId) {
										if(iLoadModuleObj.deviceId) {
											logger.info(`In etSyncWithmultiplexing : addEventListener : orgSyncForIndexDb listener : joining room by ${iClientInfo.userId} for device in basic sync ${iLoadModuleObj.deviceId}`);
											socket.join(iLoadModuleObj.deviceId);
										}
										let _syncModuleObject={
												moduleName: iLoadModuleObj.loadModule,
												syncTime: iClientInfo.syncTime,
												action: 'orgSync',
												store: 'organization',
												socket: socket.id,
												device: iLoadModuleObj.deviceId,
												clientInfo: iClientInfo,
												baton:iLoadModuleObj.baton,
												syncStartTime : iClientInfo.syncStartTime,
												requestId : iLoadModuleObj.requestId
										};
										if(_syncModuleObject && _syncModuleObject.baton){
											_syncModuleObject.baton.push({Location: 'etSyncWithMultiplexing_'+iLoadModuleObj.key + " : " + "node", Timestamp: new Date().getTime()});
										}
										if(iLoadModuleObj.key) {
											_syncModuleObject.key =iLoadModuleObj.key;
										}
										if(iClientInfo.logkey) {
											_syncModuleObject.logkey =iClientInfo.logkey;
										}
										_syncModuleObject.topic = 'INITIAL_SYNC';//MSA as its required for spark processing
										let syncKey = `${iClientInfo.userId}$$${iLoadModuleObj.deviceId}$$${iLoadModuleObj.loadModule}$$${iLoadModuleObj.key}`;
										if(iLoadModuleObj.org) {
											_syncModuleObject.org = iLoadModuleObj.org;
											syncKey = `${iClientInfo.userId}$$${iLoadModuleObj.deviceId}$$${iLoadModuleObj.loadModule}$$${iLoadModuleObj.org}`;
										}
										if(iLoadModuleObj.orgId) {
											_syncModuleObject.org = iLoadModuleObj.orgId;
										}
										logger.info(`In etSyncWithmultiplexing : addEventListener : orgSyncForIndexDb listener : syncKey is ${syncKey}`);
										common.queueLibs.sendToJavaProcess(_syncModuleObject, common.appConfigObj.client['mode'], null, 'INITIAL_SYNC');
									//}
								}
							});
						}catch(e) {
							logger.error(`In etSyncWithMultiplexing:  addEventListener : calendarSyncForIndexDb : Exception ${e}`);
						}
					}
				});
			}catch(e) {
				logger.error(`In etSyncWithMultiplexing:  addEventListener : orgSyncForIndexDb : Exception ${e}`);
			}
		});


		/**
		 * media module sync listener
		 */
		socket.on('mediaSyncForIndexDb', (iClientInfo, iLoadModuleObj)=>{
			try{
				logger.info(`In etSyncWithmultiplexing : mediaSyncForIndexDb listener :ForSync :  ${iClientInfo.userId}ModuleName : ${iLoadModuleObj.loadModule}Key Type : ${iLoadModuleObj.key}`);

				d.run(()=>{
					if(iLoadModuleObj.deviceId) {
						logger.info(`In etSyncWithmultiplexing : addEventListener : mediaSyncForIndexDb listener : joining room by ${iClientInfo.userId} for device in basic sync ${iLoadModuleObj.deviceId}`);
						socket.join(iLoadModuleObj.deviceId);
					}

					if(iLoadModuleObj && iClientInfo.userId) {
						let _syncModuleObject={
								moduleName:	iLoadModuleObj.loadModule,
								syncTime:	iClientInfo.syncTime,
								action:	'mediaSync',
								socket:	socket.id,
								device: iLoadModuleObj.deviceId,
								store: 'media',
								clientInfo:	iClientInfo,
								baton:iLoadModuleObj.baton,
								syncStartTime : iClientInfo.syncStartTime,
								requestId : iLoadModuleObj.requestId
						};
						if(_syncModuleObject && _syncModuleObject.baton){
							_syncModuleObject.baton.push({Location: 'etSyncWithMultiplexing_'+iLoadModuleObj.key + " : " + "node", Timestamp: new Date().getTime()});
						}
						if(iLoadModuleObj.key) {
							_syncModuleObject.key =iLoadModuleObj.key;
						}
						if(iLoadModuleObj.folder) {
							_syncModuleObject.folder = iLoadModuleObj.folder;
						}
						if(iClientInfo.logkey) {
							_syncModuleObject.logkey =iClientInfo.logkey;
						}
						_syncModuleObject.topic = 'INITIAL_SYNC';//MSA as its required for spark processing
						if(iLoadModuleObj.loadModule==='media') {
							let syncKey = `${iClientInfo.userId}$$${iLoadModuleObj.deviceId}$$${iLoadModuleObj.loadModule}$$${iLoadModuleObj.key}`;
							logger.info(`In etSyncWithmultiplexing : addEventListener : mediaSyncForIndexDb listener : syncKey is ${syncKey}`);

							common.queueLibs.sendToJavaProcess(_syncModuleObject, common.appConfigObj.client['mode'], null, 'INITIAL_SYNC');
						}//loadmodule media condition closed swap
					}
				});
			}catch(e) {
				logger.error(`In etSyncWithMultiplexing:  addEventListener : mediaSyncForIndexDb : Exception ${e}`);
			}
		});
		/**
		 * followup module sync listener
		 */
		socket.on('followupSyncForIndexDb', (iClientInfo, iLoadModuleObj)=>{
			try{
				logger.info(`In etSyncWithmultiplexing : followupSyncForIndexDb listener : ForSync :  ${iClientInfo.userId}ModuleName : ${iLoadModuleObj.loadModule}Key Type : ${iLoadModuleObj.key}`);
				d.run(()=>{
					if(iLoadModuleObj.deviceId) {
						logger.info(`In etSyncWithmultiplexing : addEventListener : followupSyncForIndexDb listener : joining room by ${iClientInfo.userId} for device in basic sync ${iLoadModuleObj.deviceId}`);
						socket.join(iLoadModuleObj.deviceId);
					}

					if(iLoadModuleObj && iClientInfo.userId) {
						let _syncModuleObject={
								moduleName: iLoadModuleObj.loadModule,
								syncTime: iClientInfo.syncTime,
								action: 'followupSync',
								socket: socket.id,
								device: iLoadModuleObj.deviceId,
								store: 'followup',
								clientInfo: iClientInfo,
								baton:iLoadModuleObj.baton,
								syncStartTime : iClientInfo.syncStartTime,
								requestId : iLoadModuleObj.requestId
						};
						if(_syncModuleObject && _syncModuleObject.baton){
							_syncModuleObject.baton.push({Location: 'etSyncWithMultiplexing_'+iLoadModuleObj.key + " : " + "node", Timestamp: new Date().getTime()});
						}
					if(iLoadModuleObj.key) {
							_syncModuleObject.key =iLoadModuleObj.key;
						}
						if(iClientInfo.logkey) {
							_syncModuleObject.logkey =iClientInfo.logkey;
						}
						_syncModuleObject.topic = 'INITIAL_SYNC';//MSA as its required for spark processing
						if(iLoadModuleObj.loadModule==='followup') {
							let _synckey = `${iClientInfo.userId}$$${iLoadModuleObj.deviceId}$$${iLoadModuleObj.loadModule}$$${iLoadModuleObj.key}`;
							logger.info(`In etSyncWithmultiplexing : addEventListener : followupSyncForIndexDb listener : syncKey is ${_synckey}`);

							common.queueLibs.sendToJavaProcess(_syncModuleObject, common.appConfigObj.client['mode'], null, 'INITIAL_SYNC');
						}
					}
				});
			}catch(e) {
				logger.error(`In etSyncWithMultiplexing:  addEventListener : followupSyncForIndexDb : Exception ${e}`);
			}
		});//followupSyncForIndexDb closed

		/**
		 * messaging module sync listener
		 */
		socket.on('messagingSyncForIndexDb', (iClientInfo, iLoadModuleObj)=>{
			try{
				logger.info(`In etSyncWithmultiplexing : messagingSyncForIndexDb listener : ForSync :  ${iClientInfo.userId}ModuleName : ${iLoadModuleObj.loadModule}Key Type : ${iLoadModuleObj.key}`);
				
				d.run(()=>{
					//new routine
					if(iLoadModuleObj && iClientInfo.userId) {
						if(iLoadModuleObj.deviceId) {
							logger.info(`In etSyncWithmultiplexing : addEventListener : messagingSyncForIndexDb listener : joining room by ${iClientInfo.userId} for device in basic sync ${iLoadModuleObj.deviceId}`);
							socket.join(iLoadModuleObj.deviceId);
						}
						let _syncModuleObject={
								moduleName: iLoadModuleObj.loadModule,
								syncTime: iClientInfo.syncTime,
								socket: socket.id,
								action: 'messagingSync',
								store: 'messaging',
								device: iLoadModuleObj.deviceId,
								clientInfo: iClientInfo,
								baton:iLoadModuleObj.baton,
								syncStartTime : iClientInfo.syncStartTime,
								requestId : iLoadModuleObj.requestId
						};
						if(_syncModuleObject && _syncModuleObject.baton){
							_syncModuleObject.baton.push({Location: 'etSyncWithMultiplexing_'+iLoadModuleObj.key + " : " + "node", Timestamp: new Date().getTime()});
						}
							if(iLoadModuleObj.folder) {
							_syncModuleObject.folder = iLoadModuleObj.folder;
						}
						if(iClientInfo.logkey) {
							_syncModuleObject.logkey =iClientInfo.logkey;
						}
						_syncModuleObject.topic = 'INITIAL_SYNC';//MSA as its required for spark processing
						if(iLoadModuleObj.key) {
							_syncModuleObject.key =iLoadModuleObj.key;

							let _Rediskey = `${iClientInfo.userId}$$${iLoadModuleObj.deviceId}$$${iLoadModuleObj.loadModule}$$${iLoadModuleObj.key}`;
							logger.info(`In etSyncWithmultiplexing : addEventListener : messagingSyncForIndexDb listener : _Rediskey is ${_Rediskey}`);

							common.queueLibs.sendToJavaProcess(_syncModuleObject, common.appConfigObj.client['mode'], null, 'INITIAL_SYNC');
						}
					}
				});
			}catch(e) {
				logger.error(`In etSyncWithMultiplexing:  addEventListener : messagingSyncForIndexDb : Exception ${e}`);
			}
		});

		/**
		 * conversation module sync listener
		 */

		socket.on('conversationSyncForIdb', (iClientInfo, iLoadModuleObj)=>{
			try{
				logger.info(`In etSyncWithMultiplexing  : conversationSyncForIdb listener : ForSync : ${iClientInfo.userId}ModuleName : ${iLoadModuleObj.loadModule}Key Type : ${iLoadModuleObj.key}`);

				d.run(()=>{
					//new routine
					if(iLoadModuleObj && iClientInfo.userId) {
						if(iLoadModuleObj.deviceId) {
							logger.info(`In etSyncWithmultiplexing : addEventListener : conversationSyncForIdb listener : joining room by ${iClientInfo.userId} for device in basic sync ${iLoadModuleObj.deviceId}`);
							socket.join(iLoadModuleObj.deviceId);
						}

						let _syncModuleObject={
								moduleName: iLoadModuleObj.loadModule,
								syncTime: iClientInfo.syncTime,
								action: 'conversationSync',
								socket: socket.id,
								store: 'conversations',
								device: iLoadModuleObj.deviceId,
								clientInfo: iClientInfo,
								baton:iLoadModuleObj.baton,
								syncStartTime : iClientInfo.syncStartTime,
								requestId : iLoadModuleObj.requestId
						};
						if(_syncModuleObject && _syncModuleObject.baton){
							_syncModuleObject.baton.push({Location: 'etSyncWithMultiplexing_'+iLoadModuleObj.key + " : " + "node", Timestamp: new Date().getTime()});
						}
						if(iClientInfo.logkey) {
							_syncModuleObject.logkey =iClientInfo.logkey;
						}
						_syncModuleObject.topic = 'INITIAL_SYNC';//MSA as its required for spark processing
						if(iLoadModuleObj.key) {
							_syncModuleObject.key =iLoadModuleObj.key;

							let _Rediskey = `${iClientInfo.userId}$$${iLoadModuleObj.deviceId}$$${iLoadModuleObj.loadModule}$$${iLoadModuleObj.key}`;
							logger.info(`In etSyncWithmultiplexing : addEventListener : conversationSyncForIdb listener : _Rediskey is ${ _Rediskey}`);

							common.queueLibs.sendToJavaProcess(_syncModuleObject, common.appConfigObj.client['mode'], null, 'INITIAL_SYNC');
						}
					}
				});
			}catch(e) {
				logger.error(`In etSyncWithMultiplexing:  addEventListener : conversationSyncForIdb : Exception ${e}`);
			}
		});
	}

}
exports.etSyncWithMultiplexing=etSyncWithMultiplexing;