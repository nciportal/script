/*eslint-env es6*/
const path = require('path');
const jwt = require('jsonwebtoken');
const common=require('./common');
const msProp=require('./msProperties');
const appConfigObj=msProp.appConfig;
const clientObj =appConfigObj.client; // credentials from nciportal1@gmail.com	account
const logger = common.logger;
const root = __dirname;
class Login {
	constructor() {
	}

	/**
	 * @author    :   AYK
	 * @purpose   :  Function to check authentication
	 * @param request  :  Http request
	 * @param reply	   :   Http respnonse
	 * @returns
	 */
	angLogin(request, reply) {
		try{
			logger.info('In etLogin : angLogin ' , new Date().getTime());
			const Domain = request.headers.host;
			if(request.auth.isAuthenticated && request.method === 'post') {
				const cookie_options = {
						ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
						encoding: 'none',    // we already used JWT to encode
						isSecure: true,      // warm & fuzzy feelings
						isHttpOnly: true,    // prevent client alteration
						clearInvalid: false, // remove invalid cookies
						strictHeader: true,   // don't allow violations of RFC 6265
				};
				reply()
				.header('Authorization', request.headers.authorization)
				.state('token', request.headers.authorization, cookie_options);
			}else{
				logger.info('In etLogin : angLogin : request.headers.host : ', request.headers.host);
					logger.info(' In etLogin : angLogin : isAuthenticated.', request.auth.isAuthenticated);
					if (request.auth.isAuthenticated) {// if user is already logged  in and in url typed /login again then again redirect to home page
						return reply.redirect('/mstorm');//,{myInfo:request.auth.credentials,serverInfo:});
					}else{
						let file = appConfigObj['projectPath'].filePath+'clzLogIn.html';
						var fileToServe = path.join(root,file);
						return reply.file(fileToServe,{ confine: false });
					}
			}
		}catch(e) {
			logger.error('In  etLogin: angLogin : Exception : '+e, ' request.payload ', request.payload);
			reply('Exception catch in  etLogin: angLogin ');
		}
	}

	login(iUserObj, iSocketObj) {
		try{
			const obj =iUserObj; let _obj = {};
			if(obj && obj.hasOwnProperty('USM_EMAIL')) {
				_obj['myInfo']={userId: obj.USM_EMAIL, username: obj.USM_EMAIL, userEmail: obj.USM_EMAIL, userUID: obj.USM_EMAIL, userName: obj.USM_EMAIL,
						firstName: obj.USM_FIRST_NAME, lastName: obj.USM_LAST_NAME, status: '1', profile_data: obj.USM_DEFAULT_WORKSPACE,
						CML_ADDRESS_LINE1:obj.USM_ADDRESS.USM_ADDRESS_LINE1,CML_ADDRESS_LINE2:obj.USM_ADDRESS.USM_ADDRESS_LINE2,CML_CONTACT_NO:obj.USM_CONTACT,
						RECOVERY_MAIL:obj.RECOVERY_MAIL};
			    _obj['serverInfo']=clientObj;
				const cookie_options = {
						ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
						encoding: 'none',    // we already used JWT to encode
						isSecure: true,      // warm & fuzzy feelings
						isHttpOnly: true,    // prevent client alteration
						clearInvalid: false, // remove invalid cookies
						strictHeader: true,   // don't allow violations of RFC 6265
				};
				if(iUserObj && iUserObj.requestFrom){
					_obj['myInfo']['requestFrom'] = iUserObj.requestFrom;
				}
				const jwttoken = jwt.sign(_obj['myInfo'], common.secretkey, {algorithm: 'RS256'});
				_obj['myInfo']['token'] = true;
				_obj['myInfo']['globalVars'] = clientObj;
				_obj['myInfo']['jwttoken'] = jwttoken;
				obj['jwtToken'] = jwttoken;
				obj['Info'] = _obj; obj['cookie_options'] = cookie_options;
				if(obj.hasOwnProperty('baton')){
					obj.baton.push({Location: 'etLogin_login : node', Timestamp: new Date().getTime()});
					logger.info("Iin etLogin Login baton : " ,obj.baton);
				}else{
					let  baton = [];
					obj.baton = baton;
					obj.baton.push({Location: 'etLogin_login : node', Timestamp: new Date().getTime()});
					logger.info("Iin etLogin Login baton : " ,obj.baton);
				}
				iSocketObj.to(obj.socketId).emit('LoginResponce', obj);
			}else{
				iSocketObj.to(obj.socketId).emit('LoginResponce', obj);
			}
		}catch(e) {
			logger.error('In  etLogin: login : Exception : ', e);
		}
	}
	
