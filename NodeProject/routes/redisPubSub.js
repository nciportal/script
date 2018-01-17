/**
 * @author MSA
 * for redis pub sub functionality
 */
var redis = require('redis');
var common=require('./common'),
logger=common.logger,
request_Req		 = require('request');
var _redisCL = null;
if(common.appConfigObj.redisServer.cluster)
 _redisCL 	 = common.appConfigObj.redisServer.cluster;
var redisHost 	 = common.appConfigObj.redisServer.host;
var redisPort    = common.appConfigObj.redisServer.port;
function redisPubSub(){
	return this;
};

redisPubSub.prototype={
		constructor:redisPubSub
};
/**
 * @author MSA
 * @param iUserid - user whose channel to be subscribed
 * @param iChannelName
 * @param iRedisCli - RedisClient
 * @param iSubCallback
 */
redisPubSub.prototype.subscribeChannel = function ( iUserid , iChannelName ,iRedisCli,  iSubCallback){
	try{
		logger.info("In redisPubSub : subscribeChannel ");
		var _ch = iUserid+'#'+iChannelName;
		var rCli = iRedisCli;
		if(_ch && rCli){
			rCli.subscribe(""+_ch+"");
			logger.info("In redisPubSub : subscribeChannel : iUserid "+iUserid+" subscribeed  "+_ch);
		}
		if(iSubCallback){
			return iSubCallback();
		}
	}catch(e){
		logger.error('In redisPubSub : subscribeChannel : Exception',e.message);
	}
};

/**
 * @author MSA
 * @param iUserid - user whose channel to be unsubscribed
 * @param iChannelName
 * @param iRedisCli - RedisClient
 * @param iSubCallback
 */
redisPubSub.prototype.unSubscribeChannel = function ( iUserid , iChannelName ,iRedisCli,  iunSubCallback){
	try{
		logger.info("In redisPubSub : unSubscribeChannel ");
		var _ch = iUserid+'#'+iChannelName;;
		var rCli = iRedisCli;

		if(_ch && rCli){
			rCli.unsubscribe(""+_ch+"");
			logger.info("In redisPubSub : unSubscribeChannel : iUserid "+iUserid+" unsubscribeed  "+_ch);
		}
	if(iunSubCallback)iunSubCallback();
	}catch(e){
		logger.error('In redisPubSub : unSubscribeChannel : Exception : ',e.message);
	}
};

/**
 * @author MSA
 * @param iSocket - from which socket func is called
 * @param iChannelName - channel on which message to be emitted
 * @param iListenerName - socket listener
 * @param iMesg - message to be published
 * iClientInfo - userId 
 */
redisPubSub.prototype.publishMsgByChannel = function (iSocket , iChannel ,iListenerName,iMesg ,iClientInfo, iRediccli ,  iPubCallback){
	try{
		logger.info("In redisPubSub : publishMsgByChannel ");
		if(iRediccli && iChannel && iMesg){
			var _chtmsg = iMesg;
			var _obj = {};
			_obj.msg = _chtmsg;
			_obj.sock = iSocket;
			_obj.sender = iClientInfo.userId;
			_obj.listener=iListenerName;
			var _msge = JSON.stringify(_obj);
			var _channel = _obj.sender+'#'+iChannel;
			iRediccli.publish(_channel ,_msge,function(ierr , ireply){
				
				if(iPubCallback){
					return iPubCallback(ireply);
				}
			});
		}
	}catch(e){
		logger.error('In redisPubSub : publishMsgByChannel : Exception : ',e.message);
	}
};
/**
 * @author MSA
 * @param iUserId - from which socket func is called
 * 
 * @param rediCli -from whom channel to be unsubscribed.
 * internally func calls unSubscribeChannel 
 */

redisPubSub.prototype.disconnectRedis = function(iUserId , rediCli){
	logger.info("In redisPubSub : disconnectRedis : iUserId is :  ",iUserId);
	try{
	var _that = this;
	_that.unSubscribeChannel(iUserId , iUserId , rediCli , null);
	
	}catch(e){
		logger.error('In redisPubSub : disconnectRedis  : Exception : ',e);
	}
};
/**
 * @author MSA
 * @param iuserId - user tobe shown online
 * @param iDeviceid 
 * @param iData - data to be store in redis
 * @param iCalBk -callabck
 */
