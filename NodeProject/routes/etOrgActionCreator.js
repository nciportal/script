'use strict';
/*eslint-env es6*/
/**
 * @author : RMM
 * @purpose : etOrgActionCreator file is used to route any organization related request to java
 * @date : 10/7/2016
 */

const common = require('./common');
const logger = common.logger;
/*Removed after all organization java processing will be completed */
let flag=null;

class OrgActionCreators {
	constructor() {
	}

	sendtoJava(iSingleCallObject) {
		try{
			logger.info('In etOrgActionCreator : sendtoJava');
			if(iSingleCallObject.hasOwnProperty('baton')) {
				iSingleCallObject.baton.push({
					Location: 'etOrgActionCreator_sendtoJava : node',
					Timestamp: new Date().getTime(),
				});
			}
			if(flag === true){
				common.queueLibs.sendToJavaProcess(iSingleCallObject,common.appConfigObj.client['mode'],null,"DELETE");
			}else{
				common.queueLibs.sendToJavaProcess(iSingleCallObject,common.appConfigObj.client['mode']);
			}
			
		}catch(err) {
			logger.error('In etCalendarReducer : sendtoJava : Exception : ', err);
		}
	}
	
/**
 * @author : RMM
 * @purpose : constructor to call specific function of given action
 * @date : 11/7/2016
 * @Param : iSingleCallObject has single server call object
 */
	orgActionreators(iSingleCallObject, iSocket) {
		try{
			logger.info('in etOrgActionCreator : orgAction : iSingleCallObject :');
			/*if(iSingleCallObject.hasOwnProperty('insertObj')) {
				logger.info('STEP 3 : UserId : ', iSingleCallObject.clientInfo.userId, 'ACTION_ARRAY : ', iSingleCallObject.insertObj.dataArray[0].ACTION_ARRAY);
			}else if(iSingleCallObject.hasOwnProperty('updateObj')) {
				logger.info('STEP 3 : UserId : ', iSingleCallObject.clientInfo.userId, 'ACTION_ARRAY : ', iSingleCallObject.updateObj.dataArray[0].ACTION_ARRAY);
			}else{
				logger.info('STEP 3 : UserId : ', iSingleCallObject.clientInfo.userId);
			}
			*/
			const org=new OrgActionCreators();
			
				if( iSingleCallObject ) {
   /*If iObject is not null*/

					//let actionObj= iSingleCallObject.updateObj || iSingleCallObject.insertObj;
					let action=iSingleCallObject.dataArray[0].ACTION_ARRAY;
					let callObj=iSingleCallObject;

					let Obj={
							Action: action,
					        status: 'Error',
							Message: '',
							Object: callObj,
					};

					let errObj={
							type: 'Error',
							data: Obj,
					};

				//	let _UpdateEventObj = iSingleCallObject.updateObj || iSingleCallObject.insertObj;
			/*		let _userId = iSingleCallObject.clientInfo.userId;
					let orgId = null;
					if( _UpdateEventObj.hasOwnProperty('dataArray') && _UpdateEventObj.dataArray[0].hasOwnProperty('CML_ID')) {
						orgId = _UpdateEventObj.dataArray[0].CML_ID;
					}else{
						orgId = _UpdateEventObj.dataArray[0].CON_PARAM.PKVAL;
					}
					let _socket = null;
					if(iSocket ) {
						_socket = iSocket;
					}*/
				//	logger.info('in etOrgActionCreator : orgAction : orgId :', orgId);
					
					/*All actions from front end request are present in actionArray*/
				//	if( _UpdateEventObj && _UpdateEventObj.hasOwnProperty('dataArray') && _UpdateEventObj.dataArray[0].hasOwnProperty('ACTION_ARRAY')){
						/*Object for sent to dispatch*/
						let _orgRequest = {
							    type:  iSingleCallObject.dataArray[0].actionArray[0] ,
							   /* userId: _userId,
							    orgId: orgId,
							    actionPerformed: true,*/
						};
						console.log('_UpdateEventObj_UpdateEventObj_UpdateEventObj_UpdateEventObj_UpdateEventObj_UpdateEventObj_UpdateEventObj : ',JSON.stringify(iSingleCallObject));
						switch( iSingleCallObject.dataArray[0].actionArray[0]) {

						case 'CREATE_ORGANIZATION' : /*Case to create organization*/
													/*	if(iSingleCallObject.baton) {
															iSingleCallObject.baton.push({
																Location: 'etOrgActionCreator',
																TimeStamp: new Date().getTime(),
															});
														}*/
														/* falls through */
						case 'PUBLISH_ORG_TEMPLATE'://Added by GSS :To publish organization template
						case 'UNSUBSCRIBE_ORGANIZATION'	: /*Case to delete organization by subscriber*/
						case 'ADD_SIGNUP_PROJECT' : /*Case to add project*/
						case 'DELETE_SIGNUP_PROJECT' : /*Case to delete project*/
						case 'UPDATE_SIGNUP_PROJECT' : /*Case to update project*/
							/* may be changed */
						case 'ADD_SECTION' : /*Case to add section*/
						case 'DELETE_SECTION' : /*Case to delete section*/
						case 'UPDATE_SECTION' : /*Case to update section*/
						case 'ADD_TASK' : /*Case to add task*/
						case 'DELETE_TASK' : /*Case to delete task*/
						case 'UPDATE_TASK' : /*Case to update task*/

						case 'ADD_QUESTION_BANK' : /*Case to add question bank*/
						case 'DELETE_QUESTION_BANK' : /*Case to delete question bank*/
						case 'UPDATE_QUESTION_BANK' : /*Case to update question bank*/
						case 'ADD_QUESTION_TEMPLATE' : /*Case to add question template*/
						case 'UPDATE_QUESTION_TEMPLATE' : /*Case to update question template*/
						case 'DELETE_QUESTION_TEMPLATE' : /*Case to delete question template*/
						case 'ADD_REVIEW' : /*Case to add review*/
						case 'UPDATE_REVIEW' : /*Case to update review*/
						case 'SUBMIT_APPRAISAL' : /*Case to submit appraisal*/
						case 'SUBMIT_REVIEW' : /*Case to submit review*/
						case 'SUBMIT_CONCLUSION' : /*Case to submit conclusion*/
						case 'DELETE_REVIEW' : /*Case to delete review*/
						case 'ADD_ASSET_TYPE' : /*Case to add asset type*/
						case 'DELETE_ASSET_TYPE' : /*Case to delete asset type*/
						case 'UPDATE_ASSET_TYPE' : /*Case to update asset type*/
						case 'ADD_ASSET' : /*Case to add asset*/
						case 'DELETE_ASSET' : /*Case to delete asset*/
						case 'UPDATE_ASSET' : /*Case to update asset*/
						case 'ADD_PRODUCT'				:
						case 'UPDATE_PRODUCT'				:
						case 'APPROVE_PRODUCT'				:
						case 'DELETE_PRODUCT'				:
						case 'ADD_TO_CART'				:
						case 'UPDATE_CART_ITEM'				: // Added by ASW : required when cart qty is updated from 4th column
						case 'ADD_USER' :
						case 'ADD_CALENDAR':
						case 'ADD_INVITATION'	:
						case 'UPDATE_USER':
						case 'BUY_CART':

						case 'SHIP_ORDER':
						case 'DELIVERED_ORDER':
						case 'RESIGN_EMPLOYEE':
						case 'ACCEPT_RESIGN':
						case 'DECLINE_RESIGN':
						case 'ADD_LEV':
						case 'UPDATE_LEV':
						case 'LEAVE_APPROVED':
						case 'LEAVE_TYPE_ADD':
						case 'LEAVE_DECLINE':
						case 'LEAVE_TYPE_UPDATE':
						case 'LEAVE_TYPE_DELETE':
						case 'ADD_PROMOCODE':
						case 'ADD_PROMO':
						case 'UPDATE_PROMO':
						case 'DELETE_PROMO':
						case 'ADD_SERVICE':
						case 'UPDATE_SERVICE':
						case 'DELETE_SERVICE':
						case 'ACCEPT_ORG_REQUEST':
						case 'REQUEST DECLINE':
						case 'RESEND_INVITATION':
						case 'PUBLISH_ORGANIZATION':
						case 'ADD_MLT_EVENT':
						case 'TERMINATE_EMPLOYEE':
						case 'ACCEPT_TERMINATION':
						case 'DECLINE_TERMINATION':
						case 'INACTIVE_USER':
						case 'REACTIVE_USER':
						case 'ADD_URM':   //for Move User
						case 'ADD_WIZARD':   //for add wizard,demand by dipali
						case 'ADD_TICKET':     //for tikit wizard demanded by dipali
						case 'UPDATE_TICKET':   //for tikit wizard demanded by dipali
						case 'DELETE_TICKET':  //for tikit wizard demanded by dipali
						case 'UPDATE_TICKET_SETTING' :  //added by SSD1 as per the requirement of dipali
						case 'INSERT_INVITEE': //reuirement by dipali
						case 'UPDATE_INVITEE':	//     ""
						case 'DELETE_INVITEE':  //    ""
						case 'UPDATE_ROLE':	    //Requirement by Pratibha
						case 'ADD_EVENT':       //      ""
						case 'UPDATE_CALENDAR':    //  ""
						case 'SEARCH_AND_SUBSCRIBE':  //Requiremnt by Dipali
						case 'INHERIT_PRODUCT':     //     ""
						case 'ADD_PROJECT_IOE':     //Requirement by Harshal
						case 'ADD_PROJECT_ORG_TPL':  //   ""
						case 'ADD_TPL_QUE':      //Requirement by amol for add topolgy question
						case 'UPDATE_TYPOLOGY':
						case 'ADD_STANDARD_PROJECT': // Added for standard of typology by SMM
						case 'ADD_CONCEPT' : //Added create Concept typology by SMM
						case 'ADD_FLOOR' 	: //Added For adding floors in ioe type of org by SMM
						case 'ADD_ZONE' 	: //Added For adding Zones in ioe type of org by SMM
						case 'ADD_SENSOR' 	: //Added For adding Sensor in ioe type of org by SMM
						case 'ADD_FEATURE' ://to added features by GSS
						case 'UPDATE_ORG_TPL'://to typology project by GSS
						case 'UPDATE_TPL_QUE'://to update question status by GSS
						case 'ASSIGN_ROLES'://To assign task to user in roles by GSS
						case 'UPDATE_DEVICE'://added by SSD1
						case 'CHECK_DOMAIN':	//added by SSD1
						case 'REGISTER_AND_SUBSCRIBE':
						case 'UPLOAD_CONCEPT_FILE' : //SMM changed action for upload concept
						
					
						case 'UPDATE_CONCEPT' : // GSS changed action,requirement by SW
						case 'UPDATE_STANDARD_PROJECT': //GSS- reason : to update standards
						case 'DELETE_STANDARD_PROJECT': //GSS- reason : to delete standards
						case 'DELETE_CONCEPT': //GSS- reason : to delete concept
						case 'UPDATE_FEATURE': //GSS- reason : to update feature
						case 'DELETE_FEATURE': //GSS- reason : to delete feature
						case 'UPDATE_PART':   //GSS- reason : to update part
						case 'DELETE_PART': //GSS- reason : to delete part
						case 'UPDATE_REQUIREMENT': //GSS- reason : to update requirement
						case 'DELETE_REQUIREMENT': //GSS- reason : to delete requirement
						case 'ADD_ROLE':
						case 'DELETE_ROLE':
						case 'DELETE_WIZARD':
						case 'UPDATE_SECTION_OF_DEVICE':
						case 'UPDATE_PRODUCT_SETTING'://GSS required by Dipali
						case 'UPDATE_TPL_STATUS': //SMM - reason : to update status of typology feature
						case 'UPDATE_ORG':
					
						case 'ADD_MENU':
						case 'INSERT_ATTACHEMENT':
						case 'ADD_DAY_SCHEDULE_ORG' : // SP : Case to add day schedule org
	                    case 'UPDATE_DAY_SCHEDULE_ORG' :  //SP : Case to update day schedule org
	                    case 'DELETE_DAY_SCHEDULE_ORG' : //Case to delete day schedule org : Samiksha
	                    case 'ADD_WEEK_SCHEDULE_ORG' : //Case to add week schedule org : Samiksha
	                    case 'UPDATE_WEEK_SCHEDULE_ORG' : //Case to update week schedule org : Samiksha
	                    case 'DELETE_WEEK_SCHEDULE_ORG' : //Case to delete week schedule org : Samiksha
	                    case 'ADD_IMAGE_CALENDAR_ORG' : //Case to add image calendar org : Samiksha
	                    case 'UPDATE_IMAGE_CALENDAR_ORG' : //Case to update image calendar org : Samiksha
	                    case 'DELETE_IMAGE_CALENDAR_ORG' : //Case to delete image calendar org : Samiksha
	                    case 'ADD_DAY_EVENT_ORG' : //Case to add day schedule event org : Samiksha
	                    case 'ADD_WEEK_EVENT_ORG' : //Case to add week schedule event org : Samiksha
	                    case 'UPDATE_DAY_EVENT_ORG' : //Case to update day schedule event org : Samiksha
	                    case 'UPDATE_WEEK_EVENT_ORG' : //Case to update week schedule event org : Samiksha
	                    case 'DELETE_DAY_EVENT_ORG' : //Case to delete day schedule event org : Samiksha
	                    case 'DELETE_WEEK_EVENT_ORG' : //Case to delete week schedule event org : Samiksha
	                    case 'ADD_IMAGE_EVENT_ORG' : //Case to add image calendar event org : Samiksha
	                    case 'UPDATE_IMAGE_EVENT_ORG' : //Case to update image calendar event org : Samiksha
	                    case 'DELETE_IMAGE_EVENT_ORG' : //Case to delete image calendar event org : Samiksha
	                    case 'UPLOAD_QUESTION_BANK'		  ://Added by GSS :case to upload QuestionBank : Amol
	                    case 'REMOVE_FROM_CART' ://Added by GSS : case to remove from cart:Apeksha
	                    case 'ADD_TO_WISHLIST'			  : // Added by ASW : add to wishlist
	                    case 'REMOVE_FROM_WISHLIST' : // Added by ASW : add to wishlist
	                    case 'ADD_NEW_SERVICE'			  ://Added by GSS :added New Service and Wizard : Sudarshan
	                    case 'UPDATE_NEW_SERVICE'		  ://Added by GSS :update New Service and Wizard : Sudarshan
	                    case 'DELETE_NEW_SERVICE'		  ://Added by GSS :delete New Service and Wizard : Sudarshan
	                    case 'DELETE_ZONE'				  : //Added by SMM : delete zone in a floor
	                    case 'CREATE_COMFORT_PROJECT' : //Added by SMM : create comfort project
	                    case 'UPDATE_PART_REQ' 			  ://Added by GSS :For update feature,part and requirement : Amol
	                    case 'UPLOAD_PRODUCT_CRITERIA_FILE'://Added by GSS : For uploading product criteria sheet : Amol
	                    case 'ADD_DELOS_PRODUCT'://Added by SSD : insertion of product added by new product wizard
	                    case 'UPDATE_ROLE_SETTING' : //Added by GSS : For update role setting : Sudarshan
	                    case 'ADD_PRODUCT_CLASS': //Added by GSS : For Added product class : Sudarshan
	                    case 'ADD_WELL_CRITERIA'://Added by GSS : for ADD WELL CRITERIA : Dipali
	                    case 'ADD_SCIENTIFIC_CRITERIA'://Added by GSS :for ADD SCIENTIFIC CRITERIA : Dipali
	                    case 'ADD_TECHNICAL_CRITERIA'://Added by GSS :for ADD TECHNICAL CRITERIA : Dipali
	                    case 'ADD_SAFETY_CRITERIA'://Added by GSS :for ADD SAFETY CRITERIA : Dipali
	                    case 'ADD_LEED_CRITERIA'://Added by GSS :for ADD LEED CRITERIA : Dipali
	                    case 'UPDATE_CRITERIA'://Added by GSS :for editing criteria : Dipali
	                    case 'DELETE_CRITERIA'://Added by GSS :for deleting criteria : Dipali
	                    case 'DELETE_PRODUCT_CLASS'://Added by GSS :for deleting product class : Dipali
	                    case 'UPDATE_PRODUCT_CLASS'://Added by GSS :for  editing product class : Dipali
	                    case 'UPDATE_OPTION' ://Added by SMM : for Updating question's option
	                    case 'REMOVE_EVERYTHING'://Added by GSS :for deleting all criterias under a product class:Dipali
	                    case 'EDIT_QUESTION'://Added by GSS : For updating question field:Dipali
	                    case 'EDIT_OPTION'://Added by GSS : For updating option field:Dipali
	                    case 'DELETE_QUESTION'://Added by GSS : for deleting question:Amruta.N
	                    case 'UPDATE_CLUB'://Added by GSS : For updating club level org:Dipali
	                    case 'UPDATE_TPL_PROJECT'://Added by GSS : For updating typology project:Dipali
	                    case 'UPDATE_DELOS_PRODUCT'://Added by GSS : For UPDATE_DELOS_PRODUCT:Dipali
	                    case 'UPDATE_APPOINTMENT_SETTING'://Added by GSS : update appointment setting:Sudarshan
	                    case 'UPDATE_SERVICE_SETTING'://Added by GSS : update service setting:Sudarshan
	                    case 'UPDATE_USER_SETTING'://Added by GSS : update User setting:Sudarshan
	                    case 'DELETE_DELOS_PRODUCT'://Added by GSS : for DELETE DELOS PRODUCT :Dipali
	                    case 'UPDATE_MENU'://Added by GSS:For updating menu:Amol
	                    case 'DELETE_MENU'://Added by GSS:For deleting menu:Amol
	                    case 'APPROVE_DELOS_PRODUCT'://Added by GSS : for APPROVE_DELOS_PRODUCT :Dipali
	                    case 'UNAPPROVE_DELOS_PRODUCT'://Added by GSS : for UNAPPROVE_DELOS_PRODUCT :Dipali
	                    case 'DELETE_OPTION'://Added by GSS :delete option under question :Sudarshan
	                    case 'UPLOAD_CRITERIA_INSIDE_PRODUCT_CLASS'://Added by SSD : For uploading criteria inside product class :Amol	
	                    case 'UPDATE_ORG_SETTING'://Added by SSD : For updating org setting :Dipali	
	                    case 'UPDATE_PRODUCT_STANDARD'://Added by GSS :For updating Product Standard: Sachin.W
	                    case 'UPDATE_COMFORT_PROJECT' : //Added by SSD : Update the comfort project : Sudarshan
	                    case 'DELETE_COMFORT_PROJECT'://Added by SSD : To delete comfort project :Sudarshan
	                    case 'UPDATE_FLOOR' : //Added by SSD :to update floor : Dipali
	                    case 'ASSIGN_ALL_QUESTION' : //Added by SSD:  For assigning multiple questions to single task : Amol	
	                    case 'UPDATE_TEMPLATE' : //Added by SSD : updating template object in org : Dipali
	                    case 'ADD_WIZARD_FOLDER'://Added by SSD : wizard hierarchy in org : Dipali
	                    case 'UPDATE_WIZARD_FOLDER'://Added by SSD : wizard hierarchy in org : Dipali
	                    case 'DELETE_WIZARD_FOLDER' ://Added by SSD : wizard hierarchy in org : Dipali	
	                    case 'DELETE_WELL_CRITERIA' ://Added by SSD : delete wbs criteria from product standard : Dipali
	                    case 'DELETE_ALL_QUESTION'://Added by GSS :For Deleting all questions:Amruta
	                    case 'RESET_RECIEVER'://Added by GSS :For removing all data related to reciever:Dipali
	                    case 'SUBSCRIBE_BUILDER_ORG' : //Added by SSD: In Case of Subscribing a Builder organzaition from Builder WIzard :Deepraj 
	                    case 'SUBSCRIBE_SUPPLIER_ORG'://Added by SSD : In Case of Subscribing a Supplier organzaition from Supplier WIzard :Deepraj	
	                    case 'FETCH_SHIPPED_ORDERS'://Added by SSD : to fetch all shipped orders in organization  :  Sudarshan
	                    case 'SUBSCRIBE_SERVICE_PROVIDER_ORG'://Added by SSD : for Service Provider Wizard : Deepraj 
	                    case 'ADD_SERVICE_PROVIDER'://Added by SSD : for Service Provider Wizard : Deepraj 
	                    case 'UPDATE_ORGANIZATION' : //Added by SSD : for updating organization : Dipali	
	                    case 'ACCEPT_ORG_LINK_REQUEST'://Added by GSS:For in case of accepting Organization link request for supplier , builder or service provider:Deepraj
	                    case 'DECLINE_ORG_LINK_REQUEST'://Added by GSS:For in case of decling Organization link request for supplier , builder or service provider:provider:Deepraj
	                    case 'APPROVE_ORDER'://Added by GSS:Approve the client orders at client order view in order wizard:Sudarshan
	                    case 'LINK_TO_ORGANIZATION'://Added by SSD :  Generic call to link organization from supplier, builder and Service provider wizards :Deepraj
	                    case 'RAISE_TICKET_FOR_INSTALLATION': //Added by SJ : Genrate the ticket after product get dilvered to client.
	                    case 'ADD_ORGANIZATION'://Added by SSD : org new theme : Dipali	 
	                    case 'CREATE_ROLE'://Added by SJ:org new theme:Dipali
	                    case 'MODIFY_ROLE'://Added by SJ:org new theme:Dipali
	                    case 'CREATE_WIZARD' : //Added by SSD : org new theme:Amol
	                    case 'CREATE_USER'://Added by SSD : Add new user into orgnization : Deepraj
	                    case 'MODIFY_USER' : //Added by SSD :Modify the user into organization : Deepraj
	                    case 'MODIFY_ORGANIZATION'://Added by SSD :Modify the user into organization : Deepraj
	                    case 'DELETE_USER':	//Added by SSD : delete user from organization : Deepraj
	                    case 'INSERT_NEW_INVITEE' : //Added by SJ:organization new theme actions for inserting and deleting invitee:Dipali
	                    case 'DELETE_NEW_INVITEE' : //Added by SJ:organization new theme actions for inserting and deleting invitee:Dipali
	                    case 'RECIEVE_ORGANIZATION_REQUEST' : //Added by SJ :Accepting request from inbox:Deepraj
	                    case 'DISCARD_ORGANIZATION_REQUEST': //Added by SJ : Decline request from inbox : Deeprajs
	                    case 'MODIFY_WIZARD': //Added by SJ:-for updating wizard:Dipali
	                    case 'SUBMIT_SURVEY': //Added by SSD: for submiting survey : Amruta.N	
	                    case 'MODIFY_SETTING'://Added by SSD : Org new theme action for updating setting 
	                    case 'PUBLISH_ORG'://Added by SSD :  Publish organization for new project structure :Deepraj	
	                    case 'FIND_AND_SUBSCRIBE'://Added by SSD :  subscribe to the publish orgnization : Deepraj	
	                    case 'CREATE_PROPERTY'://Added by SSD :  creating property in new theme : Deepali	
	                    case 'ADD_ROOM'://Added by SJ :add room in property : Deepali
	                    case 'UPDATE_PROPERTY'://Added by SSD : update property
	                    case 'UPDATE_ROOM':	//Added by SSD : update room
	                    case 'UPDATE_FLOOR'://Added by SSD :update floor	
	                    case 'UNSUBSCRIBE_ORG'://Added by SJ : user unsuscribe the organization : Deepraj
	                    case 'CREATE_PRODUCT' : //Added by SJ : Deepali
	        			case 'MODIFY_PRODUCT'://Added by SJ : Deeapli
	        			case 'CREATE_CATEGORY'://Added by SJ : Deeapli
	        			case 'MODIFY_CATEGORY'://Added by SJ : Deeapli
	        			case 'ADD_SPECIFICATION'://Added by SJ : Deeapli
	        			case 'UPDATE_SPECIFICATION'://Added by SJ : Deeapli
	        			case 'ADD_DEVICE'://Added by SSD: Dipali
	        			case 'CREATE_SERVICE'://Added by SJ : To create service 
	        			case 'MODIFY_SERVICE'://Added by SJ
	        			case 'IMPORT_PRODUCT_STANDARD'://Added by SJ mport product standard from excel file : Deepraj
	        			case 'INSERT_INTO_CART'://Added by SJ To add product in cart :Rajshree
	        			case 'MODIFY_CART_ITEM'://Added by SJ To update product in cart :Rajshree
	        			case 'BUY_CART_ITEM' ://Added by SSD :Buy product from cart 
	       			 	case 'MODIFY_ORDER': //Added by SJ : change the status of the order : Deepraj
	       			 	case 'CREATE_ORG_LINK': //Added by SJ : To create organisation link between organisation. : Sudarshan
	       			 	case 'ACCEPT_LINK_ORG_REQUEST' : //Added by SJ : to accept rquest : Rajshree
	       			 	case 'DECLINE_LINK_ORG_REQUEST'	: //Added by SJ : to decline request : Rajshree
	        			case 'REMOVE_ORG_LINK'://Added by SJ  To unlink the subscribed organisation.
	        			case 'ACCEPT_APPOINTMENT'://Added by SJ   Accept client appointment request. : Sudarshana
	        			case  ' DECLINE_APPOINTMENT': //Added by SJ  Decline Client appointment Request.: Rajshree
	        			case 'PROVISION_DEVICE': //Added by SJ provisioning device in clouzer : //Dipali
	        			case 'BOOK_APPOINTMENT'://Added by SJ  to book appointment ://Rajshree
	        			case 'INSERT_TASK': //Added by SSD : to insert task: //Rajshree	
	        			case 'ADD_PROPERTY': // Added by SJ :  to To add property
	        			case 'MODIFY_PROPERTY': // Added by SJ : To update property
	        			case 'CANCEL_APPOINTMENT': //Added by SJ : To cancel the appointment. : Sudarshan
	        			case 'REJECT_APPOINTMENT'://Added by SJ : Get appointment rejected : Rajshree
	        			case 'BLOCK_USER'://Added by SJ : block user for org  Request. : Vandana
	        			case 'RESEND_REQUEST'://Added by SJ :  Resend orgrequest to user if he declines the request : Komal
	        			case 'COMPLETE_APPOINTMENT': //Added by SJ : To Complete appointment.: Rajshree
	        			case 'CREATE_TICKET'://Added by SJ : ticket functionality in for new them. : Vandana
	        			case 'MODIFY_TICKET'://Added by SJ : ticket functionality in for new them. :Vandana
	        			case 'REMOVE_TICKET'://Added by SJ to delete the Property
	        			case 'ASSIGN_TICKET'://Added by SJ Assign client raised ticket to service men.:Sudarshan
	        			case 'RESOLVE_TICKET'://Added by SSD Ticket completed and accept solution for Ticket
	        			case 'ARCHIVE_TICKET'://Added by SSD Ticket completed and accept solution for Ticket 	
	        			case 'TICKET_FEEDBACK'://Added by Supplier will request to client to add more information about ticket.:Sudarshan
	        			case 'REOPEN_APPOINTMENT'://Added by To Reopen rejected  appointment.:Rajshree
	        			case 'REJECT_SOLUTION'://Added by SJ client  will bee reject solution for Ticket.:Vandana
	        			case 'ADD_GROUP_OF_DEVICES'://Added by SJ for adding group of devices : Rajshree
	        			case 'UNBLOCK_USER'://Added by SJ  unblock user for org  Request.:Komal
	        			case 'ADD_SCENE'://Added by SJ for adding : Rajshree
	        			case 'UPDATE_SCENE'://Added by SJ :for updating scenes : Rajshree
	        			case 'INSERT_SCENE_EVENT'://Added by SJ : for  for adding scene event : Rajshree
	        			case 'MODIFY_SCENE_EVENT'://Addded by SJ :  for for updating scene event : Rajshree
	        			case 'CREATE_CUSTOM_GROUP'://Added by SJ : create the contact group : Vandana
	        			case 'MODIFY_CUSTOM_GROUP'://Added by SJ : update the contact group : Vandana
	        			case 'UNGROUP_DEVICES': //Added by SJ : Anjali
	        			case 'RESEND_REQUEST'://Added by SJ :  Komal Gulve
	        			case 'SET_WORKSPACE':
	        			case 'CREATE_SUB_ORDER'://Added by SJ : Sudarshan
	        			case 'MODIFY_SUB_ORDER'://Added by SJ : Sudarshan
	        			case 'INSERT_MULTIPLE_SCENE_EVENT': //Added by SJ : Rajshree
	        			case 'BUY_SUB_ORDER_CART_ITEM'://Added by SJ : Sudarshan
	        			case 'ACCEPT_SOLUTION'://Added by SSD: client accept the solution for ticket :Vandana
	        			case 'MODIFY_INVITATION'://Added by SJ :  To modify organisation subscription invitation //Sudashran
	        			case 'ADD_PROPERTY_PRODUCT' : //Added by SSD : for adding property as product
	        			case 'MODIFY_PROPERTY_PRODUCT' ://Added by SSD : for updating product	
	        			case 'ADD_USER_IN_GROUP'://Added by GSS : for replicate selected user under Group
	        			case 'CANCEL_ACTIVE_APPOINTMENT'://Added by SJ : for To cancelled active  appointment.z
	        			case 'CREATE_ORG_CATEGORY': //Added by SJ : Vandana
	        			case 'MODIFY_ORG_CATEGORY'://Added by SJ : Vandana
	        			case 'UPDATE_IMG_CAL_SETTING'://Added by SJ :Komal
	        			case 'CREATE_ZONE'://
	        			case 'MODIFY_ZONE'://
	        			case 'ADD_HUB_DEVICE'://
	        			case 'PROVISION_PROPERTY_DEVICE'://
	        			case 'UPDATE_HUB_IN_PROPERTY':
	        			case 'ADD_HUB_RECEIVER'://
	        			case 'MODIFY_PROPERTY_PRODUCT_SELF'://Added by SJ : Vandana
	        			case 'MODIFY_PROPERTY_PRODUCT_PUBLISH'://Added by SJ : Vandana
	        			case 'ACCEPT_PROPERTY_UPDATE'://Added by SJ :  Vandana
	        			case 'REJECT_PROPERTY_UPDATE'://Added by SJ  : Vandana
	        			case 'CREATE_SERVICE_REQUEST'://Added by SJ : Vandana
	        			case 'ACCEPT_SERVICE_REQUEST'://Added by SJ : Vandana
	        			case 'DECLINE_SERVICE_REQUEST'://Added by SJ : Vandana
	        			case 'CREATE_ELEMENT'://Added by SJ : Sudarshan
	        			case 'MODIFY_ELEMENT'://Added by SJ : Sudarshan
	        			case 'DELETE_DEVICE'://Added by SJ : Rajshree
	        			case 'CREATE_DEVICE'://Added by SJ : Anajali
	        			case 'CREATE_PHYSICAL_ZONE': //Added by SSD : Komal
	        	 		case 'MODIFY_PHYSICAL_ZONE'://Added by SSD : Komal	 
	        	 	    case 'ADD_ORG_LINK'://Added by SJ : Suadharshan
	        	 	    case 'ARCHIVE_PROPERTY_PRODUCT'://Added by ravi : To archive property and product : Rajshree	
	        	 	    case 'UNARCHIVE_PROPERTY_PRODUCT'://Added by ravi : To unarchive (restore) property and product : Rajshree	
	        	 	    case 'MODIFY_SUBSCRIPTION_COUNT'://Added by ravi : Update subscription request project count :  Suadharshan
	        	 	    case 'MODIFY_SUB_REQ_TASK'://Added by ravi : Modify publication and subscription sections : Suadharshan
	        	 	    case 'CREATE_PRODUCT_STANDARD_CATEGORY'://Added by ravi : Create Product standard Category  : Vandana
	        	 	    case 'CREATE_PRODUCT_CATEGORY_SPECIFICATION'://Added by ravi : Vandana
	        	 	    case 'DELETE_FLOOR'://Added by mayur : New Flow  for Delete. : Vandana
	       	 	        case 'DELETE_ROOM'://Added by mayur : New Flow  for Delete. : Vandana
	       	 	        case 'DELETE_ELEMENT'://Added by mayur : Vandana
	       	 	        case 'DELETE_ORG_CATEGORY'://Added by mayur : Vandana
	       	 	        case 'DELETE_PROJECT'://Added by mayur : Vandana
	                    /*Send data to java functions*/
	                    	logger.info('In etOrgActionCreator : orgAction :');
	                    	flag =false;
                    		org.sendtoJava(iSingleCallObject);

					//		logger.info('in etOrgActionCreator : orgAction : _orgRequest :', _orgRequest);
							/*call dispatch to maintain state*/
							return _orgRequest;
							
	                    case 'DELETE_ORGANIZATION' : /*Case to delete organization by creator*/
	                    case 'REMOVE_WIZARD': //Added by SJ : Amol
	                    case 'REMOVE_ROLE'://Added by SJ:org new theme:Dipali
	                    case 'REMOVE_ORGANIZATION':////Added by SJ:org new theme:Dipali
	                    case 'REMOVE_USER' : //Added by SSD : To delete the user from organization. : Deepraj
	        			case 'REMOVE_PRODUCT'://Added by SJ : Deeapli
	        			case 'REMOVE_CATEGORY'://Added by SJ : Deeapli
	        			case 'DELETE_SPECIFICATION'://Added by SJ : Deeapli
	        			case 'REMOVE_PROPERTY'://Added by SJ:Dipali
	        			case 'REMOVE_ROOM'://Added by SJ:Dipali
	        			case 'REMOVE_FLOOR'://Added by SJ:Dipali
	        			case 'REMOVE_DEVICE'://Added by SSD : Dipali
	        			case 'REMOVE_SERVICE'://Added by SJ 
	        			case 'DELETE_FROM_CART'://Added by SJ  To delete cart item 
	        			case 'DELETE_PROPERTY': //Added by SJ  To delete property
	        			case 'REMOVE_CUSTOM_GROUP'://Added by SJ delete the contact group : Vandana
	        			case 'DELETE_SCENE'://Added by SJ : for for deleting scenes : Rajshree
	        			case 'DELETE_GROUP_DEVICE':// Added by SJ : Rajshree
	        			case 'DELETE_SCENE_EVENT'://Addded by SJ :  for deleting scene event : Rajshree
	        			case 'REMOVE_PROPERTY_PRODUCT' : //Added by SSD : for deleting product
	        			case 'REMOVE_ORG_CATEGORY'://Added SJ :Vandana
	        			case 'REMOVE_ZONE'://
	        			case 'REMOVE_ELEMENT'://Added by SJ : Sudarshan
	        			case 'REMOVE_PHYSICAL_ZONE'://Added by SSD : Komal
	        			
	        			
	                    	flag =true;
	                    	org.sendtoJava(iSingleCallObject);
	                    	break;
	                   
	        			case 'UPLOAD_PRODUCT_FILE' : 
	        			case 'UPLOAD_USER_FILE':
	        			case 'UPLOAD_SERVICE_FILE':	
	        			case 'UPLOAD_PRODUCT_CATEGORY_FILE': ////Added by SJ : Vandana
	        		//	case 'GET_USER_FILE'://Added bh SJ : Deepraj
	        			    	common.queueLibs.sendToJavaProcess(iSingleCallObject,common.appConfigObj.client['mode'],null,"UPLOAD");
	        				   break; 
	                    	
						default:
							flag =false;
							logger.info('in etProjectActionCreator : actionCreators : default case ');
							if( _socket ){
								errObj.Message= "Given Action was not present";
								let err=JSON.stringify(errObj);
								_socket.emit("ErrorFromServer" , err);
							}
						}
		/*			}else{
						return error to client side 
						if( _socket ) {
							errObj.Message='Action-array was not present';
							const err=JSON.stringify(errObj);
							_socket.emit('ErrorFromServer', err);
						}
						//return errObj;
					}*/
			  }else{
				 }
			}catch( error ) {
				logger.error('in etOrgActionCreator : actionCreators  : exception ', error );
		}
	}

 }
exports.OrgActionCreators = OrgActionCreators;