	/**
	 * @author    :   AYK
	 * @purpose   :  Function to register new user
	 * @param _usrInfo  :  userInfo
	 * @param iSockObj	   :  socket object
	 * @returns
	 * @modified by MSA
	 * @modified by DAB
	 */
	registerUser(_usrInfo, iSockObj) {
		try{
			logger.info('In etLogin : registerUser ');
			const _obj = {};
			if(_usrInfo.hasOwnProperty('USM_EMAIL')) {
				_obj['myInfo']={userId: _usrInfo.USM_EMAIL, userEmail: _usrInfo.USM_EMAIL, username: _usrInfo.USM_EMAIL, userUID: _usrInfo.USM_EMAIL, userName: _usrInfo.USM_EMAIL, firstName: _usrInfo.USM_FIRST_NAME, lastName: _usrInfo.USM_LAST_NAME, status: _usrInfo.ACTIVE_STATUS};//set myInfo
				if(_usrInfo && _usrInfo.hasOwnProperty('baton')){
					_obj.baton = _usrInfo.baton;
					_obj.baton.push({Location: 'etLogin_register : node', Timestamp: new Date().getTime()});
				}
				let profileData = null;
				if(typeof _usrInfo === 'string'){
					 profileData = JSON.parse(_usrInfo.USM_DEFAULT_WORKSPACE);
				}else{
					profileData = _usrInfo.USM_DEFAULT_WORKSPACE;
				}
				_obj['myInfo']['profile_data'] =profileData;
				_obj['serverInfo']=clientObj;
				
				const jwttoken = jwt.sign(_obj['myInfo'], common.secretkey, {algorithm: 'RS256'});
				_obj['myInfo']['token'] = true;
				_obj['myInfo']['jwttoken'] = jwttoken;
				_obj['myInfo']['globalVars'] = clientObj;
				_obj['ACTION_ARRAY'] = ['REGISTER'];
				_obj['MSG'] = 'REGISTERED SUCCESSFULLY...';
					logger.info("Iin etLogin Register baton : " ,_obj.baton);
				iSockObj.to(_usrInfo.socketId).emit('LoginResponce', _obj);
			}else{
				if(_usrInfo.hasOwnProperty('baton')){
					_usrInfo.baton.push({Location: 'etLogin_register : node', Timestamp: new Date().getTime()})
				}
				iSockObj.to(_usrInfo.socketId).emit('LoginResponce', _usrInfo);
			}
		}catch(e) {
			logger.error('In  etLogin: registerUser : Exception : ', e.message);
		}
	}
	
	
	nonClouzerRegister(_usrInfo, iSockObj){

		logger.info("In nonClouzerRegister Function : ");
		
		try{
			logger.info("Inside the nonClouzerRegister : Function :");
			const _obj = {};
			if(_usrInfo.hasOwnProperty('USM_EMAIL')) {
				_obj['myInfo']={userId: _usrInfo.USM_EMAIL, userEmail: _usrInfo.USM_EMAIL, username: _usrInfo.USM_EMAIL, userUID: _usrInfo.USM_EMAIL, userName: _usrInfo.USM_EMAIL, firstName: _usrInfo.USM_FIRST_NAME, lastName: _usrInfo.USM_LAST_NAME, status: _usrInfo.ACTIVE_STATUS};//set myInfo
				let profileData = null;
				if(typeof _usrInfo === 'string'){
					 profileData = JSON.parse(_usrInfo.USM_DEFAULT_WORKSPACE);
				}else{
					profileData = _usrInfo.USM_DEFAULT_WORKSPACE;
				}
				_usrInfo['profileData'] = profileData;
				_obj['myInfo']['profile_data'] =_usrInfo.profileData;
				_obj['serverInfo']=clientObj;
				
				const jwttoken = jwt.sign(_obj['myInfo'], common.secretkey, {algorithm: 'RS256'});
				_obj['myInfo']['token'] = true;
				_obj['myInfo']['jwttoken'] = jwttoken;
				_obj['myInfo']['globalVars'] = clientObj;
				_obj['ACTION_ARRAY'] = ['AUTO_REGISTER'];
				_obj['myInfo']['cml_provider'] = _usrInfo.CML_PROVIDER;
				_obj['myInfo']['cml_authenticated']=_usrInfo.CML_AUTHENTICATED;
				_obj['MSG'] = 'NON CLOUZER USR REGISTERED SUCCESSFULLY...';
				iSockObj.to(_usrInfo.socketId).emit('LoginResponce', _obj);
			}else{
				iSockObj.to(_usrInfo.socketId).emit('LoginResponce', _usrInfo);
			}
		}catch(e){
			logger.info("In the nonClouzerRegister Function : Exception : " ,e);
		}
	}