redisPubSub.prototype.setUserOnline  = function(iuserId , iDeviceid , iData , onlineStatus, iCalBk){
	try{
		logger.info("In redisPubSub : setUserOnline : iUserId is :  ",iuserId);
		
		common.redisCli.get(iuserId, function(err, reply) {
		    // reply is null when the key is missing
			if(reply){
				var rply=reply;
				if(typeof reply == 'string'){
					 rply=JSON.parse(reply);
				}
				
				if(rply.status){
					iData.status = onlineStatus;
				}else{
					iData.status =onlineStatus ;
				}
			}else{
				iData.status = onlineStatus;
			}
			if(iData){
					common.redisCli.set(iuserId,JSON.stringify(iData), redis.print);
				    common.redisCli.persist(iuserId);
			}
			
		    if(iCalBk){
		    	return iCalBk();
		    }
		});

	}catch(e){
		logger.error('In redisPubSub : setUserOnline : Excpetion : ',e);
	}
};

/**
 * @author MSA
 * @param iuserId - userId to be removd from redis 
 * @param iSOcketid
 * @param iData -- data to be store in redis
 * @param iCalBk
 */
redisPubSub.prototype.removeOnlineUser  = function(iuserId , iSOcketid , iData , iCalBk){
	try{
		logger.info("In redisPubSub : removeOnlineUser : iuserId is :  ",iuserId);
		var _that = this,status = null;
		
		common.redisCli.get(iuserId, function(err, reply) {
		    // reply is null when the key is missing
			if(reply){
				if(iData){
					if(Object.keys(iData).length === 1){
						if(_redisCL){
							common.redisCli.del(iuserId,redis.print);
							common.redisCli.del(iuserId+"#EASYRTCID",redis.print);
						}else{
							common.redisCli.del(iuserId,redis.print);
							common.redisCli.del(iuserId+"#EASYRTCID",redis.print);
						}
						
						status = '2';
					}else{
						if(reply.status){
							iData.status = reply.status;
							status = reply.status;
						}else{
						}
							
						common.redisCli.set(iuserId,JSON.stringify(iData), redis.print);
						common.redisCli.persist(iuserId);
					}
					if(iCalBk)iCalBk(status);
				}else{	
					if(_redisCL){
						common.redisCli.del(iuserId,redis.print);
						common.redisCli.del(iuserId+"#EASYRTCID",redis.print);
					}else{
						common.redisCli.del(iuserId,redis.print);
						common.redisCli.del(iuserId+"#EASYRTCID",redis.print);
						
					}
			    	if(iCalBk)iCalBk('2');
			    }
			}else
				{
				if(iCalBk)iCalBk(false);
		    }
		});
	}catch(e){
		logger.error('In redisPubSub : removeOnlineUser :Excpetion : ',e);
	}};
/**
 * @author MSA
 * 
 * function checks whether user is online or not
 * @param iuserId - user to be checked online
 * @param iCalBk
 *//*
redisPubSub.prototype.checkOnline  = function(iuserId , iCalBk){
		try{
			logger.info("In redisPubSub : checkOnline : iuserId is :  ",iuserId);
			var _status = null;
			var iuser = iuserId+"#EASYRTCID";
			var _chkOl = function(ierr,ireply){
				if(ireply == '1'){					
					common.redisCli.get(iuserId, function(err, iData){
						if(iData){
							if(typeof iData == 'string'){
								iData = JSON.parse(iData);
							}
							if(iData.status){
							_status = iData.status;
							}else{
							_status = '1';
							}
							common.redisCli.get(iuser, function(err, iResult){
								if(iResult!= null){
									if(typeof iResult == 'string'){
										iData.easyrtcId = JSON.parse(iResult).easyrtcID;
									}else{
										iData.easyrtcId = iResult.easyrtcID;
									}
									if(iCalBk)iCalBk(ireply ,iData,iResult);
								}else{
									if(iCalBk)iCalBk(ireply ,iData,iResult);
								}
							});
						}else{
							if(iCalBk)iCalBk(ireply,JSON.stringify({ status : '2'}));
						}
					});
				}else{
					if(iCalBk)iCalBk(ireply,JSON.stringify({ status : '2'}));
				}
			};
			if(_redisCL){
				common.redisCli.exists(iuserId,function(err , reply){
					_chkOl(err , reply);
				});
			}else{
				common.redisCli.exists(iuserId,function(err , reply){
					_chkOl(err , reply);
				});
				
			}
			
		}catch(e){
			logger.error('In redisPubSub : checkOnline : Exception: ',e);
		}
};*/


