'use strict';
const RedisQ=require('./redisRQ')
, common=require('./common')
, Redisps = require('./redisPubSub');
const logger=common.logger;

	/**
	 * @class dbStore
	 * @returns
	 */
class dbStore{
	constructor(iRedisObj){
	    this.userId='Test_DB';
	    this.userDeviceMappings= {};
	    this.userSockets={};
	    this.redisConnSub = common.redisSub;
	    this.redisConnPub = common.redisPub;
	}
	/**@author MSA
	 * function for emit info/json object to all device of same user also on njs cluster  
	 * @param iUserId - user to whom emition should be done
	 * @param iSocketId - socket id
	 * @param iAction - action tobe emitted to socket
	 * @param iMessage
	 */
	emitByUserId(iUserId, iSocketId, iAction, iMessage) {
		logger.info('In etDbStore : emitByUserId');
		let _that=this;
		let _obj = {};
		_obj.msg = iMessage;
		_obj.sock = iSocketId;
		_obj.sender = iUserId;
		_obj.listener=iAction;
		_that.emitOnSubListener(iUserId,_obj);
	}
	/**
	  * @author MSA
	  * @param iUserId - user to whom message to be emitted from socket
	  * @param iMsgObj - message to be emitted
	  * @Modify by RBK
	  */
	  emitOnSubListener(iUserId, iMsgObj){
	 	 try{
	 		logger.info('In etDbStore : emitOnSubListener');
			 const redisQu = new RedisQ(dbStore);
			 let _that = this;
	 		 let _userSockets = null;
	 		 if(_that.userSockets && Object.keys(_that.userSockets).length === 0){
	 		 _that.userSockets = common.serverSockets;
	 		 }
	 		 if(this.userSockets && this.userSockets.connected){
	 			 _userSockets = this.userSockets.connected;
	 			 let _that =this;
	 			 let _msgMainObj=iMsgObj;
	 			 if(_userSockets && _msgMainObj && _msgMainObj.msg){
	 				let _msg = null;
	 				 if(typeof _msgMainObj.msg === "string"){
	 					_msg = JSON.parse(_msgMainObj.msg);
	 				 }else{
	 					_msg = _msgMainObj.msg;
	 				 }
	 				
	 				if(_msgMainObj.sock && _msg.dataArray && _msg.action && _msg.dataArray !== null && _msg.dataArray.length > 0){
	 					let _key = null;
	 					if(_msg.action === 'INSERT'){
	 						_key = _msg.dataArray[0].KEY_VAL;
	 					}else{
	 						_key = _msg.dataArray[0].CON_PARAM.PKVAL;
	 					}
	 					if(_key){
	 					
	 						let _mainmsg = {};
	  						_mainmsg.listenerName = _msgMainObj.listener;
	  						_mainmsg.data = _msg;
	  						
	  						if(_userSockets[_msgMainObj.sock]){
	 						     	const _sockObj = _userSockets[_msgMainObj.sock];
	 							if(_sockObj.userInfo.deviceID ){
	 								redisQu.saveSessionInRedis(iUserId ,_sockObj.userInfo.deviceID , _key , _mainmsg ,function(){
	 	 								_sockObj.broadcast.to(iUserId).emit(_msgMainObj.listener, JSON.stringify(_msg));
	 	 							});
	 							}else{
	 								_sockObj.broadcast.to(iUserId).emit(_msgMainObj.listener, JSON.stringify(_msg));
	 							}
	 							
	 						}else{
	 							_that.userSockets.to(iUserId).emit(_msgMainObj.listener, JSON.stringify(_msg));
	 						}
	 					}else{
	 						_that.userSockets.to(iUserId).emit(_msgMainObj.listener, JSON.stringify(_msg));
	 					}
	 				}else{
	 					_that.userSockets.to(iUserId).emit(_msgMainObj.listener, JSON.stringify(_msg));
	 				}
	 			 }else{
	 				 logger.error("In etDbStore : emitOnSubListener :Exception : not _userSockets && _msgMainObj");
	 			 }
	 		 }else{
	 			 return;
	 		 }
	 	 }catch(e){ 
	 		 logger.error('In etDbStore : emitOnSubListener :Exception '+e+'>>>>>>> parameters passed to emitOnSubListener '+
	 				 iUserId+" message >>>>>>>> "+JSON.stringify(iMsgObj));
	 	 }
	  }
	
	/**
	 * @author : AAP
	 * @Date : 30/1/15
	 * @Purpose :  vallidate insert object before inserting in hbase
	 * @param iInsertUpdateobj
	 * @param iVallidationOfInsertObjectsCB
	 */
	  vallidationOfObjects(iInsertUpdateobj,ivallidationOfObjectsCB){
		try{
				logger.info("In etDbStore : vallidationOfInsertObjects");
				let _that =this;
			    if(iInsertUpdateobj && iInsertUpdateobj.userId){
			    	if(iInsertUpdateobj && iInsertUpdateobj.action && iInsertUpdateobj.action !== 'null' && iInsertUpdateobj.action !== null){
						if(iInsertUpdateobj && iInsertUpdateobj.dataArray && iInsertUpdateobj.dataArray.length > 0){
							for(let i = 0; i < iInsertUpdateobj.dataArray.length ; i++ ){
								return ivallidationOfObjectsCB(null,null,null);
							}
						}else{
							logger.error("In etDbStore : ivallidationOfObjectsCB : Exception : "+_insertObj);
							logger.error("In etDbStore : ivallidationOfObjectsCB : Exception : vallidationOfInsertObjects _insertObj.dataArray is :"+JSON.stringify(_insertObj.dataArray));	
							 const _errorObj = JSON.stringify(_insertObj);
							 return ivallidationOfObjectsCB(null,null,null);
						}
					}else{
						 const _errorObj = JSON.stringify(iInsertUpdateobj);
						 logger.error("In etDbStore : ivallidationOfObjectsCB  :Exception : iInsertUpdateobj: action is not present "+JSON.stringify(iInsertUpdateobj));
						 return ivallidationOfObjectsCB(null,null,_errorObj);
				   }
				 }else{
					 const _errorObj = JSON.stringify(iInsertUpdateobj);
					 logger.error("In etDbStore : ivallidationOfObjectsCB  :Exception : iInsertUpdateobj: userId not present "+JSON.stringify(iInsertUpdateobj));
					 return ivallidationOfObjectsCB(null,null,_errorObj);
			    	 	
			     }
		}catch(e){
				logger.error("In etDbStore : ivallidationOfObjectsCB  : Exception : ",e);
		}
	}
}
exports.dbStore=dbStore;