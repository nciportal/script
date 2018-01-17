/**
 * @author MSA
 * 13 th April 2015
 * for kafka producer consumer interfaces and functionality
 */
/*eslint-env es6*/
"use strict";
const common=require('./common');
const logger=common.logger;
const loggerkafka = require('./etLogger').kafkaLogger();
let sentMessage = {};
let receiveMessage = {};
let consumConfigObj=common.ConsumConfig;
let producerconfigObj=common.Producerconfig;
let kafkaPartition=consumConfigObj.partition;
const LoginObj	=require('./etLogin').Login;
const Login		=new LoginObj();
let Kafka = null;

if(common.appConfigObj.client['kafka']) {
	Kafka = require('no-kafka');
}
const d = common.domain.create();
const DBStore 	= require('./etDbStore');
const dbStore = new DBStore.dbStore();

class kafkaLib {
	constructor() {
	}

	/**
	 * @author MSA
	 * function written for starting kafka clients for developer's machine
	 * @param iCb
	 */
	initKafkaDeveloper() {
		logger.info('In etKafka : initKafkaDeveloper ');
		loggerkafka.info('In etKafka : initKafkaDeveloper ');
		common.kproducer = common.kafkalibs.createProducer(common.appConfigObj.webServer.serverName+'_producer');
		common.kafkalibs.createHighLevelConsumer(common.appConfigObj.webServer.serverName+'_consumer');
	}

	/**
	 * @author MSA
	 * function written starting kafka at servers
	 * @param iCb
	 */

	initKafka() {
		logger.info(' In etKafka : initKafka  ', common.appConfigObj.webServer.serverType);
		loggerkafka.info(' In etKafka : initKafka  ', common.appConfigObj.webServer.serverType);
		try{
			if(common.appConfigObj.webServer.serverType !== 'CONSUMER') {
				common.kproducer = common.kafkalibs.createProducer(common.appConfigObj.webServer.serverName+'_producer');
			}else{
				common.kafkalibs.createHighLevelConsumer(common.appConfigObj.webServer.serverName+'_consumer');
			}
		}catch(e) {
			logger.error('In etKafka : initKafka  : Exception : ', e);
			loggerkafka.error('In etKafka : initKafka  : Exception : ', e);
		}
	}

	/**
	 * @author MSA
	 * function to create high level kafka producer
	 * @param iCreateProducerCB
	 * @param return kafka producer or send it in callback

	 */
	createProducer(iProducerid) {
		logger.info('In etkafka : createProducer ', iProducerid);
		loggerkafka.info('In etkafka : createProducer ', iProducerid);
		try{
			return new Kafka.Producer({
				clientId: iProducerid,
				connectionString: producerconfigObj.bootstrapServers,
				retries: {attempts: 5, },
				codec: Kafka.COMPRESSION_GZIP,
				batch: {size:producerconfigObj.batchSize},
				reconnectionDelay: {
					min: 1000,
					max: 3000,
				},
				logger: {
					logLevel: 1, // 0 - nothing, 1 - just errors, 2 - +warnings, 3 - +info, 4 - +debug, 5 - +trace
				},
			});
		}catch(e) {
			logger.error('Exception catched  in etkafka : createProducer :', e);
			loggerkafka.error('Exception catched  in etkafka : createProducer :', e);
		}
	}

