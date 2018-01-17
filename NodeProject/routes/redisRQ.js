'use strict';
const common=require('./common');
const logger=common.logger;
const appConfigObj = common.appConfigObj;
if(appConfigObj.redisServer.hasOwnProperty('cluster')){
const sentinalProcess	 = common.appConfigObj.redisSentinel;
const snetinel 	 = [{ host: sentinalProcess.host1, port: sentinalProcess.port1 }];
if(sentinalProcess.hasOwnProperty('host2') && sentinalProcess.hasOwnProperty('port2')){
	snetinel.push({ host: sentinalProcess.host2, port: sentinalProcess.port2 });
}if(sentinalProcess.hasOwnProperty('host3') && sentinalProcess.hasOwnProperty('port3')){
	snetinel.push({ host: sentinalProcess.host3, port: sentinalProcess.port3 });
}
const options = {
         endpoints : snetinel,
         sentinelName:'mymaster'
     };
const Catbox = require('catbox')
, catboxRedis = require('catbox-redis',options);
var redisClient = new Catbox.Client(catboxRedis ,{partition : 'monsoonstorm',endpoints : snetinel});
}else{
	const options = {
	         host: common.appConfigObj.redisServer.host,                   // If you don't supply, 127.0.0.1 is the default
	         port: common.appConfigObj.redisServer.port, 
	     };
	const Catbox = require('catbox')
	, catboxRedis = require('catbox-redis',options);
	var redisClient = new Catbox.Client(catboxRedis ,{partition : 'monsoonstorm',host: common.appConfigObj.redisServer.host, port: common.appConfigObj.redisServer.port });
}

class redisQueue{
	constructor(iDbstore){
		this.dbStore = iDbstore;
	}
	/**
	 * Save data in redis
	 */
	saveSessionInRedis(iUserId , iDevice , iDataKey , idata , iCallBack){
		try{
			logger.info("In redisRQ : saveSessionInRedis ");
			let _mainKey = {} , _key = {};
		
		_mainKey.id = "KEYS/"+iUserId+"/"+iDevice;
		let _that = this;
		redisClient.start((ierr)=>{
				if (ierr) {
					logger.error('In redisRQ : saveSessionInRedis  : Exception : Unable to start redisclient in saveSessionInRedis'+ierr);
					logger.error(redisClient);
					if(iCallBack)iCallBack(false);	
					
				}else{
					if(iDataKey)
					{ 
						_key.id  = iDataKey;
						_key.segment = iUserId+":"+iDevice;//iDeviceId;
						_mainKey.segment = iUserId+":"+iDevice;
					}else{ 
						
						_key.id  = _that.dbStore.getUniqueId(_that.userUID);
						_key.segment = 'temp';
						_mainKey.segment = 'temp';
					}  
					redisClient.get(_mainKey ,(ier , iCached)=>{
						if(iCached && iCached.item.length > 0){
							let _existArr = [];
							_existArr = _existArr.concat(iCached.item);
							_existArr.push(iDataKey);
							logger.info(_existArr);
							redisClient.drop(_mainKey ,(err)=>{
								if(!err){
									redisClient.set(_mainKey , _existArr , 3600000 ,(err)=>{
										logger.error(err);
										if(!err){
											if(iCallBack)iCallBack(true);	
										}
										else
											{
											redisClient.set(_key , idata , 600000 ,(ierr)=>{
												if(!ierr)
													if(iCallBack)iCallBack(true);
												else
													if(iCallBack)iCallBack(false);
											});
											}	
									});
								}else{
									if(iCallBack)iCallBack(false);	
								}
							});
						}else{
							let arr = [];
							arr.push(iDataKey);
			    			redisClient.set(_mainKey ,arr , 3600000 ,(err)=>{
			    				if(err)
								{	if(iCallBack)iCallBack(false);
								}
								else
								{
									redisClient.set(_key , idata , 600000 ,(ierr)=>{
										
										if(!ierr)
											if(iCallBack)iCallBack(true);
										else
											if(iCallBack)iCallBack(false);
									});
								}
							});
						}
					});
				}
		});
		}catch(e){
			logger.error('In redisRQ : saveSessionInRedis  : Exception  : ',e);
		}
	}
}

module.exports=redisQueue;