const fs = require('fs');
const common=require('./common');
const logger=common.logger;
class fileSys{
	constructor(){}
	
	createDir(iArray,iCallback){
		try{
			logger.info('In etFileSystem : createDir : ');
			const recurisiveFunc1 = (index)=>{
				fs.mkdir(iArray[index],0o777, (err) =>{
					index++;
					if(index < iArray.length){
						recurisiveFunc1(index);
					}else{
						if(iCallback){
							iCallback();
						}
					}
				});
			};recurisiveFunc1(0);
		}catch(e){
			logger.error('In etFileSystem: createDir : Exception : ');
		}
	}
	
}
exports.fileSys = fileSys;