	/**
	 * @author MSA
	 * @purpose producing message via node producer
	 * @param iTopic - topic on which message to be produced
	 * @param iMessage - message to be sent
	 * @param iSendmsgCB - callback function
	 */
	sendMessage(iTopic, iMessage, iSendmsgCB) {
		loggerkafka.info('In sendMessage : ');
		d.run(()=>{
			const time = new Date().getTime();
			const timeStr = ''+time+'';
			if(typeof iMessage !== 'string') {
				if(iMessage.baton) {
					iMessage.baton.push({
						Location: 'etKafka_producer_sendMessage:node',
						Timestamp: new Date().getTime(),
					});
					logger.info('In etKafka : sendMessage : baton : ', iMessage.baton);
				}
				iMessage = JSON.stringify(iMessage);
			}else{
				iMessage = JSON.parse(iMessage);
				if(iMessage.baton) {
					iMessage.baton.push({
						Location: 'etKafka_producer_sendMessage:node',
						Timestamp: new Date().getTime(),
					});
					logger.info('In etKafka : sendMessage : baton : ', iMessage.baton);
				}
				iMessage = JSON.stringify(iMessage);
			}
			
			if(!iTopic) {
				iTopic ='NODETOJAVA';
			}
			let partition; 
			if(common.appConfigObj.partition && common.appConfigObj.partition[iTopic]){
				partition= Math.floor(Math.random() * common.appConfigObj.partition[iTopic]);
			}else{
				partition = Math.floor(Math.random() * kafkaPartition);
			}
			logger.info('partition  : ',partition,"topic : ",iTopic);
			const sendmsg = ()=>{
				return common.kproducer.init().then(() =>{
					common.kproducer.send({
						topic: iTopic,
						partition: partition,
						message: {
							key: timeStr,
							value: iMessage,
						},
					}).then((result)=>{
						if(result && result[0] && result[0]['error']) {
							logger.error('This is error messaage : producer failed in producing  ', timeStr);
							loggerkafka.error('This is error messaage : producer failed in producing  ', timeStr);

							if(iSendmsgCB) {
								iSendmsgCB( result[0]['error'], result);
							}
						}						else{
							const _parsedMessage=iMessage;//JSON.parse(iMessage);
							let _objProduced={};

							if(_parsedMessage && _parsedMessage.hasOwnProperty('insertObj') && _parsedMessage.insertObj.dataArray.hasOwnProperty(0)){
								logger.info('In etKafka : sendMessage :insert request produced at kafka successfully for user', _parsedMessage.clientInfo.userId);
								loggerkafka.info('In etKafka : sendMessage :insert request produced at kafka successfully for user', _parsedMessage.clientInfo.userId);

								_objProduced={
										id: _parsedMessage.insertObj.dataArray[0].CML_ID,
										title: _parsedMessage.insertObj.dataArray[0].CML_TITLE,
								};
								logger.info('In etKafka : sendMessage : successfully produced request OBJ : request time in insert request: ',_objProduced);
								loggerkafka.info('In etKafka : sendMessage : successfully produced request OBJ : request time in insert request: ',_objProduced);
							}else if(_parsedMessage && _parsedMessage.hasOwnProperty('updateObj') && _parsedMessage.updateObj.dataArray.hasOwnProperty(0) && _parsedMessage.updateObj.dataArray[0].hasOwnProperty('CON_PARAM')) {
								logger.info('In etKafka : sendMessage : update request produced at kafka successfully for user', _parsedMessage.clientInfo.userId);
								loggerkafka.info('In etKafka : sendMessage : update request produced at kafka successfully for user', _parsedMessage.clientInfo.userId);

								_objProduced={
										id: _parsedMessage.updateObj.dataArray[0].CON_PARAM.PKVAL,
								};
								if(_parsedMessage.updateObj.dataArray[0].hasOwnProperty('ACTION_ARRAY') && _parsedMessage.updateObj.dataArray[0].ACTION_ARRAY.hasOwnProperty(0)) {
									logger.info('In etKafka : sendMessage:update case got the action from frontend', _parsedMessage.updateObj.dataArray[0].ACTION_ARRAY[0]);
									loggerkafka.info('In etKafka : sendMessage:update case got the action from frontend', _parsedMessage.updateObj.dataArray[0].ACTION_ARRAY[0]);

									_objProduced.action =_parsedMessage.updateObj.dataArray[0].ACTION_ARRAY[0];
								}
								
								logger.info('In etKafka : sendMessage : successfully produced request OBJ : request time in update request:');
								loggerkafka.info('In etKafka : sendMessage : successfully produced request OBJ:request time in update request:');
							}else{
								logger.info('In etKafka : sendMessage : _parsedMessage clientInfo is ');
								loggerkafka.info('In etKafka : sendMessage : _parsedMessage clientInfo is ');

								if(_parsedMessage && _parsedMessage.hasOwnProperty('key') && _parsedMessage.hasOwnProperty('moduleName') && _parsedMessage.hasOwnProperty('clientInfo') && _parsedMessage.clientInfo.hasOwnProperty('userId')) {
									_objProduced ={
											key: _parsedMessage.key,
											moduleName: _parsedMessage.moduleName,
											userId: _parsedMessage.clientInfo.userId,
											deviceId: _parsedMessage.device,
									};
									logger.info('In etKafka : sendMessage : successfully produced sync request OBJ :request time in sync request:');
								}
								}
							logger.info(' Successfully produced message !!!! ', result, 'Key is '+timeStr);
							loggerkafka.info(' Successfully produced message !!!! ', result, 'Key is '+timeStr);
							if(sentMessage && !sentMessage[iTopic]) {
								sentMessage[iTopic] = 1;
							}else{
								sentMessage[iTopic] = sentMessage[iTopic] + 1;
							}
							loggerkafka.info(' Total message produced by this producer are !!!! ', sentMessage[iTopic], ' for topic '+iTopic+' At time '+new Date());
							// MSA added for same log key
							if(_parsedMessage['logkey']) {
								logger.info(' STEP : 2 :LOG AT KAFKA SUCCESSFULLY PRODUCED : FOR ID '+_parsedMessage['logkey']);
								loggerkafka.info(' STEP : 2 :LOG AT KAFKA SUCCESSFULLY PRODUCED : FOR ID '+_parsedMessage['logkey']);
							}
						}
					});
				}).then((result)=>{
					if(iSendmsgCB) {
						iSendmsgCB( null, result);
					}
				});
			};
			sendmsg();
		});
	}

