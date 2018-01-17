/**
 * @author : SSD
 * @date : 22-2-2016
 * @purpose : Fetching News from FT
 * @modify by: GSS
 */
/*eslint-env es6*/
const request = require('request');
const common=require('./common');
const logger=common.logger;
const appConfigObj = common.appConfigObj;
const actionReducer=require('./etNewsReducer').newsReducer;
/*
function ftLib(){
	return this;
};
*/
class ftLib {
	constructor() {
	}

	ftSearch(iCallback) {
		try{
			logger.info('In etFT : ftSearch');
			const _that = this;

			_that.requestForFTNews(function(iErr, Succ) {
				if(iCallback) {
					iCallback(iErr, Succ);
				}
			});
		}catch(e) {
			logger.error('In etFT : ftSearch : Exception : ', e);
		}
	}

	requestForFTNews(iCallBack) {
		try{
			logger.info('In etFT : requestForFTNews');
			let _FTresponse = null;
			const _that = this;
			if(appConfigObj.FT && appConfigObj.FT.ftApiKey) {
				const requiredParameters = {
							ftKey: appConfigObj.FT.ftApiKey,
					};
				const _fturl = 	'http://api.ft.com/content/search/v1?apiKey='+requiredParameters.ftKey;
				const _resStr = ['title', 'lifecycle', 'location', 'summary', 'editorial', 'summary'];
				request.post({
					'url': _fturl,
					'Content-Type': 'application/json',

					'body': JSON.stringify({
						'queryString': 'economy',
						'resultContext': {aspects: _resStr},
					}),
				}, function(error, response, body) {
					if(error) {
						logger.error('In etFT : ftSearch : Exception : error occured in FT news', error);
						const _ftError = {
								NewsPaperName: 'FT',
								type: 'Error_Occur',
								message: error,
						};
						common.reduxBackendStore.dispatch(_ftError);
					}else{
						if(body) {
							if(typeof body=='string') {
								_FTresponse = JSON.parse(body);
							}else{
								_FTresponse=body;
							}
							if(_FTresponse && _FTresponse!= undefined && _FTresponse.results!= undefined) {
								let _obj = {};
								let _insertObj = {};
								let _clientInfo = {};
								_clientInfo ={userId: 'ADMIN'};
								_insertObj = {
										action: 'INSERT',
										dataArray: [_FTresponse.results],
								};
								_obj = {
										insertObj: _insertObj,
										moduleName: 'NWS',
										NewsPaperName: 'FT',
										clientInfo: _clientInfo,
								};

								if(_FTresponse.results[0].results) {
									common.queueLibs.sendToJavaProcess(_obj, common.appConfigObj.client['mode']);
								}
							}
						}
					}
				});
			}
		}catch(e) {
			logger.error('In etFT : requestForFTNews : Exception : ', e);
		}
	}
}

module.exports=	ftLib;
