/*eslint-env es6*/
'use Strict';
const request = require('request');
const common=require('./common');
const logger=common.logger;
const appConfigObj = common.appConfigObj;

/*function nytLib() {
	return this;
}*/

class nytLib{
	constructor(){}
	
	nytHeadlines(iCallback){
		const _this = this;
		if(appConfigObj.NYT.nytenabled == true && appConfigObj.NYT.TimesNewswireAPI) {
			_this.requestForNYTNews((iErr, iSucc) =>{
				if(iCallback) {
					iCallback(iErr, iSucc);
				}
			});
		}
	}
	
	requestForNYTNews(iCallback){
		try{
			logger.info('In etNYT : requestForNYTNews');
			if(appConfigObj.NYT && appConfigObj.NYT.TimesNewswireAPI ) {
				const _arrOfNYTSections = ['WORLD', 'BUSINESS', 'SPORTS', 'HEALTH', 'SCIENCE', 'FOOD', 'JOB', 'TRAVEL', 'FINANCIAL', 'EDUCATION', 'AUTOMOBILES', 'BOOKS',
				                         'STYLE', 'BLOGS', 'REAL_ESTATE'];
			var fetchNewsSectionWise = (indexOfSection) => {
				  const _key = appConfigObj.NYT.TimesNewswireAPI;
				  const _section = _arrOfNYTSections[indexOfSection].toLowerCase();
				  let _url = 'http://api.nytimes.com/svc/news/v3/content/all/'+_section+'/.json?api-key='+_key;
				  request(_url, (error, response, body) => {
						if(error) {
							logger.error(' In etNYT : requestForNYTNews : error occurred during world news : Exception : ', error);
							 const _nytError = {
									 NewsPaperName: 'NYT',
									 type: 'Error_Occur',
									 message: error,
							 };
							 common.reduxBackendStore.dispatch(_nytError);

							 indexOfSection++;
							 if(indexOfSection<_arrOfNYTSections.length) {
								 fetchNewsSectionWise(indexOfSection);
							 }
						}else{
							if(body) {
								let _parseddata = null;
								logger.info('type of  : NYT : ', typeof(body));
								if(typeof body=='string') {
									_parseddata = JSON.parse(body);
								}else{
									_parseddata = body;
								}
								if(_parseddata && _parseddata && _parseddata.results) {
								let _obj = {};
								let _insertObj = {};
								let _clientInfo = {};
								_clientInfo ={userId: 'ADMIN'};		//"ADMIN";
								_insertObj = {
										action: 'INSERT',
										dataArray: [_parseddata.results],
							 	};
								_obj = {
										insertObj: _insertObj,
										moduleName: 'NWS',
										NewsPaperName: 'NYT',
										clientInfo: _clientInfo,
								};

								 indexOfSection++;
								 if(indexOfSection<_arrOfNYTSections.length) {
									 fetchNewsSectionWise(indexOfSection);
								 }

								if(_parseddata.results) {
								common.queueLibs.sendToJavaProcess(_obj, common.appConfigObj.client['mode']);
								}
								  }
							}
						}
				    });
			}; fetchNewsSectionWise(0);
		}
		}catch(e) {
			logger.error('In etNYT : requestForNYTNews : Exception : ', e);
		}
	};
}

module.exports=	nytLib;
