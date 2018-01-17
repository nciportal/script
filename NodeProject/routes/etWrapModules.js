/**
 * author - MSA
 * date - 23-09-2015
 * for functionality of single call wrapper for all modules module
 */
/*eslint-env es6*/
const common		= require('./common');
const logger = common.logger;
const Promise1 = common.Promise;
const ActionReducerEmail = require('./etEmailActionCreator').actionCreators;
const emailOp = new ActionReducerEmail();
const ActionReducerCloudVault = require('./etCloudVaultActionCreator').actionCreators;
const cloudValut = new ActionReducerCloudVault();
const ActionReducerChat = require('./etChatActionCreator').ActionCreators;
const chatOp = new ActionReducerChat();
// Added By RMM for route call to action creator
const ActionReducerProject = require('./etProjectActionCreator').actionCreators;
const prjOp=new ActionReducerProject();
const ActionReducerContact = require('./etContactActionCreator').actionCreators;
const contact = new ActionReducerContact();
const ActionReducerOrg = require('./etOrgActionCreator').OrgActionCreators;
const org = new ActionReducerOrg();
const ActionReducerCal = require('./etCalendarActionCreator').calActionCreators;
const calOp = new ActionReducerCal();
const ActionSetting=require('./etSettingActionCreator').actionCreators;
const stgOp=new ActionSetting();
const Login=require('./etLoginActionCreator.js').actionCreators;
const loginOp=new Login();

class modulesLib {
	constructor(iMod) {
		/*this.fSchedule = iMod.schedule;
		this.contactOp = iMod.contactOp;
	    return this;*/
	}