/**
 * @author MSA
 * 
 * function remove key from redis
 * @param iRedisKey - key to be removed
 * @param isaveHDataInRedisCB - callback
 */
redisPubSub.prototype.removeFromRed  = function(iRedisKey, isaveHDataInRedisCB){
	try{
		logger.info("In redisPubSub : removeFromRed : iRedisKey is :  ",iRedisKey);
		if(_redisCL){
			common.redisCli.exists(iRedisKey,function(ierr , reply){
				if(reply){
					common.redisCli.del(iRedisKey,redis.print);
				}
			});
		}else{
			common.redisCli.exists(iRedisKey,function(ierr , reply){
				if(reply){
					common.redisCli.del(iRedisKey,redis.print);
				}
			});
		}
	}catch(e){
		logger.error('In redisPubSub : removeFromRed : Exception : ',e);
	}
};
/**
 * @author MSA
 * 
 * function checks whether user is online or not
 * @param iuserId - user to be checked online
 * @param iCalBk
 */
redisPubSub.prototype.getKeyData  = function(iredisKey , iCalBk){
	try{
		logger.info("In redisPubSub : getKeyData : iredisKey is :  ",iredisKey);
		if(_redisCL){
			common.redisCli.exists(iredisKey,function(err , reply){
				
				if(!err && reply){
					common.redisCli.get(iredisKey,function(err , ireplyData){
						
						if(iCalBk)iCalBk(ireplyData);
					});
				}else{
					if(iCalBk)iCalBk(null);
				}
			});
		}else{
			common.redisCli.exists(iredisKey,function(err , reply){
				
				if(!err && reply){
					common.redisCli.get(iredisKey,function(err , ireplyData){
						if(iCalBk)iCalBk(ireplyData);
					});
				}else{
					if(iCalBk)iCalBk(null);
				}
			});
		}
	}catch(e){
		logger.error('In redisPubSub : getKeyData : Exception : ',e);
	}
};
redisPubSub.prototype.insertkeyInRedis = function (iKey , iData ,iCB){
	try{
		logger.info("In redisPubSub : insertkeyInRedis : iKey is :  ",iKey);
				common.redisCli.set(iKey,iData, function(iserr , isreply){
					if(isreply){
						if(iCB)iCB(true);
					}else{
						if(iCB)iCB(false);
					}
				});
		}catch(e){
		logger.error('In redisPubSub : insertkeyInRedis : Exception : ',e);
		
	}
};

redisPubSub.prototype.getKeysInRedis = function (iKeyPattern, iCallback){
	logger.info("In redisPubSub : getKeysInRedis : ");
	common.redisCli.KEYS(iKeyPattern,function(err , ireplyData){
		if(iCallback){
			iCallback(ireplyData);
		}
	});
};

redisPubSub.prototype.insertEasyrtcInRedis = function(iUserInfo,iCB){
	logger.info("In redisPubSub : insertEasyrtcInRedis : ",iUserInfo);
	var iData = {};
	//common.redisCli.get(iUserInfo.userId, function(err, reply) {
			iData.easyrtcID = iUserInfo.easyrtcid;;//easyrtcId;
			//if(iData){
			//console.log("settttttttttttt ",iData);
				common.redisCli.set(iUserInfo.userId+'#EASYRTCID',JSON.stringify(iData), redis.print);
				common.redisCli.persist(iUserInfo.userId);
			    if(iCB){
			    	iCB();
			    }
			//}
	//});
	
};
module.exports=redisPubSub;