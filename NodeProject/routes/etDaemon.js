/*eslint-env es6*/
const common = require('./common');
const logger = common.logger;
const domain = require('domain');
const d = domain.create();

d.on('error', function(er) {
	logger.error('In etDaemon : Exception : ', er.stack);
});

class daemon{
	constructor(iDbStore){
		this.fDbStore = iDbStore;
		return this;
	}

	getkeys(ikey) {
		try{
			logger.info('In etDaemon : getkeys');
			const promise = common.promise;
			return new promise(function(resolve, reject) {
				common.redisCli.get(ikey, function(iErr, iReply) {
					if(iErr) {
						logger.error('In etDaemon : getkeys : Exception : ', iErr);
						reject(iErr);
					}else{
						if(iReply) {
							const obj = {
									data: iReply,
									key: ikey,
							};
							resolve(obj);
						}else{
						}
					}
				});
			});
		}catch(err) {
			logger.error('In etDaemon : getkeys : Exception : ', err);
		}
	};
	
	getKeys() {
		try{
		//	var  client = redis.createClient();
			common.redisCli.keys('/sync**@mstorm.com*', function (err, keys) {
				// console.log('keyskeyskeyskeyskeyskeyskeys : ',keys);
				  if (err) return console.log(err);
			      if(keys.length !== 0){
                	  const rec = (index)=>{
                	common.redisCli.ttl(keys[index], function (err, timeRemained) {
                   	//	console.log('timeRemainedtimeRemainedtimeRemainedtimeRemained : ',timeRemained,'keyyyyyyyy : ',keys[index]);
                       if(timeRemained < 300){
                        	var flag =  common.redisCli.del(keys[index]);
                        	logger.info('Pending requests  from backend : ',keys[index],'ttl : ',timeRemained);
                        	logger.info('KEY DELETED : ',flag);
                       }
                       index++;
                       if(keys.length > index){
                    	   	rec(index);
                       }
                
                    });
                  };rec(0);
                }
            	});   
		}catch(err) {
			logger.error('In etDaemon : getkeys : Exception : ', err);
		}
	};

	delofflinepending(iSockObj) {
		try{
			logger.info('In etDaemon : delofflinepending');
			const _that = this;
			d.run(function() {
				const _intervalFotSendMail =5*6*1000;
				const _resolve = function(ireq) {
					const req = ireq.data;
					const key = ireq.key;
					if(typeof req == 'string') {
						req = JSON.parse(req);
					}
					if(req.time) {
						const _curTime = new Date().getTime();
						const dif = _curTime - req.time;
						if(dif > 5*60*1000) {
							if(req.id && req.version && req.failedVersion) {
								iSockObj.to(req.user).emit('clearOfflineRequest', req.version, req.failedVersion, req.device);
							}
							common.redisCli.del(key);
						}
					}
				};
				setInterval(function() {
					common.redisCli.keys('*OFFREQ', function(ier, ireply) {
						const _pendin = ireply;
						if(_pendin.length > 0) {
							for(let g=0; g<_pendin.length; g++) {
								const req = _pendin[g];
								_that.getkeys(req).then(_resolve)['catch']();
							}
						}
					});
				}, _intervalFotSendMail);
			});
		}catch(err) {
			logger.error('In etDaemon : delofflinepending : ', err);
		}
	};
}

module.exports=daemon;