	/**@author MSA
	 * initiate processing related to followups synchronously ,update then insert
	 * @param idbObj - insertObj or updateObj ,userInfo ,socket,broadcastflag
	 * @param iPrjInItCB
	 */
	wrapMyModulesFromSocketCall(idatabaseObj, iSocket) {
	    logger.info('In etWrapModules : wrapMyModulesFromSocketCall');
	    return new Promise1(function(resolve, reject) {
	    	exec(resolve, reject);
	    });
	    function exec(iSuccessFunc, ifailureFunc) {
	    		logger.info('In etWrapModules : exec',idatabaseObj.moduleName);
	    		let socket = null;
	    	    if(iSocket) {
	    	    	  socket = iSocket;
	    	    }
	    	 /*   let _clientInfo = null, _UpdateEventObj = null, _insertEventsObj = null, ibroadcast = null,_extraParam = null,ideleteFromRecyclebin,_action*/;
	    	  /*  if(idatabaseObj.hasOwnProperty('userId')){
	    	    	_clientInfo = idatabaseObj.userId;
	    	    }*/
	    	  /*  if(idatabaseObj.hasOwnProperty('updateObj')) {
	    	    	_UpdateEventObj = idatabaseObj.updateObj;
	    	    }
	    	    if(idatabaseObj.hasOwnProperty('insertObj')) {
	    	    	_insertEventsObj = idatabaseObj.insertObj;
	    	    }*/
//	    		if(idatabaseObj.broadCast === false || idatabaseObj.broadCast === true) {
//	    			ibroadcast = idatabaseObj.broadCast;
//	    		}
	    		/*if(idatabaseObj.hasOwnProperty('extraParam')) {
	    			_extraParam = idatabaseObj.extraParam;
	    		}*/
	    	/*	if(idatabaseObj.hasOwnProperty('deleteFromRecyclebin')) {
	    			ideleteFromRecyclebin = idatabaseObj.deleteFromRecyclebin;
	    		}*/
//	    		if(idatabaseObj.hasOwnProperty('action')) {
//	    			_action = idatabaseObj.action;
//	    		}
				if(idatabaseObj && idatabaseObj.hasOwnProperty('moduleName')) {
						//condition added for day week schedule events
				//	logger.info('In etWrapModules : execgggggggggggggggggggggggggggggggggggggggg',idatabaseObj.moduleName);
					switch(idatabaseObj.moduleName) {
					case 'EML' :
					case 'EAD' :
						//console.log('insideeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
//								if(idatabaseObj.hasOwnProperty('insertObj')) {
//									logger.info('In etWrapModules : exec : in EML case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.insertObj.dataArray[0].ACTION_ARRAY);
//								}else if(idatabaseObj.hasOwnProperty('updateObj')) {
//									logger.info('In etWrapModules : exec : in EML case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.updateObj.dataArray[0].ACTION_ARRAY);
//								}else{
//									logger.info('In etWrapModules : exec : in EML case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId);
//								}
								 try{
/*//										 const _obj = {
//												 databaseObj: idatabaseObj,
//												 socket: socket,
//										 };
*/										// console.log('_obj_obj_obj_obj : ',_obj);
										 common.reduxBackendStore.dispatch(emailOp.emailInit(idatabaseObj));
										/* let iErr = false;
										 if(iErr) {
											 ifailureFunc();
										 }										 else{
											 iSuccessFunc();
										 }*/
								}catch(e) {
									logger.error('In etWrapModules : exec : in EML case : Exception :', e);
					            }
			         	        break;
					case 'MTG' :
					case 'GCAL'	:
					case 'EVT' :
					case 'CAL' :
							/*	if(idatabaseObj.hasOwnProperty('insertObj')) {
									logger.info('In etWrapModules : exec : in GCAL,MTG,NOT,EVT,RPE,MLT,CAL,DSC,WSC case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.insertObj.dataArray[0].ACTION_ARRAY);
								}else if(idatabaseObj.hasOwnProperty('updateObj')) {
									logger.info('In etWrapModules : exec : in GCAL,MTG,NOT,EVT,RPE,MLT,CAL,DSC,WSC case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.updateObj.dataArray[0].ACTION_ARRAY);
								}else{
									logger.info('In etWrapModules : exec : in GCAL,MTG,NOT,EVT,RPE,MLT,CAL,DSC,WSC case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId);
								}*/

								if(iSocket && iSocket.hasOwnProperty('id')) {
									idatabaseObj.socketId = iSocket.id;
								}
								common.reduxBackendStore.dispatch(calOp.calInit(idatabaseObj));
								break;
					case 'SEC' :
					case 'PGP' :
					case 'PRJ' :
					case 'TSK' :
					case 'IOE' :
					case 'ROM' :
					case 'DVC' :
//					case 'Media':
						        let subKeyType = null;
//								if(idatabaseObj.hasOwnProperty('insertObj')) {
//									logger.info('In etWrapModules : exec : in SEC,PGP,PRJ,TSK,IOE,ROM,DVC case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.insertObj.dataArray[0].ACTION_ARRAY);
//									subKeyType = idatabaseObj.insertObj.dataArray[0].SUB_KEY_TYPE;
//								}else if(idatabaseObj.hasOwnProperty('updateObj')) {
//									logger.info('In etWrapModules : exec : in SEC,PGP,PRJ,TSK,IOE,ROM,DVC case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.updateObj.dataArray[0].ACTION_ARRAY);
//									subKeyType = idatabaseObj.updateObj.dataArray[0].CON_PARAM.SUB_KEY_TYPE;
//								}else{
//									logger.info('In etWrapModules : exec : in SEC,PGP,PRJ,TSK,IOE,ROM,DVC case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId);
//								}
								// added by RMM to route call to redux file
						    //    console.log('innnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn : ',JSON.stringify(idatabaseObj));
						     //   console.log('idatabaseObj.dataArray[0].calmailObject.SUB_KEY_TYPEidatabaseObj.dataArray[0].calmailObject.SUB_KEY_TYPE : ',idatabaseObj.dataArray[0]);
						        //console.log('SUB_KEY_TYPESUB_KEY_TYPESUB_KEY_TYPESUB_KEY_TYPE : ',idatabaseObj.dataArray[0].SUB_KEY_TYPE);
						      
						        if(idatabaseObj.dataArray[0].hasOwnProperty('calmailObject')) {
                                    subKeyType = idatabaseObj.dataArray[0].calmailObject.SUB_KEY_TYPE;
						        }else{
						        	subKeyType = idatabaseObj.dataArray[0].subKeyType;
						        }

						        
						       // subKeyType = idatabaseObj.dataArray[0].calmailObject.SUB_KEY_TYPE;
								if(iSocket && iSocket.hasOwnProperty('id')) {
									idatabaseObj.socketId = iSocket.id;
								}
								//console.log('subKeyTypesubKeyTypesubKeyTypesubKeyTypesubKeyTypesubKeyTypesubKeyTypesubKeyType :',subKeyType)
								switch(subKeyType){
								case 'EVT':
								case 'MTG':
								case 'RPE':
								case 'MLT':
								case 'CAL':
								case 'IMG_CAL':
								case 'IMG_EVT':
								case 'DSC_CAL':
								case 'DSC_EVT':
								case 'WSC_CAL':
								case 'WSC_EVT':
								case 'DSE':
								case 'WSE':
								case 'EVT_RPE':
								case 'MTG_RPE':
								case 'EVT_ORG':
								case 'MTG_ORG':
								case 'EVT_RPE_ORG':
								case 'MTG_RPE_ORG':
								case 'CAL_IMG':
								case 'TSK_EVT':
								case 'TSK_MTG':
								case 'TSK_SHELL_EVT':
								case 'TSK_SHELL_MTG':
								case 'TSK_RPE_EVT':
								case 'TSK_RPE_MTG':
								case 'TSK_SHELL_EVT_ORG':	
								case 'TSK_SHELL_MTG_ORG':	
								case 'TSK_RPE_EVT_ORG':	
								case 'TSK_RPE_MTG_ORG':	
								case 'TSK_EVT_ORG':	
								case 'TSK_MTG_ORG':	
								case 'TSK_IMG_EVT':
								case 'PRJ_CAL_IMG':	
								case 'SEC_CAL':	
									common.reduxBackendStore.dispatch(calOp.calInit(idatabaseObj));
									break;
								case 'CDE':
									 common.reduxBackendStore.dispatch(contact.contactInit(idatabaseObj));
									 break;
								default : 
									common.reduxBackendStore.dispatch(prjOp.projectInit(idatabaseObj, iSocket));
								    break;    
								}
//								if(subKeyType === "EVT" || subKeyType ==='MTG' ||  subKeyType ==='EVT' 
//									|| subKeyType ==='RPE' || subKeyType ==='MLT' || subKeyType ==='CAL' || subKeyType ==='IMG_CAL'
//								    || subKeyType ==='IMG_EVT' || subKeyType ==='DSC_CAL' || subKeyType ==='DSC_EVT' || subKeyType ==='WSC_CAL'|| subKeyType ==='WSC_EVT' || subKeyType ==='DSE' || subKeyType ==='WSE'
//								    || subKeyType === "EVT_RPE" || 	subKeyType === "MTG_RPE" || subKeyType ==='EVT_ORG' || subKeyType === 'MTG_ORG' || subKeyType === 'EVT_RPE_ORG' 
//								    || subKeyType === 'MTG_RPE_ORG' ||  subKeyType === "CAL_IMG" || subKeyType === "TSK_EVT" || subKeyType === "TSK_MTG"
//								    || subKeyType === 'TSK_SHELL_EVT' || subKeyType === 'TSK_SHELL_MTG' || subKeyType === 'TSK_RPE_EVT'  || subKeyType === 'TSK_RPE_MTG' || subKeyType === 'TSK_SHELL_EVT_ORG' 
//								    || subKeyType === 'TSK_SHELL_MTG_ORG' || subKeyType === 'TSK_RPE_EVT_ORG' || subKeyType === 'TSK_RPE_MTG_ORG'|| subKeyType === 'TSK_EVT_ORG' || subKeyType === 'TSK_MTG_ORG' 
//								    || subKeyType === 'TSK_IMG_EVT' || subKeyType === 'PRJ_CAL_IMG' || subKeyType === 'SEC_CAL'){ 
//									common.reduxBackendStore.dispatch(calOp.calInit(idatabaseObj));
//								}else if(subKeyType === "CDE" ){
//									  common.reduxBackendStore.dispatch(contact.contactInit(idatabaseObj));
//								}
//								else{
//									common.reduxBackendStore.dispatch(prjOp.projectInit(idatabaseObj, iSocket));
//								}
					
								 break;
					case 'CHT' :
					case 'CGR' :
							try{
									/*if(idatabaseObj.hasOwnProperty('insertObj')) {
										logger.info('In etWrapModules : exec : in CHT,CGR case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.insertObj.dataArray[0].ACTION_ARRAY);
									}else if(idatabaseObj.hasOwnProperty('updateObj')) {
										logger.info('In etWrapModules : exec : in CHT,CGR case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.updateObj.dataArray[0].ACTION_ARRAY);
									}else{
										logger.info('In etWrapModules : exec : in CHT,CGR case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId);
									}*/
									 common.reduxBackendStore.dispatch(chatOp.chatInit(idatabaseObj));
							}catch(e) {
									 logger.error('In etWrapModules : exec : in CHT,CGR case : Exception :', e);
							}
								 break;
								 
					case 'STG' :
//								if(idatabaseObj.hasOwnProperty('insertObj')) {
//									logger.info('In etWrapModules : exec : in STG case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.insertObj.dataArray[0].ACTION_ARRAY);
//								}else if(idatabaseObj.hasOwnProperty('updateObj')) {
//									logger.info('In etWrapModules : exec : in STG case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.updateObj.dataArray[0].ACTION_ARRAY);
//								}else{
//									logger.info('In etWrapModules : exec : in STG case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId);
//								}

								if(iSocket && iSocket.hasOwnProperty('id')) {
									idatabaseObj.socketId = iSocket.id;
								}
								common.reduxBackendStore.dispatch(stgOp.settingInit(idatabaseObj));
								break;

					case 'ORG' :
								/*if(idatabaseObj.hasOwnProperty('insertObj')) {
									logger.info('In etWrapModules : exec : in ORG case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.insertObj.dataArray[0].ACTION_ARRAY);
								}else if(idatabaseObj.hasOwnProperty('updateObj')) {
									logger.info('In etWrapModules : exec : in ORG case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.updateObj.dataArray[0].ACTION_ARRAY);
								}else{
									logger.info('In etWrapModules : exec : in ORG case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId);
								}*/
								// added by RMM to route org call to redux file
								if(iSocket &&iSocket.hasOwnProperty('id')) {
									idatabaseObj.socketId = iSocket.id;
								}
								common.reduxBackendStore.dispatch(org.orgActionreators( idatabaseObj, iSocket));
								break;
								
					case 'LOGIN':
						         common.reduxBackendStore.dispatch(loginOp.loginInit(idatabaseObj));
						          break;
						          
					case 'CDE' :
					case 'UGR' :
//								if(idatabaseObj.hasOwnProperty('insertObj')) {
//									logger.info('In etWrapModules : exec : in CDE,UGR case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.insertObj.dataArray[0].ACTION_ARRAY);
//								}else if(idatabaseObj.hasOwnProperty('updateObj')) {
//									logger.info('In etWrapModules : exec : in CDE,UGR case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.updateObj.dataArray[0].ACTION_ARRAY);
//								}else{
//									logger.info('In etWrapModules : exec : in CDE,UGR case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId);
//								}
					             common.reduxBackendStore.dispatch(contact.contactInit(idatabaseObj));
					             break;

					case 'CLD' :
						 let _UADObj = {
                    		clientInfo: _clientInfo,
                    		//socket     : socket,
                    		//broadcast: ibroadcast,
                    	//	insertObj: _insertEventsObj,
                    	//	updateObj: _UpdateEventObj,
                    		moduleName: idatabaseObj.moduleName,
                    };
//									 if(idatabaseObj.hasOwnProperty('insertObj')) {
//										 logger.info('In etWrapModules : exec : in CloudVault case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.insertObj.dataArray[0].ACTION_ARRAY);
//										 _UADObj['insertObj'] = _insertEventsObj;
//									 }else if(idatabaseObj.hasOwnProperty('updateObj')) {
//										 logger.info('In etWrapModules : exec : in CloudVault case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId, 'ACTION_ARRAY : ', idatabaseObj.updateObj.dataArray[0].ACTION_ARRAY);
//										 _UADObj['updateObj'] = _UpdateEventObj;
//									 }else{
//										 logger.info('In etWrapModules : exec : in CloudVault case : STEP 2 : UserId : ', idatabaseObj.clientInfo.userId);
//									 }
//								     if(idatabaseObj && idatabaseObj.hasOwnProperty('extraParam')) {
//					                    	_UADObj.extraParam=idatabaseObj.extraParam;
//					                  }
					                    try{
					                    	common.reduxBackendStore.dispatch(cloudValut.cloudValutInit( idatabaseObj ));
					                    }catch( e ) {
					                    	logger.error('In etWrapModules : exec : in CloudVault case  : Exception :', e);
					                    }
					                    break;
					}
				}else{
					logger.error('In etWrapModules : exec  : idatabaseObj.moduleName not present ', idatabaseObj);
					const errObj={
							type: 'ModuleName Not Present',
							data: idatabaseObj,
					};

					iSocket.emit('ErrorFromServer', errObj);
				}
	    }
	}
}

module.exports=modulesLib;