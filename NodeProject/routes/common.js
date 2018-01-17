/*eslint-env es6*/
const logger = exports.logger = require('./etLogger').Logger();
exports.Promise = require('promise');
const fs = require('fs');
const msProperties=require('./msProperties');
const appConfigObj=msProperties.appConfig;
const ConsumConfig=msProperties.ConsumObj;
const Producerconfig=msProperties.ProObj;
exports.EIPS2_USERS_PATH=appConfigObj.fs.fsPath+'/';
exports.appConfigObj 	=appConfigObj;
exports.ConsumConfig 	=ConsumConfig;
exports.Producerconfig 	=Producerconfig;
exports.domain = require('domain');
exports.kafkalibs = null;
exports.queueLibs = null;
const topicNameMapping =exports.topicNameMapping ={
		'NODETOJAVA' : 'BUSINESS_LOGIC'
}
if(appConfigObj['webServer']['sslOn']) {
	exports.secretkey= fs.readFileSync(appConfigObj.webServer.tls_key),
	exports.secretkeycert= fs.readFileSync(appConfigObj.webServer.tls_cert);
}

const store = require('./etStore');
exports.reduxBackendStore = store.makeStore();

if(appConfigObj.redisServer['cluster']) { // with redis cluster
	logger.info('In common : redisServer cluster case satsified ');
	const ioRedis		 = require('ioredis');
	const sentinalProcess	 = appConfigObj.redisSentinel;
	const snetinel 	 = [{host: sentinalProcess.host1, port: sentinalProcess.port1}];//,{ host: appConfigObj.redisServer.host, port: 26380 },{ host: appConfigObj.redisServer.host, port: 26381 }];
	if(sentinalProcess.host2 && sentinalProcess.port2) {
		snetinel.push({host: sentinalProcess.host2, port: sentinalProcess.port2});
	}if(sentinalProcess.host3 && sentinalProcess.port3) {
		snetinel.push({host: sentinalProcess.host3, port: sentinalProcess.port3});
	}
	const redisPub 	 = exports.redisPub 	=new ioRedis({//{
		sentinels: snetinel,
		name: 'mymaster',

	});
	const redisSub 	 = exports.redisSub 	=new ioRedis({//{
		sentinels: snetinel,
		name: 'mymaster',

	});
	const _cli 		 = exports.redisCli = new ioRedis({//{
		sentinels: snetinel,
		name: 'mymaster',

	});
}else{
	const ioRedis		 = require('ioredis');
	const redisPub 	 = exports.redisPub 	=new ioRedis({//{
		port: appConfigObj.redisServer.port,          // Redis port
		host: appConfigObj.redisServer.host,

	});
	const redisSub 	 = exports.redisSub 	=new ioRedis({//{
		port: appConfigObj.redisServer.port,          // Redis port
		host: appConfigObj.redisServer.host,

	});
	const _cli 		 = exports.redisCli = new ioRedis({//{
		port: appConfigObj.redisServer.port,          // Redis port
		host: appConfigObj.redisServer.host,

	});
}
exports.syncSockets = {};
exports.iotSockets = {};
exports.kconsumer = null;
exports.kproducer =null;
exports.callbacks = {}; // object for saving callbacks in SOA MSA
exports.deviceSockets ={};
exports.serverSockets ={};