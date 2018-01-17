/**
 * author - MSA
 * date - 23-09-2015
 * for functionality of single call wrapper for all modules module
 */
/*eslint-env es6*/
const common= require('./common');
const logger = common.logger;
const config = common.appConfigObj.client;
const topicName = common.topicNameMapping ;
/**@author MSA
 * emits java response to all users using socket io
 * @param iRequestObj - iRequestObj
 *  @param imode - imode
 * @param isendToJavaProcessCB
 *  @param iTopic - topic name
 */
class directQueue {
	constructor() {
	}
	sendToJavaProcess(iRequestObj, imode, isendToJavaProcessCB, iTopic) {
		if(iRequestObj.baton){
			iRequestObj.baton.push({Location: 'etDirectToQueue_sendToJavaProcess : node', Timestamp: new Date().getTime()});
		}
		const _that = this;
				if(!iRequestObj) {
					logger.info('No  request object present !!!!! for sending to java process ', iRequestObj);
					return;
				}
				if(!iTopic) {
					iTopic ='NODETOJAVA';
				}
				if(iTopic === 'NODETOJAVA'){
					iTopic = topicName[iTopic];
				}
				if(typeof iRequestObj !== 'string') {
					if(!iRequestObj.topic) {
						iRequestObj.topic = iTopic;
					}
				}
				common.kafkalibs.sendMessage(iTopic, iRequestObj, (ierr) => { //emitting updates to subscribed invitees
					logger.info('In etDirectToQueue : sendToJavaProcess : sendMessageOnProducer callback');
					if(ierr) {
						logger.error('In etDirectToQueue : sendToJavaProcess : Exception : error while sendMessageOnProducer data '+ierr);
						if(isendToJavaProcessCB)isendToJavaProcessCB(ierr, null);
						return;
					}
					if(isendToJavaProcessCB)isendToJavaProcessCB(null, null);
					return;
				});
				common.redisCli.set(iRequestObj.requestId,new Date().getTime(),'EX',600, function(err, reply) {
					logger.info('set SocketId in redis : ',reply);
				});	
}
}

exports.directQueue = directQueue;