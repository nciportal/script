"use strict";
const fs = require('fs')
	, common=require('./common')
	, FileSys = require('./etFileSystem').fileSys
	, logger = common.logger;
const fileSysObj  = new FileSys(); 

const isDirecotryExists = (iPath,iIsDirecotryExistsCallBack) =>{
	let _path =iPath;
	logger.info("In uploadFile : isDirecotryExists _path is  : ",_path);
	fs.stat(_path,(ierr,istats)=>{
		let _exists = null;
		  if(ierr){
		      logger.error("In uploadFile : isDirecotryExists : Exception :error in file system caall ",ierr);
		  }
		  if(!ierr && istats && istats.isDirectory()){
			  logger.info("is direftory "+istats.isDirectory());
			  _exists = true;
		  }
		  if(iIsDirecotryExistsCallBack)iIsDirecotryExistsCallBack(_exists);
	});
};

const isYearAndMonthDirecotryExists = (_userId, _uploadedFiles, iBaseDestinationDir, iIsYearAndMonthDirecotryExistsCallBack) => {
	logger.info("In uploadFile : isYearAndMonthDirecotryExists ");
	  let _fullYear=null,_fullMonth=null,_currentYearUploadDirPath=null,_currentMonthUploadDirPath=null,_monthArray=null;
	  let _responseJSON={},_appendDirectory=null;
	  _fullYear=new Date().getFullYear();	
	  _currentYearUploadDirPath=iBaseDestinationDir+'/'+ _fullYear;
  	  _monthArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  	  _fullMonth=_monthArray[new Date().getMonth()];
  	  _currentMonthUploadDirPath=_currentYearUploadDirPath+'/'+_fullMonth;
  	  _appendDirectory=_fullYear+'/'+_fullMonth;
		 
  	  isDirecotryExists(_currentYearUploadDirPath,(iFlag) =>{
	  		  if(iFlag){ 
	  			 _responseJSON['Year']={'name':_fullYear,'exists':true};
		  		 isDirecotryExists(_currentMonthUploadDirPath,(iFlag)=>{ 
		  			 if(iFlag){
		  				 	_responseJSON['Month']={'name':_fullMonth,'exists':true};
		  				 	if(iIsYearAndMonthDirecotryExistsCallBack)iIsYearAndMonthDirecotryExistsCallBack(_userId, _uploadedFiles, _responseJSON, _appendDirectory);
		  			 }else {
		  				fileSysObj.createDir([_currentMonthUploadDirPath],()=>{
		  					_responseJSON['Month']={'name':_fullMonth,'exists':false};
		  					if(iIsYearAndMonthDirecotryExistsCallBack)iIsYearAndMonthDirecotryExistsCallBack(_userId, _uploadedFiles, _responseJSON, _appendDirectory);
		  				});
		  			 }  	  		  
		  	  	  });		  		 
	  		  }else{  	
	  			fileSysObj.createDir([_currentYearUploadDirPath],(err)=>{
	  					_responseJSON['Year']={'name':_fullYear,'exists':false};
	  				if(!err){
	  					fileSysObj.createDir([_currentMonthUploadDirPath],()=>{
	  							_responseJSON['Month']={'name':_fullMonth,'exists':false};	  			    		 
	  							if(iIsYearAndMonthDirecotryExistsCallBack)iIsYearAndMonthDirecotryExistsCallBack(_userId, _uploadedFiles, _responseJSON, _appendDirectory);
	  					});
	  				}
	  			});
	  		  }
	  	  });
};

const moveFile = (source, dest, callback) => {
	logger.info("In uploadFile : moveFile ");
	const  stat = fs.statSync(source);
		const str = progress({
	    length: stat.size,
	    time: 10000
	});
	
	fs.createReadStream(source)
	    .pipe(str)
	    .pipe(fs.createWriteStream(dest));
	
	if( callback) callback(progress);
 
};

exports.moveFile=moveFile;
exports.isYearAndMonthDirecotryExists=isYearAndMonthDirecotryExists;
exports.isDirecotryExists=isDirecotryExists;

 