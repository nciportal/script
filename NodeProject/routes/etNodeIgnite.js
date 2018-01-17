/*eslint-env es6*/
'use Strict';
const request = require('request');
const ip = require('ip');
const common=require('./common');
const logger = common.logger;
const ipAddress = ip.address();
const appConfigObject = require('./msProperties').appConfig;
//const orgTemplate =appConfigObj.orgTemplate;
let baseUrl = {};
let ipAdd = {},port ={};
if(appConfigObject.orgTemplate && appConfigObject.orgTemplate.server && appConfigObject.orgTemplate.server) {
	baseUrl = "http://"+appConfigObject.orgTemplate.igniteServer+":"+appConfigObject.orgTemplate.port;
	ipAdd = appConfigObject.orgTemplate.igniteServer;
	port = appConfigObject.orgTemplate.port;
}else{
	baseUrl = "http://"+ipAddress+":8080";
	ipAdd = ipAddress;
	port = 8080;
}

class nodeIgnite{
	constructor(){}
	
	checkOrgListInIgnite(orgName,cb){
		let _url = baseUrl + "/ignite?cmd=node&attr=true&mtr=true&ip="+ipAdd;
		request(_url, (error, response, body) => {
			if(error) {
				logger.error('In etNodeIgnite : error : '+error);
			}else{
				if(body) {
					var res = JSON.parse(body);	
					const nodeId = res.response.nodeId;
					
					const _url1 ="http://"+ipAdd+":"+port+"/ignite?cmd=get&key="+orgName+"&cacheName=ORG_LIST&destId="+nodeId;
					request(_url1,(error,response,body)=>{
						if(error) {
							logger.error('In etNodeIgnite : error  : ',error);
						}else{
							if(body){
								var res = JSON.parse(body);
								var orgId = res.response;
								const _url2 = "http://"+ipAdd+":"+port+"/ignite?cmd=get&key="+orgName+"&cacheName=TEMPLATE&destId="+nodeId;
								request(_url2,(error,response,body)=>{
						
									if(error) {
										logger.error('In etNodeIgnite : error  : ',error);
									}else{
										if(body){
											var res2 = JSON.parse(body);
											var resp2 = JSON.parse(res2.response);
											var _obj = JSON.parse(orgId)
											if(cb){
												cb(_obj);
											}
										}
									}
								});
								}
							}
				});
			}
		}
	});
}
	
	getData(orgName,cb){
		let _url = baseUrl + "/ignite?cmd=node&attr=true&mtr=true&ip="+ipAdd;
		request(_url, (error, response, body) => {
			if(error) {
				logger.error('In etNodeIgnite : error : '+error);
			}else{
				if(body) {
					var res = JSON.parse(body);	
					const nodeId = res.response.nodeId;
					const _url1 ="http://"+ipAdd+":"+port+"/ignite?cmd=get&key="+orgName+"&cacheName=HOME_WIZARD_CACHE&destId="+nodeId;
					request(_url1,(error,response,body)=>{
						if(error) {
							logger.error('In etNodeIgnite : error  : ',error);
						}else{
							if(body){
								var res = JSON.parse(body);
								if(cb){
									cb(res.response);
								}
							}
						}
				});
			}
		}
	});

		
	}
}

exports.nodeIgnite=nodeIgnite;
