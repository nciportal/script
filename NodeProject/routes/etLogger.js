/***
 * @author SBN
 * @author JIN (Added email notification)
 * @Class Logger
 */
var winston = require('winston');
var fileLogger=null;
var appConfigObj=require('./msProperties').appConfig;
var Mail = require('winston-mail').Mail;
var fs = require ("fs");
var isProduction = false ;
if(appConfigObj && appConfigObj.environment && appConfigObj['environment']['environment'] && appConfigObj['environment']['environment'] == 'production'){
	//this block to identify whether this is production or not
	//if production then debug logs will not get generated
	isProduction = true;
}
function kafkaLogger(){
	var _time = new Date() ;
	var _dateWithMonthAndYear = _time.getDate()+"_"+(_time.getMonth()+1)+"_"+_time.getFullYear()+"kafka_LOGS";
	
	var _filepath = appConfigObj.log.logPath+"/"+_dateWithMonthAndYear;
	fs.exists(_filepath, function (exists) { //returns true or false on path existance
		if(!exists){
			fs.mkdirSync(_filepath);
		}  
	});
	
	var _tranports = [];//this array contain all transports
	
	_tranports.push(new (winston.transports.File)({ 
		  filename: _filepath + '/infoLog_'+ _time.toString() +'.log',
		  name:'file.info',
		  level:'info',
		  maxsize: 1024*1024*10, 
		  handleExceptions: true,
		  json: false
		  
	}));
	_tranports.push(new (winston.transports.File)({ 
		  filename: _filepath + '/errorLog_'+ _time.toString() +'.log',
		  name:'file.error',
		  level:'error',
		  maxsize: 1024*1024*10, 
		  handleExceptions: true,
		  json: false
		  
	}));
	var klogger = new (winston.Logger)({
		exitOnError: false, //don't crash on exception
		transports: _tranports
		  
	});
	return klogger;	
	
}
function Logger(){
	
	var _time = new Date() ;
	var _dateWithMonthAndYear = _time.getDate()+"_"+(_time.getMonth()+1)+"_"+_time.getFullYear();
	
	var _filepath = appConfigObj.log.logPath+"/"+_dateWithMonthAndYear;
	fs.exists(_filepath, function (exists) { //returns true or false on path existance
		if(!exists){
			fs.mkdirSync(_filepath);
		}  
	});
	
	
	var _tranports = [];//this array contain all transports
	
	_tranports.push(new (winston.transports.Console)({
	        			  level : 'debug',
	        			  handleExceptions: false,
	        			  prettyPrint: true,
	        			  silent:false,
	        			  timestamp: true,
	        			  colorize: true,
	        			  json: false
	        			  
	}));
	
	_tranports.push(new (winston.transports.File)({ 
		  filename: _filepath + '/infoLog_'+ _time.toString() +'.log',
		  name:'file.info',
		  level:'info',
		  maxsize: 1024*1024*10, 
		  handleExceptions: true,
		  json: false
		  
	}));
	
	_tranports.push(new (winston.transports.File)({ 
	        			  filename: _filepath + '/warnLog_'+ _time.toString() +'.log',
	        			  name:'file.warn',
	        			  level:'warn',
	        			  maxsize: 1024*1024*10, 
	        			  handleExceptions: true,
	        			  json: false
	        			  
	}));
	
	_tranports.push(new (winston.transports.File)({ 
		  filename: _filepath + '/errorLog_'+ _time.toString() +'.log',
		  name:'file.error',
		  level:'error',
		  maxsize: 1024*1024*10, 
		  handleExceptions: true,
		  json: false
		  
	}));
	
	if(!isProduction){
		_tranports.push(new (winston.transports.File)({ 
				filename: _filepath + '/debugLog_'+ _time.toString() +'.log',
				name:'file.debug',
				level:'debug',
				maxsize: 1024*1024*10, 
				handleExceptions: true,
				json: false
		}));
	};
	
	
	if(appConfigObj.notificationMailsList && appConfigObj.notificationMailsList.mailslist && appConfigObj.notificationMailsList.username){
		var _mailList = appConfigObj.notificationMailsList.mailslist ;
		var _username = appConfigObj.notificationMailsList.username ;
		var _password = appConfigObj.notificationMailsList.password ;
		var _subject = null;
		if(appConfigObj.webServer.serverName){
			_subject = appConfigObj.webServer.serverName +":"+appConfigObj.notificationMailsList.subject ;
		}else{
			_subject = appConfigObj.notificationMailsList.subject ;
		}
		var _from = appConfigObj.notificationMailsList.subject;
		
		if(_mailList != '' && _username !=''){
			var _mailTransport = {
					host 	:	'smtp.gmail.com',
					port 	:	 465,
					ssl 	: 	true,
					username:	_username,
					password:	_password,
					subject :	_subject,
					level	:	'error'	,
					from 	:	_from,
					to 		:	_mailList 
					
			};
			
			_tranports.push(new (Mail)(_mailTransport));
		}
	}
	
		
	var logger = new (winston.Logger)({
		exitOnError: false, //don't crash on exception
		transports: _tranports
		  
	});
	return logger;	
};
exports.Logger=Logger;
exports.kafkaLogger=kafkaLogger;