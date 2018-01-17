/**
 * @author  : SSD1
 * @purpose : etChatActionCreator.js file is used for chat operations
 * @date    : 15 July 2016
 */
/*eslint-env es6*/
const common= require('./common');
const logger=common.logger;
const redisPS=require('./redisPubSub');
const redisps = new redisPS();
const DBStore 	= require('./etDbStore');
const dbStore = new DBStore.dbStore(redisps);

class actionCreators {
	constructor() {}

	/**
	 * @author  : SSD1
	 * @param 	: iObj containing object of user credentials
	 * @purpose : for login operations
	 * @date    : 15 July 2016
	 */
	loginInit(iObj) {
		try{
			logger.info('In etLoginActionCreator : loginInit : ' , new Date().getTime());
		    //console.log("inside .....login action creator ....",iObj);
		/*     _obj = {
		    		action: 'INSERT',
		    		dataArray: [{
		    			ACTIVE_STATUS: '1',
		    			Object: iObj,
		    		}],
		    };*/
			if(iObj.hasOwnProperty('baton')){	
				iObj.baton.push({Location: 'etLoginActionCreator_loginInit : node', Timestamp: new Date().getTime()})
				logger.info("In etLoginActionCreator : " , iObj.baton);
			}else{
				let baton = [];
				iObj.baton = baton;
				iObj.baton.push({Location: 'etLoginActionCreator_loginInit : node', Timestamp: new Date().getTime()});
				logger.info("In etLoginActionCreator : " , iObj.baton);
			}
		     const _returnObj = {
		        	type: 'LOGIN',
					status: true,
					Object: iObj,
				};
			return _returnObj;
		}catch(e) {
			logger.error('In etLoginActionCreator : loginInit : Exception : ', e);
		}
	}
}

exports.actionCreators = actionCreators;
