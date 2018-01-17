
/**
 * Author - MSA
 * Date - 24 july 14
 * Purpose - for sync scenarios in  Hbase app
 */
'use strict';
const common=require('./common');
const logger=common.logger;
const appConfigObj = require('./msProperties').appConfig;
const async = require('async');
const domain = require('domain');
const d = domain.create();

d.on('error',(er)=>{
	
	 logger.error("error in etsyncHprocess.........",er.stack);
});



class syncLib{
	constructor(iDbstore,idbOperation){
		let _that = this;
		if(iDbstore)
			_that.fDbStore = iDbstore;
		if(idbOperation)
			_that.fDbOperation = idbOperation;
	}
}
module.exports=syncLib;