	changePassword(iObj, iSockObj) {
		try{
			logger.info('In etLogin : changePassword ');
			iSockObj.to(iObj.socketId).emit('LoginResponce', iObj);
		}catch(e) {
			logger.error('In  etLogin: changePassword : Exception :  ', e);
		}
	}

	/**
	 * @author    :    JIN
	 * @purpose   :  Function for forgot password
	 * @param request  : Http request
	 */
	forgotPassword(iObj, iSockObj) {
		try {
			logger.info('In etLogin : forgotPassword ');
			iSockObj.to(iObj.socketId).emit('LoginResponce', iObj);
		} catch (e) {
			logger.error('In  etLogin : forgotPassword : Exception :  ', e);
		}
	}
	
	updateProfile(iObj, iSockObj){
		try {
			logger.info('In etLogin : updateProfile ');
			iSockObj.to(iObj.socketId).emit('LoginResponce', iObj);
		} catch (e) {
			logger.error('In  etLogin : forgotPassword : Exception :  ', e);
		}
	}
	
	/**
	 * @author    :   AYK
	 * @purpose   :  Function to logout user
	 * @param request  :  Http request
	 * @param reply	   :   Http respnonse
	 * @returns
	 */
	
	logoutPage(request, reply) {
		try{
			logger.info('In etRouteHandler2Page : logoutPage ');
			if(common.appConfigObj['webServer']['sslOn']) {
				reply().unstate('token').redirect('/');
			}else{
				request.auth.session.clear();
				return reply.redirect('/');
			}
		}catch(e) {
			logger.error('In  etRouteHandler2Page: logoutPage : Exception : ', e);
		}
	}

	/**
	 * @author    :   AYK
	 * @purpose   :  Function to logout user
	 * @param request  :  Http request
	 * @param reply	   :   Http respnonse
	 * @returns
	 * @modified by SJ
	 */
	
	checkAuthentication(request,reply){
		try{
			logger.info('inside checkAuthentication : ',request.auth);
			if(request.auth.isAuthenticated) {
				const cookie_options = {
						ttl:  60 * 60 * 1000, //expires in 1 hour
						encoding: 'none',    // we already used JWT to encode
						isSecure: true,      // warm & fuzzy feelings
						isHttpOnly: true,    // prevent client alteration
						clearInvalid: false, // remove invalid cookies
						strictHeader: true,   // don't allow violations of RFC 6265
				};
				let file = appConfigObj['projectPath'].filePath+'clzLogIn.html';
				var fileToServe = path.join(root,file);
				reply.file(fileToServe,{ confine: false })
				.state('token', request.auth.token, cookie_options);
			}
		}catch(e) {
			logger.error('In  etLogin: checkAuthentication : Exception : ', e);
		}
	}
	
	checkUser(iObj, iSockObj){
		logger.info('In etLogin : checkUser  : ');
		iSockObj.to(iObj.socketId).emit('LoginResponce', iObj);
	}
	autoRegister(request,reply){
		var cookie = require('cookie');
		try{
			logger.info("Inside the etLogin : autoRegister : " );
			let obj = {
					user_id : request.query.id,
					pass : request.query.pass,
					autoLogin : 'AutoLogin'
			};
			const cookies = cookie.serialize('AutoLoginCookie', JSON.stringify(obj));
			let file = appConfigObj['projectPath'].filePath+'clzLogIn.html';
			var fileToServe = path.join(root,file);
			return reply.file(fileToServe,{ confine: false }).header('Set-Cookie', cookies);
		}catch(e){
			logger.error('In the Autoregister Function : Exception  : ', e);
		}
		
	}
	
	forgotPwd(request,reply){
		var cookie = require('cookie');
		try{
			let obj = {
					user_id : request.query.id,
					pass : request.query.pass,
					forgotPwd  : 'true'
			};
			const cookies = cookie.serialize('forgotPassword', JSON.stringify(obj));
			let file = appConfigObj['projectPath'].filePath+'clzLogIn.html';
			var fileToServe = path.join(root,file);
			return reply.file(fileToServe,{ confine: false }).header('Set-Cookie', cookies);
		}catch(e){
			logger.error('In the forgotPwd Function : Exception  : ', e);
		}
		
	}	
	
	VerifyUser(request,reply){
		var cookie = require('cookie');
		try{
			let obj = {
					user_id : request.query.id,
					pass : request.query.pass,
					verify  : 'true'
			};
			const cookies = cookie.serialize('VerifyUser', JSON.stringify(obj));
			let file = appConfigObj['projectPath'].filePath+'clzLogIn.html';
			var fileToServe = path.join(root,file);
			return reply.file(fileToServe,{ confine: false }).header('Set-Cookie', cookies);
		}catch(e){
			logger.error('In the VerifyUser Function : Exception  : ', e);
		}
		
	}
}

exports.Login=Login;