	/**
	 * @author MSA
	 * function to create kafka consumer
	 * @param iCreateconsumerCB
	 * @param return kafka consumer or send it in callback

	 */
	createHighLevelConsumer(iConsumerid ) {
		try{
			const Promise = require('bluebird');
			const consumer = new Kafka.GroupConsumer({
				groupId: 'NODEKAFKA',
				maxBytes: consumConfigObj.fetchMessageMaxBytes, //1024*1024*100
				minBytes: consumConfigObj.fetchMessageMinBytes,
				connectionString: consumConfigObj.brokers,
				sessionTimeout:consumConfigObj.zookeeperSessionTimeoutMs,  //30000
				clientId: iConsumerid,
				reconnectionDelay: {
					min: consumConfigObj.reconnectionDelayMin,
					max: consumConfigObj.reconnectionDelayMin,
				},
			});
			let dataHandler = (messageSet, topic, partition) => {
				return Promise.each(messageSet,(m)=>{
					logger.info('In etKafka : kafka message received : offset is '+m.offset+' partition is '+partition+' topic is '+topic);
					loggerkafka.info('In etKafka : kafka message received : offset is '+m.offset+' partition is '+partition+' topic is '+topic);

					const messge = m.message.value.toString('utf8');

					// commit offset
					common.kafkalibs.processConsumerData(topic, messge);
					// commit offset
					if(receiveMessage && !receiveMessage[topic]) {
						receiveMessage[topic] = 1;
					}else{
						receiveMessage[topic] = receiveMessage[topic] + 1;
					}
					loggerkafka.info(' Total message received by this consumer are !!!! ', receiveMessage, ' for topic '+topic+' At time '+new Date());

					return consumer.commitOffset({topic: topic, partition: partition, offset: m.offset, metadata: 'optional'});
				});
			};

			const topics=consumConfigObj.nodetopiclist;
			const topicList = topics.split(",");

			const strategies = [{
				strategy: 'TestStrategy',
				subscriptions:  topicList,
				handler: dataHandler,
			}];

			consumer.init(strategies);
			common.kconsumer = consumer;
		}catch(e) {
			logger.error('In etKafka : createHighLevelConsumer : Exception catched :', e);
			loggerkafka.error('In etKafka : createHighLevelConsumer : Exception catched :', e);
		}
	}

