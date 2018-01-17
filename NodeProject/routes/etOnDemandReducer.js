/*eslint-env es6*/
/**
 * @author  : SSD1
 * @purpose : etContactReducer.js is for redux states of contact module
 * @date    : 15 July 2016
 */

'use strict';
const common		= require('./common');
const logger = common.logger;

class OnDemandReducer {
	constructor() {
	}

	sendDataToJava(iObj) {
		try{
			logger.info('In etOnDemandReducer : sendDataToJava : ');
		//	console.log(typeof(iObj));
			if(iObj.hasOwnProperty('baton')){
				iObj.baton.push({Location: 'etOnDemandReducer_sendDataToJava : node', Timestamp: new Date().getTime()});
			}
			
			common.queueLibs.sendToJavaProcess(iObj, common.appConfigObj.client['mode'], null, 'ONDEMAND_REQUESTS');
		}catch(err) {
			logger.error('In etOnDemandReducer : sendDataToJava : Exception : ', err);
		}
	}

	reducer(state, action) {
		const ondemand = new OnDemandReducer();
		let type = action.type;
		let _newState = null;
		let INITIAL_STATE_ON_DEMAND = {

		};

		state = state || INITIAL_STATE_ON_DEMAND;
		if(action)
			switch (action.type) {
			case 'FETCH_MY_FOLL_TASKS':
			case 'FETCH_MY_COMP_TASKS':
			case 'FETCH_OTHER_COMP_TASKS':
			case 'FETCH_MY_MONITOR_TASKS':
			case 'FETCH_APPRO_TASKS':
			case 'FETCH_ALL':
			case 'FETCH_MY_FOLL_TASKS_SECTION'	:
			case 'FETCH_MY_COMP_TASKS_SECTION'	:
			case 'FETCH_OTHER_COMP_TASKS_SECTION':
			case 'FETCH_MY_MONITOR_TASKS_SECTION':
			case 'FETCH_APPRO_TASKS_SECTION':
			case 'FETCH_ALL_SECTION':
			case 'FETCH_TASK_FOLL_STATUS':
			case 'FETCH_TASK_MYCOMP_STATUS':
			case 'FETCH_TASK_OTHCOMP_STATUS' :
			case 'FETCH_TASK_MONITOR_STATUS' :
			case 'FETCH_TASK_APPROV_STATUS'	:
			case 'FETCH_ALL_TASK_STATUS' :
			case 'FETCH_TASK_FOLL_PRIORITY':
			case 'FETCH_TASK_MYCOMP_PRIORITY':
			case 'FETCH_TASK_OTHCOMP_PRIORITY':
			case 'FETCH_TASK_MONITOR_PRIORITY':
			case 'FETCH_TASK_APPROV_PRIORITY':
			case 'FETCH_ALL_TASK_PRIORITY' :
			case 'FETCH_TASK_FOLL_DATE' :
			case 'FETCH_TASK_MYCOMP_DATE' :
			case 'FETCH_TASK_OTHCOMP_DATE':
			case 'FETCH_TASK_MONITOR_DATE':
			case 'FETCH_TASK_APPROV_DATE':
			case 'FETCH_ALL_TASK_DATE':
			case 'FETCH_TASK_FOLL_ASSIGNED_BY':
			case 'FETCH_TASK_MYCOMP_ASSIGNED_BY':
			case 'FETCH_TASK_OTHCOMP_ASSIGNED_BY':
			case 'FETCH_TASK_MONITOR_ASSIGNED_BY':
			case 'FETCH_TASK_APPROV_ASSIGNED_BY':
			case 'FETCH_ALL_TASK_ASSIGNED_BY':
			case 'FETCH_TASK_FOLL_ASSIGNED_TO':
			case 'FETCH_TASK_MYCOMP_ASSIGNED_TO':
			case 'FETCH_TASK_OTHCOMP_ASSIGNED_TO':
			case 'FETCH_TASK_MONITOR_ASSIGNED_TO':
			case 'FETCH_TASK_APPROV_ASSIGNED_TO':
			case 'FETCH_ALL_TASK_ASSIGNED_TO':
			case 'FETCH_IOT_DATA':
			case 'GET_TPL_PRJ_AREA':
			case 'GET_TPL_PRJ':
			case 'FETCH_OTHER_COMP_TASKS_COUNT_SECTION':
			case 'FETCH_MY_FOLL_TASKS_COUNT_SECTION':
			case 'FETCH_MY_MONITOR_TASKS_COUNT_SECTION':
			case 'FETCH_MY_COMP_TASKS_COUNT_SECTION':
			case 'FETCH_TASK_ASSIGNED_BY_ME_COUNT_SECTION':
			case 'FETCH_TASK_APPROVED_BY_ME_COUNT_SECTION':
			case 'FETCH_ALL_TASKS_COUNT_SECTION':
			case 'FETCH_OTHER_COMP_TASKS_COUNT_ASSIGNED_TO':
			case 'FETCH_MY_FOLL_TASKS_COUNT_ASSIGNED_TO':
			case 'FETCH_MY_MONITOR_TASKS_COUNT_ASSIGNED_TO':
			case 'FETCH_MY_COMP_TASKS_COUNT_ASSIGNED_TO':
			case 'FETCH_TASK_ASSIGNED_BY_ME_COUNT_ASSIGNED_TO':
			case 'FETCH_TASK_APPROVED_BY_ME_COUNT_ASSIGNED_TO':
			case 'FETCH_ALL_TASKS_COUNT_ASSIGNED_TO':
			case 'FETCH_OTHER_COMP_TASKS_COUNT_ASSIGNED_BY':
			case 'FETCH_MY_FOLL_TASKS_COUNT_ASSIGNED_BY':
			case 'FETCH_MY_MONITOR_TASKS_COUNT_ASSIGNED_BY':
			case 'FETCH_MY_COMP_TASKS_COUNT_ASSIGNED_BY':
			case 'FETCH_TASK_ASSIGNED_BY_ME_COUNT_ASSIGNED_BY':
			case 'FETCH_TASK_APPROVED_BY_ME_COUNT_ASSIGNED_BY':
			case 'FETCH_ALL_TASKS_COUNT_ASSIGNED_BY':
			case 'FETCH_OTHER_COMP_TASKS_COUNT_DATE':
			case 'FETCH_MY_FOLL_TASKS_COUNT_DATE':
			case 'FETCH_MY_MONITOR_TASKS_COUNT_DATE':
			case 'FETCH_MY_COMP_TASKS_COUNT_DATE':
			case 'FETCH_TASK_ASSIGNED_BY_ME_COUNT_DATE':
			case 'FETCH_TASK_APPROVED_BY_ME_COUNT_DATE':
			case 'FETCH_ALL_TASKS_COUNT_DATE':
			case 'FETCH_OTHER_COMP_TASKS_COUNT_PRIORITY':
			case 'FETCH_MY_FOLL_TASKS_COUNT_PRIORITY':
			case 'FETCH_MY_MONITOR_TASKS_COUNT_PRIORITY':
			case 'FETCH_MY_COMP_TASKS_COUNT_PRIORITY':
			case 'FETCH_TASK_ASSIGNED_BY_ME_COUNT_PRIORITY':
			case 'FETCH_TASK_APPROVED_BY_ME_COUNT_PRIORITY':
			case 'FETCH_ALL_TASKS_COUNT_PRIORITY':
			case 'FETCH_OTHER_COMP_TASKS_COUNT_STATUS':
			case 'FETCH_MY_FOLL_TASKS_COUNT_STATUS':
			case 'FETCH_MY_MONITOR_TASKS_COUNT_STATUS':
			case 'FETCH_MY_COMP_TASKS_COUNT_STATUS':
			case 'FETCH_TASK_ASSIGNED_BY_ME_COUNT_STATUS':
			case 'FETCH_TASK_APPROVED_BY_ME_COUNT_STATUS':
			case 'FETCH_ALL_TASKS_COUNT_STATUS':
			case 'CALENDAR_EVENTS':
			case 'GET_PROJECTS':
			case 'GET_TYPOLOGY':
			case 'GET_TPL_QUE':
			case 'GET_DASHBOARD_DETAILS':
			case 'GET_ORG_TPL_TSK':
			case 'GET_USR_ORG_TPL_TSK':
			case 'GET_USR_TSK_EVT':
			case 'GET_CAL_TPL_PRJ':
			case 'GET_STD_FILE':
			case 'GET_CLIENT_TICKETS':
			case 'GET_ALL_TICKETS':
			case 'GET_ASSIGNED_TICKETS':
			case 'GET_CLIENT_ARCHIVED_TICKETS' :
			case 'GET_ALL_ARCHIVED_TICKETS' :
			case 'GET_ASSIGNED_ARCHIVED_TICKETS' :
			case 'FETCH_ASSIGNED_BY_ME_SECTION':
			case 'SYNC_ORG_DATA' :
			case 'GET_ORG':
			
			case 'GET_SPECIFIC_DATE_DATA':
			case 'GET_SERVICES' : /* Jan 6 : Sudarshan : Added By SMM : For fetching services of ORG*/
			case 'GET_APPROVED_PRODUCTS': //jan 9 :Amol:added by GSS : for GET_APPROVED_PRODUCTS
			case 'GET_UNAPPROVED_PRODUCTS':	//jan 9 :Amol:added by GSS : for GET_UNAPPROVED_PRODUCTS
		//	case 'GET_USER_FILE' : // 10 jan Amol:added by GSS :For download file
			case 'GET_PRODUCT_FILE' : // 10 jan Amol:added by GSS :For download product
			case 'GET_SKILLS_OF_USER'://12 jan Dipali :added by GSS :for fetching skills of that user (tasks)
			case 'GET_EDUCATION_OF_USER'://12 jan Dipali :added by GSS :for fetching education of that user (tasks)
			case 'GET_EXPERIENCE_OF_USER'://12 jan Dipali :added by GSS :for fetching experience of that user (tasks)
			case 'GET_CHILD': //17 jan Varun :added by GSS :for Concept , feature , parts and requirement fetching(Org)
			case 'GET_SERVICE_FILE'://18 jan Sudarshan:added by SSD :for download file
			case 'GET_SECTIONS' : //19 Jan Amol :Added by GSS :To fetch Product category
			case 'GET_TASKS' : //20 Jan SMM :Added by SMM :To fetch zones from floors
			case 'FETCH_ORG_TYPES'://19 Jan Amol :Added by GSS: To fetch orgtypes
			case 'GET_ORG_TEMPLATES'://19 Jan Amol :Added by GSS:To fetch templates of organization
			case 'GET_WIZ_ON_STORE'://19 Jan Amol :Added by GSS:To fetch wizards
			case 'FETCH_ROL':  //23 Jan Amol: Added By GSS:For fetching role objects
			case 'GET_CERTIFICATION_PROJECT' ://Added by SMM: for AMOL and AMAR download ORG_TPL project
			case 'GET_QUESTION_FILE' ://Added by GSS: for AMOL For downloading Question file
			case 'GET_ORG_CAL_EVT' : //27 Jan Himayat :Added by SSD1
			case 'GET_RECEIVER_TASKS': //Added by SMM : For fetching tasks in Receiver
			case 'FETCH_ARCHIVED_LEAVES'://	Added by GSS: for AMOL For fetch archived leaves
			case 'FETCH_LEAVE_TYPE':     //Added by GSS: for AMOL For fetch leave types
			case 'GET_COMFORT_CALCULATION_PROJECT' : //Added by SMM : For fetching project in Comfort Factor project
			case 'GET_COMFORT_CALCULATION_CONCEPT' : //Added by SMM : For fetching project in Comfort Factor Section
			case 'GET_COMFORT_CALCULATION_OBJECTS' : //Added by SMM : For fetching project in Comfort Factor Object
			case 'GET_RECEIVER_TASKS_BY_FLOOR' :
			case 'GET_PRODUCT_CRITERIA_PROJECT'://Added by GSS :For fetching product criteria projects:AMOL
			case 'GET_PRODUCT_CRITERIA_CONCEPT'://Added by GSS :For fetching product criteria sections:AMOL
			case 'GET_PRODUCT_CRITERIA_TASKS'://Added by GSS :For fetching product criteria tasks and subtasks:AMOL
			case 'FETCH_OTHER_PENDING_TASKS_COUNT_SECTION'://added by SSD
			case 'FETCH_OTHER_PENDING_TASKS': //added by SSD
			case 'FETCH_AWAITING_RES_TASKS'://added by SSD
			case 'FETCH_AWAITING_RES_TASKS_COUNT_SECTION': //added by GSS :Rhishikesh
			case 'GET_IMAGE_FREE_SLOTS'://Added By GSS:Free slots calculation of image calendar:Dipali
			case 'GET_IMG_CAL_EVT'://Added By GSS:Himayat
			case 'SUBSCRIBE_IMAGE_CALENDAR'://Added By GSS:for subscribing image calendar:Himayat
			case 'GET_PRODUCT_CRITERIA_SUBTASKS'://Added By GSS:Sachin.W
			case 'GET_DELOS_PRODUCTS_BY_FILTER'://Added By GSS:Filters in delos product:Dipali
			case 'GET_DONUTS_CHART':
			case 'GET_CONCEPT': //Added By GSS:For fetching concepts:Amruta.N
			case 'GET_FEATURE': //Added By GSS:For fetching features:Amruta.N
			case 'GET_PART':   //Added By GSS:For fetching parts:Amruta.N
			case 'GET_DESCRIPTION_REQUIREMENT': //Added By GSS:For fetching requirements:Amruta.N
			case 'GET_ORG_CAL'://Added By GSS:For getting all calendars in a particular organisation:Himayat
			case 'GET_ALL_IMG_CAL_EVT'://Added By GSS:For getting all calendar events (i.e published and non published):Himayat
			case 'GET_PUBLISHED_IMG_CAL_EVT'://Added By GSS:for getting store calendar events i.e only published events:Himayat
			case 'GET_DRAG_DROP_QUESTION' : //Added by SMM: for getting drag and drop questions
			case 'GET_ARCHIVE_WELLAP'://Added by SSD :  fetching archived well ap:Dipali
			case 'GET_ARCHIVE_CLIENTS'://Added by SSD : fetching archived clients:Dipali
			case 'GET_ARCHIVE_CLIENT_PROJECTS':	//Added by SSD : fetching archived projects under client:Dipali	
			case 'EXPORT_TASKS'://Added by GSS:for Export Task:Rhshikesh
			case 'GET_DELOS_PRODUCTS_BY_CONCEPT'://Added by GSS : For fetching delos product by given WBS concept id : Amol
			case 'GET_SUBSCRIBED_IMG_CAL_EVT'://Added By GSS:for getting subscribers image calendar event:Himayat
			case 'ONDEMAND_DASH_TASK_COUNT'://Added By GSS:for Used in Project Panel for DashBoard donut chart:Arun
			case 'GET_FOLLOWUP_TASKS_COUNT'://Added By GSS:for Used at Daily Page in FollowUp Window for donut chart:Arun
			case 'GET_STYLIST_APPOINTMENTS'://Added By GSS:For GET_STYLIST_APPOINTMENTS:Dipali
			case 'GET_DEVICE_EVENTS' : //Added By SSD:For GET_DEVICE_EVENTS:Dipali
			case 'GET_PROPERTY_CALENDAR'://Added By GSS:For GET_PROPERTY_CALENDAR:Dipali
			case 'GET_CERT_LEV_TPL_PRJ'://Added By GSS:For Get all the certification wise count of all projects:Sudarshan
			case 'GET_TPL_PRJ_COUNTRY_WISE'://Added By GSS:For Get all the country wise count of all projects:Sudarshan
			case 'GET_ALL_TPL_PRJ'://Added By GSS:For To get all the project count:Sudarshan
			case 'RELEASE' : //Added By SSD: for project : Lalit
			case 'ARCHIVE_TASKS':	//Added By SSD: for archive tasks : Lalit
			case 'FETCH_ALL_PROJECT_TASK'://Added By GSS:For none filter and split view in project Panel:Arun
			case 'UNSUBSCRIBE_PROJECT'://Added by SSD :for unsubscribe projects:Lalit
			case 'DELETED_PROJECTS'://Added by SSD:for deleted projects : Lalit
			case 'ARCHIVE_PROJECTS'://Added by SSD :for archive projects : Lalit
			case 'GET_ONDEMAND_PROJECTS'://Added by SSD: for ondemend projects : Lalit
			case 'GET_SCHEDULE_FREE_SLOTS' : //Added by SSD :For day week schedule free slots :Dipali
			case 'GET_FEATURE_AND_PART'://Added by SSD :for gettig feature and part : Amruta	
			case 'GET_ALL_DSC_CAL_EVT'://Added by SSD :for fetching creator side events:Himayat
			case 'GET_PUBLISHED_DSC_CAL_EVT'://Added by SSD :for fetching published events : Himayat
			case 'GET_SUBSCRIBED_DSC_CAL_EVT'://Added by SSD:for fetching subscribed events:Himayat	
			case 'SUBSCRIBE_DAY_SCHEDULE' : //Added by SSD : for subscribing day schedule : Himayat	
			case 'GET_CALENDAR_STORE_DATA': //Added by SSD : for getting store data : Samiksha
			case 'GET_CREATOR_ORDERS' : //Added by SSD: to get the creator order which was added in cart:Sudarshan 
			case 'GET_CLIENT_ORDERS' ://Added by SSD :  to get the client order which was added in cart : Sudarshan
			case 'FETCH_CLIENT_ORDERS'://Added by SSD : to fetch all client orders : Sudarshan	
			case 'GET_ALL_BUILDERS'://Added by GSS : Searching Builders for subscription from builder wizard :Deepraj
			case 'GET_ALL_SUPPLIERS'://Added by GSS : Searching Supplier for subscription from supplier wizard:Deepraj
			case 'GET_ORG_BUILDERS'://Added by GSS :Searching Builders from builder wizard :Deepraj
			case 'GET_ORG_SUPPLIERS'://Added by GSS :Searching Supplers from Supplier wizard :Deepraj
			case 'GET_SUBSCRIPTION_REQUEST'://Added by GSS :Subscription request fetch from Subscription Request wizard :Deepraj
			case 'FETCH_ORG_MY_ORDERS'://Added by SSD : to fetch all client organization orders : Sudarshan
			case 'FETCH_ORG_CLIENT_ORDERS': //Added by SSD : rganization own orders : Sudarshan
			case 'GET_ORG_SERVICE_PROVIDERS'://Added by SSD : for Service Provider Wizard:Deepraj
			case 'GET_ALL_SERVICE_PROVIDERS'://Added by SSD : for Service Provider Wizard:Deepraj
			case 'FETCH_SERVICES'://Added by GSS : to fetch all services in old service wizard : Sudarshan
			case 'GET_FILTER_WISE_ORG_SUPPLIERS'://Added by SSD : fetch Supplier filter wise Accepted, Rejected, Pending and All:Deepraj
			case 'GET_FILTER_WISE_ORG_BUILDER'://Added by SSD : fetch Builder filter wise Accepted, Rejected, Pending and All.:Deepraj 
			case 'GET_FILTER_WISE_ORG_SERVICE_PROVIDER'://Added by SSD :  fetch Service Provider filter wise Accepted, Rejected, Pending and All.:Deepraj
			case 'GET_PUBLISHED_ORG_FOR_LINK'://Added by SSD :  Generic call for get all published Supplier, Builder and Service Provider:Deepraj
			case 'GET_FILTER_WISE_ORG' ://Added by SSD : Generic call for get  Supplier, Builder and Service Provider:Deepraj	
			case 'TODAY_TASKS': //Added by SJ
	        case 'FUTURE_TASKS'://Added by SJ
	        case 'DELAYED_TASKS'://Added by SJ
			case 'FETCH_CLIENT_BASKET_ORDERS':
			case 'FETCH_FILTERED_PROJECT_DATA'://Added by SSD  : Fetch project according to selected filters : Arun 
			case 'FETCH_PROJECT_TAG'://Added by SSD  : Fetch all tags for project filter : Arun 
			case 'FETCH_PROJECT_MANAGER' : //Added by SSD  : Fetch all manager list for project filter : Arun
			case 'FETCH_TEAM_TASK_OVERVIEW': //Added by SJ :  for team tab overview subtab
			case 'FETCH_TEAM_TASK_SCHEDULE': //Added by SJ : for team tab schedule subtab
			case 'FETCH_CALENDAR_DATA': //Added byb SJ : getting the data which is not stored in the indexdb.
			case 'FETCH_SEC_OVERVIEW_COUNT' ://Added by SJ
			case 'FETCH_STATUS_OVERVIEW_TASK' ://Added by SJ
			case 'FETCH_TEAM_TASK_SCHEDULE'://Added by SJ
			case 'FETCH_SEC_TASK': //Added by SJ
			case 'GET_PROJECT_TASKS_COUNT': //Added by SJ
			case 'FETCH_ALL_BUNDLES' : //Added by SSD :  this call fetch all product bundles in product catlog : Deepraj
			case 'FETCH_BUNDLE_PRODUCTS'://Added by SSD :  this call fetch all products within the specific bundle : Deepraj	
			case 'FETCH_INPROGRESS_PROJECT'://Added by SJ : requirement  of projects in  In_Progress and completed projects tab in project listing.:Anjali
			case 'FETCH_COMPLETED_PROJECT'://Added by SJ : requirement  of projects in  In_Progress and completed projects tab in project listing.:Anjali
			case 'SYNC_ORG' : //Added by SSD :Apeksha
			case 'FETCH_ROLE_WISE_PER'://Added by SSD : Rolwise total completion percentage calculation : Sudarshan
			case 'FETCH_USER_WISE_PER' : //Added by SSD : User wise total percentage calculation : Sudarshan
			case 'FETCH_COMPLETE_PER'://Added by SSD : Complete percentage calculation. : Sudarshan	
			case 'GET_ORG_TYPES'://Added by SSD : Get all the super organisation for new theme. : Sudarshan	
			case 'EXPORT_TASK':////Added by SJ:Anjali D
			case 'FETCH_TASK_FILTER' : //Added by SJ:for fetching task according to task filter : Varun
			case 'FETCH_MILESTONE_DATA' : //Added by SJ:for fetching milestone risk and task count :Varun
			case 'FETCH_MILESTONE_FILTER' ://Added by SJ: for fetching milestone according to filter :Varun
			case 'FETCH_PRODUCT_MODELS'://Added by SJ:In case of fetching product models in product catlog : Deepraj
			case 'FETCH_VENDORS_DETAIL'://Added by SJ:Fetch vendor details for perticular modle : Deepraj
			case 'FETCH_APPROVED_BUNDLES'://Added by SJ:fetch approved bundle form product catlog : Deepraj
			case 'FETCH_UNAPPROVED_BUNDLES'://Added by SJ:fetch unapproved bundle form product catlog :Deepraj
			case 'FIND_PUBLISHED_ORG'://Added by SSD :find the all published derived organization :Deepraj	
			case 'FETCH_FILTERED_AGENDA_TASK'://Added by SSD : Used for fetching task in Agenda task listing tab : Arun	
			case 'SHUFFLE_TPL_TASK'://Added by SSD :  To shuffle date of typology task between provided start and end range : Sudarshan	
			case 'GET_FLOORS'://Added by SSD : floors : Umesh 
			case 'GET_ROOMS': //Added by SJ : fetching rooms via ondemand :Deepali
			case 'FILTER_PROJECT_TYPOLOGY_WISE':////Added by SJ :  to get the typology wise project count:Deepraj
			case 'GET_COMFORT_SECTIONS'://Added by GSS : To fetch the sections under the comfort project :Deepraj
			case 'GET_COMFORT_TASK'://Added by GSS :To fetch tasks under the comfort section:Deepraj
			case 'GET_SENSORS'://Added by SSD:for getting sensors
			case 'FETCH_MILESTONE_TAG': //Added by swati : varun
			case 'GET_ROLES'://Added by SSD:  To fetch the role : Rajashree	
			case 'GET_ALL_PRODUCTS' : //Added by SJ : To get all the product from product database : Sudarshan
			case 'GET_SECTION_WISE_PRODUCTS': //Added by SJ :  Fetch category wise products from product database.: Sudarshan
			case 'GET_ALL_SECTIONS'://Added by SJ :Sudarshan
			case 'GET_CATEGORY_SPECIFICATION'://Added by SJ :Sudarshan
			case 'GET_PRODUCT_SPECIFICATION'://Added by SJ :Sudarshan
			case 'PROJECT_IGNITE_OPERATION'://Added by SJ :  back-end requirement for clearing cache of ignite : Varun
			case 'FETCH_SERVICE_SECTIONS': //Added by SJ : To fetch all service sections. : Sudarshan
			case 'GET_ALL_SERVICES': //Added by SJ :  To fetch all services. : Rajshree
			case 'GET_SERVICE_SPECIFICATION':// //Added by SJ :
			case 'EXPORT_EVENT' : //Added by SSD  : for handling the export event 
			case 'EXPORT_MEETING'://Added by SSD : for handling the export meetings . 
		    case 'FETCH_FOLDER_DATA' : //Added by SJ
		    case 'FETCH_PRODUCT_SECTIONS'://Added by SJ To fetch all product sections :Sudarshan
		    case 'EXPORT_PRODUCT_STANDARD'://Added by SJ  Get the existing product standard into excel sheet : Deepraj
		    case 'FETCH_CART_ITEMS' : //Added by SSD : To fetch cart items : Rajashree
		    case 'FETCH_PRODUCT_FROM_CART'://Added by SJ  To fetch cart product items : Rajashree
		    case 'FETCH_ORDERS':// Added by SJ : Fetch orders from database : Deepraj
		    case 'FETCH_ALL_SUPPLIER'://Added by SJ : To fetch all supplier organisation. : Sudarshan
		    case 'FETCH_FILTER_ORDERS'://Added by SJ : To fetch all order by filter : Rajashree
		    case 'FETCH_MILESTONE_TASK'://Added by SSD : milestone task fetching : Akshay
		    case 'FETCH_FOURTH_COLUMN_REQUEST': //Added by SJ : fetch order, cart and request from for fourth column
		    case 'FETCH_SUPPLIER_BY_STATUS'	: //Added by SJ :  Fetch organisation by their invitation status : Sudarshan
		    case 'FETCH_FOURTH_COLUMN_ORDER_REQUEST'://Added by SJ : To fetch all order in fourth column : Rajshree
		    case 'FETCH_FOURTH_COLUMN_CART_REQUEST': //Added by SJ : To fetch all cart in fourth column : Rajshree
		    case 'GET_PUBLISHED_ORGS_FOR_LINK': //Added by SJ : Fetch publish supplier or service provider : Deepraj
		    case 'GET_LINKED_ORGS_BY_STATUS': //Added by SJ :Fetch linked organization as per the status eg. Pending or subscribed
		    case 'GET_AVAILABLE_SERVICEMEN': //Added by SJ : Get available service men according to client appointment slot.
		    case 'GET_CALENDER_SECTION'://Added by SJ : Get calender section://Rajshree
		    case 'FETCH_SECTION': //Added by SJ : Get calender section : //Rajshree
		    case 'GET_WIZARD_SETTING': //Added By SJ :  To get the wizard setting. Sudarshan
		    case 'FETCH_PROPERTY'://Added By SJ :  Get all properties while booking appointment : Rajshree
		    case 'GET_PROPERTY': //Added by SJ : Anjali
		    case 'FETCH_TASK_FOR_MILESTONE'://Added by SJ ondemand task fetching inside section: Varun
		    case 'FETCH_NOTIFICATION_OBJECT'://Added by GSS for fetching Notification Object
		    case 'FETCH_REQUEST_OBJECT'://Added by GSS for fetching Request Object 
		    case 'FETCH_NOTIFICATION_COUNT'://Added by GSS for fetching notification count
		    case 'FETCH_REQUEST_COUNT'://Added by GSS for fetching request count
		    case 'GET_SETTING'://Added by SJ for fetching setting
		    case 'FETCH_TICKETS'://Added by SJ -To fetch organisation tickets.: Sudarshan
		    case 'GET_GROUPED_DEVICES'://Added by SJ Get group of devices : Rajshree 
		    case 'FETCH_TASK_TAG'://Added by SJ : on-demand task's tag fetching inside project panel : Arun
		    case 'GET_EVENT'://Added by SJ : for ondemand fetching of Event/Task/Meeting on Event/Task/Meeting listing of Agenda : Anjali
		    case 'GET_MEETING'://Added by SJ : for ondemand fetching of Event/Task/Meeting on Event/Task/Meeting listing of Agenda : Anjali
		    case 'GET_TASK'://Added by SJ : for ondemand fetching of Event/Task/Meeting on Event/Task/Meeting listing of Agenda : Anjali
		    case 'FETCH_APPOINTMENT': //Added by SJ :to fetch pending appointment : Rajshree
		    case 'FETCH_ARCHIVE_PROJECT'://Added by Sj : on-demand fetching archive project : Arun
		    case 'FETCH_ARCHIVE_TASK'://Added by SJ :  on-demand fetching archive task :Komal
		    case 'FETCH_SECTION_NAMES'://Added by SJ : Arun
		    case 'FETCH_CART'://Added by SJ : Vandana
		    case 'GET_SCENES'://Added by SJ : Get default and custom scenes : Rajshree
		    case 'FETCH_SETTINGS'://Added by SJ : to fetch settings of wizards: Rajshree
		    case 'FETCH_USERS'://Added by SJ :to fetch users of org : Rajshree
		    case 'FETCH_GROUP'://Added by SJ to fetch org group : Vandana
		    case 'GET_SCENES_SCHEDULE'://Added by SJ to Get schedule of scenes : Rajshree
		    case 'FETCH_CORPORATE_TYPE_EVENTS'://Added by SJ : On demand call for fetching image_calendar's events : Arun
			case 'GET_ORG_DETAILS'://Added by SJ : Sudarshan
			case 'GET_CAL_SECTION'://Added by SJ : Varun
			case 'GET_PROJECT_DETAILS': //Added by SJ : Arun
			case 'FETCH_MY_TASK': //Added  by SJ : Komal
			case 'FETCH_ALL_CATEGORIES'://Added by SJ : Vandana
			case 'FETCH_NEXT_CATEGORIES'://Added by SJ : Vandana
			case 'FETCH_NEXT_CATEGORIES_AND_SUPERORGS'://Added by SJ : Vandana
			case 'FETCH_SUPER_ORGS_FOR_CATEGORY'://Added by SJ :  Vandana
			case 'FETCH_ALL_SUB_CATEGORY'://Added by SJ : Vandana
			case 'FETCH_DERIVED_ORGS_FOR_CATEGORY'://Added by SJ : Vandana
			case 'FETCH_ALL_ORGS_AND_SUB_CATEGORY': //Added by SJ : Vandana
			case 'GET_SUBTASK': //Added by SJ :  Komal
			case 'GET_DEVICE_BY_TYPE'://Added by SJ :  for fetching  sensors by type : Rajshree
			case 'FETCH_MY_ORDERS'://Added by SJ : To fetch self orders : Sudarshan
			case 'FETCH_PROPERTY_SECTIONS' : //Added by SSD:Get default section of wizard
			case 'GET_PROPERTY_SPECIFICATION'://Added by SSD : Get property specification
			case 'GET_ALL_PROPERTIES'://Added by SSD :  Get all properties
			case 'GET_SECTION_WISE_PROPERTIES'://Added by SSD : Get section wise property
			case 'FETCH_PUBLISH_CATEGORIES_AND_SUPERORGS_ROOT':
			case 'FETCH_UNPUBLISH_CATEGORIES_AND_SUPERORGS_ROOT':
			case 'FETCH_ALL_CATEGORIES_AND_SUPERORGS_ROOT':
			case 'FETCH_PUBLISH_CATEGORIES_AND_SUPERORGS':
			case 'FETCH_UNPUBLISH_CATEGORIES_AND_SUPERORGS':
			case 'FETCH_ALL_CATEGORIES_AND_SUPERORGS':
			case 'GET_PRD_SECTION' ://Added by SJ To get the product database section  : Sudharshan
			case 'GET_PRDSTD_SECTION'://Added by SJ To get the product standard section
			case "GET_ONDEMAND_SECTIONS"://Added by GSS for fetching on-demand sections.
			case "FETCH_ALL_DER_ORGS"://Added by GSS for fetch all derive organization.
			case 'FETCH_ALL_SUB_ORGS'://Added by SJ for  To fetch all subscribed organization. :  Sudharshan
			case 'FETCH_ALL_SUB_ORGS_CATEGORY'://Added by SJ  To fetch all categories of subscribed organization.:Sudarshan
			case 'FETCH_ALL_ORGS_BY_TITLE'://Added by SJ  To fetch all categories of subscribed organization : Sudarshan
			case 'FETCH_ALL_SUB_ORGS_BY_SUPERORG'://Added by SJ  To fetch all subscribed organization which are created by provided super organization
			case 'GET_ORG_SERVICES'://Added by SJ : Rajshree
			case 'FETCH_INBOX_REQUEST_ORDERS'://Added by SJ : To get order request in inbox : Prasant
			case 'ROLE_ID_WISE_USER_FETCH': //Added by SSD : Employee calendar in org on prioirity
			case 'FETCH_ALL_SUBUBSCRIBED_ORG'://Added by SJ :  To fetch all subscribed organization which subscription has been accepted by supplier org.:Sudarshan
			case 'FETCH_ALL_SUBUBSCRIBED_ORG_SUPERORG'://Added SJ : To fetch all subscribed organization super organizations which subscription has been accepted by supplier org.:Sudashrn
			case 'FETCH_ALL_SUBUBSCRIBED_ORG_CATEGORIES'://Added SJ :To fetch all subscribed organization categories subscription has been accepted by supplier org.:Sudasharn
			case 'GET_ADMIN_PROPERTY'://Added by SJ : Vandana
			case 'GET_SERVICEMAN_PROPERTY'://Added by SJ : Vandana
			case 'FETCH_USER_WISE_BOOKAPPOITNMENT' : //Added by SSD : Akshay	
			case 'GET_ORG_TASK': //Added by SJ : Prasant 
			case 'GET_IOT_ORG': //Added by SJ  :  for fetching  IOT ORG : Rasjhsree
			case 'GET_PRD_DB_ORG_SECTION'://Added by SJ : Vandana
			case 'GET_SRV_ORG_SECTION'://Added by SJ : Vandana
			case 'GET_PRD_STD_ORG_SECTION'://Added by SJ : Vandana
			case 'GET_ORD_ORG_SECTION'://Added by SJ : Vandana
			case 'GET_CAL_ORG_SECTION'://Added by SJ : Vandana
			case 'GET_APT_ORG_SECTION'://Added by SJ : Vandana
			case 'GET_TKT_ORG_SECTION'://Added by SJ : Vandana
			case 'GET_PROP_ORG_SECTION'://Added by SJ : Vandana
			case 'GET_BUD_PROP_ORG_SECTION'://Added by SJ : Vandana
			case 'GET_SUB_REQ_SECTION'://Added by SJ : Vandana
			case 'GET_INS_PROP_ORG_SECTION'://Added by SJ : Vandana
			case 'GET_SRV_TASK': //Added by SJ  : Rajshree 
			case 'GET_PRD_STD_TASK':////Added by SJ  : Rajshree
			case 'GET_PRD_DB_TASK'://Added by SJ  : Rajshree
			case 'GET_BUD_PROP_TASK'://Added by SJ  : Rajshree
			case 'GET_TKT_TASK'://Added by SJ  : Rajshree
			case 'GET_ORD_TASK'://Added by SJ  : Rajshree
			case 'GET_ROL_TASK'://Added by SJ  : Rajshree
			case 'GET_APT_MTG_TASK'://Added by SJ  : Rajshree
			case 'GET_APT_TASK'://Added by SJ  : Rajshree
			case 'GET_CDE_TASK'://Added by SJ  : Rajshree
			case 'GET_CRT_ITEM_TASK'://Added by SJ  : Rajshree
			case 'GET_CRT_ORG_SECTION'://Added by SJ : to fetch the organization user cart section.:To Fetch
			case 'FETCH_PROJECTS'://Added by SJ : Arun
			case 'FETCH_SECTIONS'://Added by SJ : Arun
			case 'FETCH_TASKS'://Added by SJ : Arun
			case 'GET_HUB_FOR_PROPERTY':
			case 'GET_HOM_ORG_SECTION': //Added by SJ : Sudarshan
			case 'GET_PRODUCT_STATUS'://Adde by SJ : Rajshree
			case 'GET_TEMPLATE_ELEMENTS':// Added by SJ : Sudarshan
			case 'FETCH_CV_DATA_BY_TYPE'://Added by SJ  : Rushikesh
			case 'FETCH_CV_DATA_BY_DATE' : //Added by SJ :  Rushikesh
			case 'FETCH_ARCHIVE_MEETING' ://Added by SSD : Komal
			case 'FETCH_MAYBE_MEETING' ://Added by SSD : Komal
			case 'FETCH_ARCHIVE_EVENT' ://Added by SSD : Komal
			case 'FETCH_MAYBE_EVENT'  ://Added by SSD : Komal
			case 'GET_BOOKAPPOINTMENT_YEARLY_COUNT'://Added by SSD : Komal
			case 'GET_SRV_WITH_SPEC'://Added by SJ  : Prashant
			case 'GET_ALL_PUB_DER_ORG'://Added by SJ : Sudarshan
			case 'FETCH_ALL_SUPER_ORGS'://Added by SJ : Vandana
			case 'GET_NEW_UPDATES'://Added by SJ  : Vandana
			case 'GET_HOM_STG_ORG'://Added by SJ : Sudarshan
			case 'GET_TEMPLATE_DATA'://Addded by SJ : Sudarshan
			case 'GET_PUBLISH_TEMPLATE_DATA'://Added by SJ:Sudarshan
			case 'GET_MONITORING_ADMIN_PROPERTY'://Added by SJ :
			case 'GET_MONITORING_SERVICEMAN_PROPERTY'://Added by SJ : 
			case 'GET_REPEAT_SERIES'://Added by GSS :  to fetch repeat task series
		//	case 'GET_SUB_REQ_SECTION'://Added by SJ : Sudarshan
			case 'GET_STANDARD_SERVICES'://Added by SSD : Vandana
			case 'GET_STANDARD_WISE_SERVICES_OF_ORG'://Added by SSD : Vandana
			case 'GET_PROPERTY_BY_FILTER' ://Added by SSD : Vandana
			case 'LOAD_PROJECT_DATA'://Added by SSD:Komal
			case 'FETCH_SUB_REQ_ORG':///Added by SJ  : prashnat
			case 'GET_SUBSCRIBED_ORG_BY_LOCATION'://Added by SJ : Prashant	
			case 'FETCH_ALL_SUB_CATEGORIES'://Added by ravi :Vandna
			case 'GET_STANDARD_SERVICE_SECTION_FOR_ORG'://Added by ravi : Vandna
			case 'GET_SERVICE_SECTION_FOR_ORG'://Added by ravi : Vandna
			case 'GET_MY_ALL_SERVICES'://Added by ravi : fetch all public, private services : Rajshree
			case 'GET_ALL_PUBLIC_SERVICES'://Added by ravi : fetch all my public services : Rajshree
			case 'GET_PRIVATE_SERVICES'://Added by ravi : fetch all private services : Rajshree	
			case 'GET_MY_PUBLIC_SERVICES'://Added by ravi : fetch my public services : Rajshree
			case 'GET_SUBSCRIBED_SERVICES'://Added by ravi : fetch subscribed services :Rajshree
			case 'UNSUBSCRIBE_ORG_LINK'://Added by ravi : To unsubscribe supplier organization : Sudarshan
			case 'FETCH_ALL_PRODUCT_STD_CATEGORIES'://Added by ravi : on-demand fetching for product section : Vandna
			case 'FETCH_ALL_PRODUCT_STD_SECTION_FOR_ORG'://Added by ravi : on-demand fetching for product section : Vandna
			case 'FETCH_SELF_PRODUCT_STD_SECTION_FOR_ORG'://Added by ravi : on-demand fetching for product section : Vandna
			case 'FETCH_RPL_PRODUCT_STD_SECTION_FOR_ORG'://Added by ravi : on-demand fetching for product section : Vandna
			case 'FETCH_ALL_MY_PRODUCTS'://Added by ravi : on-demand fetching for product with filters : Rajshree
			case 'FETCH_PRODUCT_AS_PER_PRODUCT_STANDAR'://Added by ravi : on-demand fetching  product with filters : Vandna
			case 'FETCH_PRODUCT_CATEGORY_SPECIFICATION'://Added by ravi : on-demand fetching  product with filters : Vandna
			case 'FETCH_ORGS_AS_PER_PRODUCT_STANDAR'://Added by ravi : on-demand fetching  product with filters : Vandna
			case 'GET_PRODUCT_STANDARD_CATEGORY_OF_ORG'://Added by ravi : on-demand fetching  product with filters: Vandna
			case 'FETCH_PRIVATE_PRODUCTS'://Added by ravi : on-demand fetching for product with filters : Rajshree
			case 'FETCH_MY_PUBLIC_PRODUCTS'://Added by ravi : on-demand fetching for product with filters : Rajshree
			case 'FETCH_ALL_PUBLIC_PRODUCTS'://Added by ravi : on-demand fetching for product with filters : Rajshree
			case 'FETCH_PRD_AS_PRD_STD_SELF'://Added by ravi : Vandna
			case 'FETCH_PRD_AS_PRD_STD_RPL'://Added by ravi : Vandna
			case 'FETCH_ORGS_AS_PRD_STD_CAT'://Added by ravi : Vandna	
			case 'FETCH_PRD_AS_PRD_STD'://Added by ravi : Vandna
			case 'GET_MONTHLY_COUNT'://Added by Ravi : Akshay
			case 'FETCH_INVITEE'://Added by Ravi : Saurabh
			case 'FETCH_ATTACHMENT'://Added by Ravi : Saurabh
			case 'FETCH_DETAILS'://Added by Ravi : Saurabh
							ondemand.sendDataToJava(action.Object);
									_newState = Object.assign({}, state, {_actionArray: type});
									return _newState;
			break;				
			case 'GET_USER_FILE'://Added bh SJ : Deepraj
			case 'GET_PRODUCT_DATABASE': //Added by SJ : fro Download the product database & Product Category. : Vandana
			case 'GET_PRODUCT_STANDARDS': //Added by SJ : fro Download the product database & Product Category. : Vandana
									//ondemand.sendDataToJava(action.Object);
				let obj = action.Object;
				if(obj.hasOwnProperty('baton')){
					obj.baton.push({Location: 'In etOnDemandReducer : node', Timestamp: new Date().getTime()});
				}
				//common.queueLibs.sendToJavaProcess(action.Object,common.appConfigObj.client['mode'],null,"UPLOAD");
				common.queueLibs.sendToJavaProcess(obj,common.appConfigObj.client['mode'],null,"UPLOAD");
				return _newState;
			break;
			case 'GET_YEARLY_COUNT':
			case 'SEARCH':// Added by SJ : Anjali
				common.queueLibs.sendToJavaProcess(action.Object,common.appConfigObj.client['mode'],null,"SEARCH_YEARLY");
				return _newState;
			break;

			default 					: 	return state;

			}
	}
}

exports.OnDemandReducer = OnDemandReducer;
