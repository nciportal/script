/**
 * @author abhishek.kulkarni
 * @purpose class for FT(Financial Times) Headlines
 * @date 19-02-2015
 */
var common=require('./common');
var logger=common.logger;
var redisPS=require('./redisPubSub');
var redisps = new redisPS();

var request_Req = require('request');
var appConfigObj = common.appConfigObj;
if(appConfigObj.client.cluster){
	
	var DBStore 	= require('./etDbstoreSOA');
}else{
	var DBStore 	= require('./etDbStore');
}
var dbStore = new DBStore.dbStore(redisps);
var globalHeadlines = null;
var ftKey = null;
if(appConfigObj.FT && appConfigObj.FT.ftApiKey){
	ftKey = appConfigObj.FT.ftApiKey;
}

function etFTHeadlines(ikafkalib){
	
	var _that = this;
	if(ikafkalib){
		this.fKafka = ikafkalib;
	}
	
};

etFTHeadlines.prototype.fetchHeadlines = function(iClientInfo,iObj, iCallback){
	try{
		var _that = this;
		var _ftUrl = 'http://api.ft.com/content/search/v1?apiKey='+ftKey;
		var _resStr = ['title','lifecycle','location','summary','editorial','summary'];
		  request_Req.post({
			  url : _ftUrl,
			  'Content-Type': 'application/json',
			  body: JSON.stringify({ 
				  'queryString': iObj.query,
				  'resultContext' :{aspects : _resStr}
			  })
		  }, function(err, res, body){
			  
			  try{
				  if(!err && body){
					  var ftHeadlineResp = JSON.parse(body);
					  var _headlines = ftHeadlineResp.results[0].results;
					  var _headlinesArr = _that.makeHeadlinesObject(iClientInfo, _headlines);
					
					  if(iCallback){
						  iCallback(_headlinesArr);
					  }else{
						  var _objectToPublish = {
								  mode : '1' ,
								  moduleName : 'ftHeadlines',
								  actionFlag : 'ftHeadlines'
						  };
								sendObj = {
										action :'INSERT',
										dataArray: [_headlinesArr],
										actionFlag : 'ftHeadlines'
								};
								
							if(appConfigObj.client.cluster){//for cluster architecture through kafka
								  _that.fKafka.sendMessageOnProducer('ftHeadlines',JSON.stringify(sendObj) ,common.kproducer,function(){});
									 //
							}else{
								dbStore.broadCastPublishedData(_headlinesArr,_objectToPublish);
							}
						 
					  }
				  }else{
					  logger.error("Error in fetchHeadlines ",err);
				  }
			  }catch(ex){
				  logger.error("Exception catch in etFTHeadlines : fetchHeadlines callback of FT ",ex);
			  }
			  
			  
			  
		  });
	}catch(e){
		logger.error("Exception catch in etFTHeadlines : fetchHeadlines ",e);
	}
};

etFTHeadlines.prototype.makeHeadlinesObject = function(iClientInfo, iHeadlines){
	try{
		var orgName = "Clouds Inc.",source = 'https://clouzer.com';
		var arr = [];
		for(var i=0;i<20;i++){
			var _headline = iHeadlines[i];
			var _obj = {
				url : 'http://www.ft.com/cms/'+_headline.id+'.html?FTCamp=engage/CAPI/'+source+'/Channel_'+orgName+'//B2B',
				title : _headline.title.title,
				type : 'HEADLINES',
				headlineId : _headline.id,
				publishDate : _headline.lifecycle.initialPublishDateTime,
				summary : _headline.summary.excerpt
			};
			arr.push(_obj);
		}
		return arr;
	}catch(e){
		logger.error("Exception catch in etFTHeadlines : makeHeadlinesObject ",e);
	}
};//

etFTHeadlines.prototype.setDaemonForFt = function(){
	try{
		var _that = this;
		var _time = 30000;
		var _obj = {
				query : 'Business'
		};
		if(ftKey){
			setInterval(function(){
				
				_that.fetchHeadlines(null, _obj);
			},_time);
		}
		
	}catch(e){
		logger.error("Exception catch in etFTHeadlines : setDaemonForFt ",e);
	}
};
module.exports=etFTHeadlines;