	/**
	 * @author MSA
	 * @date 30- 4-15
	 * function to create kafka consumer and producer for node js
	 * @param iinitkCB
	 * @param

	 */
	processConsumerData(iTopic, iData) {
		try{
			logger.info('In processConsumerData   ', iTopic);
			let datareceived = iData;
			if(typeof iData === 'string') {
				try{
					datareceived = JSON.parse(iData);
					if(datareceived.hasOwnProperty('data') && datareceived.data.hasOwnProperty('baton')){
						datareceived.data.baton.push({
							Location: 'etKafka_consumer : node',
							Timestamp: new Date().getTime(),
						});
						logger.info('In etKafka : processConsumerData : baton :', datareceived.data.baton);
					}
				}catch(e) {
					logger.error('Unable to parse received data on topic ', iTopic, ' wrong data is ', e.message);
				}
			}
			logger.info('In etkafka :processConsumerData : received data timestamp  : ', new Date().toJSON());
			loggerkafka.info('In etkafka :processConsumerData : received data timestamp  : ', new Date().toJSON(), ' on topic ', iTopic);
			if(datareceived.hasOwnProperty('baton')) {
				datareceived.baton.push({
					Location: 'etKafka_consumer : node',
					Timestamp: new Date().getTime(),
				});
				logger.info('etKafka_Consumer.etKafka_ConsumerclientToServerSyncAck', datareceived.baton);
			}

			if(datareceived && datareceived.hasOwnProperty('requestId') || datareceived.hasOwnProperty('logkey')){
             let reqKey=datareceived.requestId || datareceived.logkey;
			 common.redisCli.get(reqKey, function(err, reply) {
				if(reply){
					 logger.info("Redis key Found : ",reqKey," value :",reply);
					 common.redisCli.del(reqKey,function(err,res){
						 if(res==1)
						 logger.info("Key deleted",reqKey);
					 });
				}
			});
			}
			
			
			switch(iTopic) {
			case 'SERVER_DIFF_SYNC_NODE' :
				if(datareceived.hasOwnProperty('logkey')) {
					logger.info(' STEP : 8 :LOG AT NODE - SERVER_DIFF_SYNC_NODE SUCCESSFULLY RECEIVED : FOR ID '+datareceived.logkey+' USER '+datareceived.userId);
				}
				switch(datareceived.action){
				case 'COMPLETE_INCREMENT':
					logger.info('In etKafka :nodeConsumer : on message listener : received data timestamp COMPLETE_INCREMENT : ', new Date().toJSON());
					let _syncModuleObject = {};
					_syncModuleObject.clientInfo={'userId': datareceived.userId};
					_syncModuleObject.moduleName='Basic';
					_syncModuleObject.key='WKS';
					datareceived.data = _syncModuleObject;

					const _sockObj = common.serverSockets.connected[datareceived.socketId];
					if(_sockObj)_sockObj.emit('COMPLETE_INCREMENT', datareceived.data);
					break;

				case 'SET_VERSION':
					logger.info('In etKafka :nodeConsumer : on message listener : received data timestamp  SET_VERSION : ', new Date().toJSON());
					common.serverSockets.to(datareceived.user).emit('setVersion', datareceived);
					break;

				default:
					if(datareceived.data == null || datareceived.data == 'null') {
						common.serverSockets.to(datareceived.socketId).emit(datareceived.action, datareceived);
					}else{
						if(datareceived.hasOwnProperty('data') && datareceived.data.length > 0) {
							for(let i = 0; i < datareceived.data.length; i++) {
								const _thisData = datareceived.data[i];
								if(datareceived.hasOwnProperty('socketId')) {
									common.serverSockets.to(datareceived.socketId).emit('serverToClientIDBIncSync', _thisData);
								}else{
									common.serverSockets.to(datareceived.user).emit('serverToClientIDBIncSync', _thisData);
								}
							}
						}
						datareceived.data = true;
						common.serverSockets.to(datareceived.socketId).emit(datareceived.action, datareceived);
					}
				break;
				}
				break;

			case 'INITIAL_SYNC_NODE' :
				logger.info('iTopic  '+iTopic);
				logger.info('In etKafka :nodeConsumer : on message listener : received data timestamp INITIAL_SYNC_NODE : ', new Date().toJSON());
				if(datareceived.syncModule.clientInfo.hasOwnProperty('userId')) {
					if(datareceived && datareceived.hasOwnProperty('syncModule') && datareceived.syncModule.hasOwnProperty('baton')) {
						logger.info('In etKafka :nodeConsumer : on message listener : received data : ForSync : UserId : ', datareceived.syncModule.clientInfo.userId, 'ModuleName : ', datareceived.loadModule, 'KeyType : ', datareceived.syncModule.key);
						datareceived.syncModule.baton.push({Location: 'kafka_consumer_INITIAL_SYNC_NODE : node', Timestamp: new Date().getTime()});
					}else{
						logger.info('In etKafka  : processConsumerData : INITIAL_SYNC_NODE : baton is not present in object');
					}
				}
				if(datareceived.hasOwnProperty('syncModule') && datareceived.syncModule.hasOwnProperty('clientInfo') && datareceived.syncModule.clientInfo.hasOwnProperty('userId')) {
					const device =datareceived.syncModule.device;
					const _SyncType = datareceived.syncModule.action;
					if(datareceived.syncModule.moduleName === 'organization') {
						datareceived.action = 'orgSync';
						datareceived.Finalaction = 'orgSyncCallback';
					}
					const _sockObj = common.syncSockets['/'+_SyncType];
					if(datareceived.hasOwnProperty('chunk')) {
						logger.info('chunk is sent ');
						if(_sockObj) {
							logger.info('action : ', datareceived.action);
							datareceived.syncModule.baton.push({Location: 'etKafka_emit : node', Timestamp: new Date().getTime()});
							_sockObj.to(device).emit(datareceived.action, JSON.stringify(datareceived.data));
						}
					}else{
						if(_sockObj) {
							logger.info('action : ', datareceived.action);
							_sockObj.to(device).emit(datareceived.action, JSON.stringify(datareceived.data));
							if(datareceived.hasOwnProperty('Finalaction')) {
								logger.info('final action: ', datareceived.Finalaction);
								datareceived.syncModule.baton.push({Location: 'etKafka_emit_finalAction : node', Timestamp: new Date().getTime()});
								_sockObj.to(device).emit(datareceived.Finalaction, datareceived.syncModule);
							}
						}
					}
				}
				break;
			case 'BROADCAST':
				if(datareceived.hasOwnProperty('baton')){
					datareceived.baton.push({Location: 'etKafka_BROADCAST : node', Timestamp: new Date().getTime()});
					logger.info('In etKafka :  broadcast baton   : ' ,datareceived.baton);
				}else{
					let baton = [];
					datareceived.baton = baton;
					datareceived.baton.push({Location: 'etKafka_BROADCAST : node', Timestamp: new Date().getTime()});
					logger.info('In etKafka :  broadcast baton   : ' ,datareceived.baton);
				}
				if(datareceived.hasOwnProperty('userId')) {
					logger.info('In etKafka :  broadcast topic  : ');
						let user = null;
                    	user = datareceived.userId;
					if(datareceived.hasOwnProperty('ack')) {
						common.serverSockets.to(datareceived.socketId).emit('clientToServerSyncAck', JSON.stringify(datareceived));
					}else{
						common.serverSockets.to(user).emit('serverToClientIDBIncSync', JSON.stringify(datareceived));
					}
				}else{
					logger.error("userId is not present in object ...");
					logger.error(iData);
				}
				break;
 
			case 'CLZ_LOGIN_RESPONSE' : 	
			case 'LOGIN_RESPONSE':
				const iData1 = JSON.parse(iData);
				if(iData1.hasOwnProperty('baton')){
					iData1.baton.push({Location: 'etKafka_LOGIN_RESPONSE : node', Timestamp: new Date().getTime()});
					logger.info("In etKafka : Login Response baton :" , iData1.baton);
				}else{
					let baton = [];
					iData1.baton = baton;
					iData1.baton.push({Location: 'etKafka_LOGIN_RESPONSE : node', Timestamp: new Date().getTime()});
					logger.info("In etKafka : Login Response baton :" , iData1.baton);
				}
				const _sockObjLogin = common.syncSockets['/login'];
			    if(iData1.ACTION_ARRAY.hasOwnProperty(0)){
				const action_array=iData1.ACTION_ARRAY[0];
				switch(action_array) {
				case 'FORCE_LOGIN':
				case 'MOBILE_LOGIN':
				case 'NEW_HUB_REGISTER':
				case 'HUB_LOGIN':
				case 'LOGIN' : Login.login(iData1, _sockObjLogin);
				break;
        
				case 'HUB_REGISTER':
					common.serverSockets.to(iData1.USER_ID).emit('LoginResponce', iData1);
				break;
				
				case 'CHECK_USER' : Login.checkUser(iData1,_sockObjLogin);
				break;

				case 'FORGOT_PASSWORD' :
				case 'VERIFY_USER':	
					            Login.forgotPassword(iData1, _sockObjLogin);
				break;
				
				case 'CHANGE_PASSWORD_1':
				case 'CHANGE_PASSWORD' :Login.changePassword(iData1, _sockObjLogin);
				break;
            
				case 'SETTING_CHANGE_PASSWORD' : 
				common.serverSockets.to(iData1.username).emit('serverToClientIDBIncSync', datareceived);
				break;
					
				case 'REGISTER' : Login.registerUser(iData1,_sockObjLogin);
				break;
				
				case 'UPDATE_PROFILE': Login.updateProfile(iData1,_sockObjLogin);
				break;
				
				case 'AUTO_REGISTER':Login.nonClouzerRegister(iData1, _sockObjLogin);
				break;
				
				case 'ERROR' : 
					if(iData1.CHANGE_PASSWORD_FLAG != false){
						_sockObjLogin.to(iData1.socketId).emit('LoginResponce', iData1);
					}else{
						common.serverSockets.to(iData1.socketId).emit('serverToClientIDBIncSync', datareceived);
					}
				}
			    }else{
					logger.info("In etKafka : Login Response : ACTION_ARRAY[0] is not present : ",iData1);
			    }
				break;

			default:
				if(datareceived.hasOwnProperty('action')) { //DAB -  data is coming when broadcasting to client
					logger.info('In etKafka :nodeConsumer : on message listener : received data timestamp else case : ', new Date().toJSON());
					
					if(datareceived.hasOwnProperty('data') && datareceived.data.hasOwnProperty('logkey')) {
						logger.info(' STEP : 6 :LOG AT NODE - KAFKA SUCCESSFULLY RECEIVED : FOR ID '+datareceived.data.logkey+' USER '+datareceived.user);
					}
					if(datareceived.action === 'clientToServerSyncAck') {
						if(datareceived.hasOwnProperty('socketId')){
							common.serverSockets.to(datareceived.socketId).emit('clientToServerSyncAck', datareceived.data);
						}
					}
					switch(datareceived.action){
					case 'WEEKSCHEDULE':
						common.serverSockets.to(datareceived.clientInfo.userId).emit('newschedule', datareceived.data);
						break;
					case 'executeCallback':
						const cbId = datareceived.callbackId;
						if(common.callbacks[cbId]) {
							common.callbacks[cbId]();
						}
						break;
						
					case 'clouzerToHub':
						if(datareceived && datareceived.hasOwnProperty('deviceId')){
							common.deviceSockets.to(datareceived.deviceId).emit('clouzerToHub',JSON.stringify(datareceived));
						}else{
							logger.error("In Object deviceId is not present :",datareceived);
						}
						break;

					case 'ONDEMAND':
						common.serverSockets.to(datareceived.clientInfo.userId).emit('onDemandReceive', JSON.stringify(datareceived));
						break;	

					case 'ErrorFromServer':
						if(datareceived.hasOwnProperty('socketId'))
							common.serverSockets.to(datareceived.socketId).emit('ErrorFromServer', JSON.stringify(datareceived.data));
						else if (datareceived.hasOwnProperty('user'))
							common.serverSockets.to(datareceived.user).emit('ErrorFromServer', JSON.stringify(datareceived.data));
						break;	

					case 'serverToClientIDBIncSync':
						if(datareceived.hasOwnProperty('socketId'))
							common.serverSockets.to(datareceived.socketId).emit('serverToClientIDBIncSync', JSON.stringify(datareceived.data));
						else if (datareceived.hasOwnProperty('user'))
							common.serverSockets.to(datareceived.user).emit('serverToClientIDBIncSync', JSON.stringify(datareceived.data));
						break;
					
					default:
						if(datareceived.hasOwnProperty('socketId') && common.serverSockets.connected[datareceived.socketId]) {
							const _sockObj = common.serverSockets.connected[datareceived.socketId];
							if(_sockObj)
								_sockObj.broadcast.to(datareceived.user).emit(datareceived.action, JSON.stringify(datareceived.data));
						}else if (datareceived.hasOwnProperty('socketId') && !datareceived.hasOwnProperty('data')) {
								if( common.deviceSockets.connected[datareceived.socketId]) {
								const _sockObjdev = common.deviceSockets.connected[datareceived.socketId];
								_sockObjdev.emit(datareceived.action, datareceived);
							}else{
								common.deviceSockets.to(datareceived.deviceId).emit(datareceived.action, JSON.stringify(datareceived));
							}
							common.serverSockets.to(datareceived.user).emit(datareceived.action, JSON.stringify(datareceived));
						}else{
							let _obj = {};
							_obj.msg		 = JSON.stringify(datareceived.data);
							_obj.sock 		 = null;
							_obj.sender 	 = datareceived.user;
							_obj.listener 	 = datareceived.action;
							if(datareceived.hasOwnProperty('socketId')) {
								_obj.sock = datareceived.socketId;
							}
							dbStore.emitOnSubListener(datareceived.user, _obj);
						}

					break;
					}

				}else{
					common.queueLibs.sendToJavaProcess(datareceived, common.appConfigObj.client['mode']);// DAB - in case of multiple objects in dataarray so producing request again to java
				}
			break;
			}
		}catch(e) {
			logger.error('In etKafka : processConsumerData : Exception catched ', e);
		}
	}
}

module.exports=kafkaLib;