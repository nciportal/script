/**
 * @author : Shruti Doiphode
 * @date : 18-3-2016
 * @purpose : Fetching News from Guardian
 * @modify by: GSS
 */

const request = require('request');
const common=require('./common');
const logger=common.logger;
const actionReducer=require('./etNewsReducer').newsReducer;
const appConfigObj = common.appConfigObj;

/*function guardianLib(){
	return this;
}*/

class guardianLib{
	guardianNews(iCallback){
		try{
			logger.info("In etGuardian : guardianNews");
			const _that  = this;
			if(appConfigObj.GUARDIAN.guardianenabled == true && appConfigObj.GUARDIAN.apiKey)
			{
				_that.requestForGuardianNews(function(iErr,iSucc){
					if(iCallback){
						iCallback(iErr,iSucc);
					}
				});
			}
		}catch(e){
			logger.error('Exception catch in etGuardian : guardianNews');
		}
	};

	requestForGuardianNews(icallback){
		const _that = this;let indexOfSection = 0;
		logger.debug("In etGuardian : requestForGuardianNews");
		const _arrOfGuardianSections = ["WORLD","BUSINESS","SPORTS","HEALTH","SCIENCE","INDIA","TECHNOLOGY","POLITICS"];
		if(appConfigObj.GUARDIAN.guardianenabled == true && appConfigObj.GUARDIAN.apiKey){

			let fetchNewsSectionWise = function(indexOfSection){
				const _section = _arrOfGuardianSections[indexOfSection];
				const _sectionName = _section.toLowerCase();

				const _url = 'http://content.guardianapis.com/search?q='+_sectionName+'&api-key='+appConfigObj.GUARDIAN.apiKey;	
			request(_url,function(error, response, body){
					if(error){
						logger.error("error occured in requestForGuardianNews",error);
						 const _guardianError = {
								 NewsPaperName:"GUARDIAN",
								 type:"Error_Occur",
								 message:error
						 };
						 common.reduxBackendStore.dispatch(_guardianError);
						 indexOfSection++;
						 if(indexOfSection<_arrOfGuardianSections.length){
							 fetchNewsSectionWise(indexOfSection);
						 }
						
					}else{
						if(body){
							console.log("bodybodybody : ",body);
							const _parsedBody = JSON.parse(body);
							if(_parsedBody && _parsedBody!= undefined && _parsedBody.response.results!= undefined){
								let _obj = {};
								let _insertObj = {};
								let _clientInfo = {};
								_clientInfo ={ userId: "ADMIN"};	
								_insertObj = {
										action : "INSERT",
										dataArray : [_parsedBody.response.results]
							 	};
								_obj = {
										insertObj : _insertObj,
										moduleName : "NWS",
										NewsPaperName:"GUARDIAN",
										clientInfo : _clientInfo
								};
								
								 const _guardian = {
										 NewsPaperName:"GUARDIAN",
										 type:"FETCH_COMPLETED"
								 };
								 common.reduxBackendStore.dispatch(_guardian);
								
								 indexOfSection++;
								 if(indexOfSection<_arrOfGuardianSections.length){
									 fetchNewsSectionWise(indexOfSection);
								 }
								 
								if(_parsedBody.response.results){
									common.queueLibs.sendToJavaProcess(_obj,common.appConfigObj.client['mode']);
								}
							}
						}
					}
				});
				
			};
			fetchNewsSectionWise(0);
		}
	};
}

module.exports= guardianLib;