/*eslint-env es6*/
/**
 * MAIN HAPI SERVER FILE FOR STARTING NODE JS SERVERs
 */
'use strict';
const Hapi 		= require('hapi');
const fs 			= require('fs');
const common		= require('./routes/common');
const Queues = require('./routes/etDirectToQueue').directQueue;
common.queueLibs = new Queues();
const logger=common.logger;
const hapiAuthJWT = require('hapi-auth-jwt2');
const hapiAuthCookie = require('hapi-auth-cookie')
const appConfigObj	=common.appConfigObj;
let cache = false;
const appConfigObject = require('./routes/msProperties').appConfig;
if(appConfigObject.client && appConfigObject.client.cache) {
	cache = true;
}
const hapiConfigObj =appConfigObj.webServer;
const domain = require('domain');
const d = domain.create();
const IoRedis		 = require('ioredis');
const redisAd = require('socket.io-ioredis');
const RouteHandler	=require('./routes/etRouteHandler2Page').Handler;
const Handler		=new RouteHandler();
const LoginObj = require('./routes/etLogin').Login;
const Login = new LoginObj();
const sio = require('socket.io');
const socketServer 	= require('./routes/etServerSocket');
const _newSocketServer = require('./routes/etSyncWithMultiplexing');
const server = new Hapi.Server();
const daemon = require('./routes/etDaemon');
const objdaemon = new daemon();
let _config = {
		port: hapiConfigObj.webServerPort,
		host: hapiConfigObj.host,

};
if(hapiConfigObj!==undefined && hapiConfigObj.sslOn !==undefined && hapiConfigObj.sslOn===true) {
	const tlsParams={
			  key: fs.readFileSync(hapiConfigObj.tls_key),
			  cert: fs.readFileSync(hapiConfigObj.tls_cert),
			  passphrase: 'nciportal',
			};

	 _config.tls=tlsParams;
}

server.connection(_config);
if(hapiConfigObj!==undefined && hapiConfigObj.serverType ==='DAEMON') {
	logger.info('In HapiServer : Its a DAEMON server');
	d.on('error', (er) => {
		 logger.error('In HapiServer : Daemon Server : Exception :', er.stack);
	});

	d.run(() =>{
	const Daemon = require('./routes/etDaemon');
	server.start(() =>{
		 logger.info('In HapiServer : Server Started at : URL :', server.info.uri);
		 logger.info('In HapiServer : Node Process Id : ', process.pid);
		    const sio 			= require('socket.io');
		    server.listener.setMaxListeners(1000);
		    const _obj = {path: '/sync'};
		    const socketIO = sio.listen(server.listener, _obj);
		    common.serverSockets = socketIO.of('/sync');
		    if(appConfigObj.redisServer.hasOwnProperty('cluster')) {
				const snetinel 	 = [{host: appConfigObj.redisSentinel.host1, port: appConfigObj.redisSentinel.port1}];//,
				if(appConfigObj.redisSentinel.hasOwnProperty('host2') && appConfigObj.redisSentinel.hasOwnProperty('port2')) {
						snetinel.push({host: appConfigObj.redisSentinel.host2, port: appConfigObj.redisSentinel.port2});
				}if(appConfigObj.redisSentinel.hasOwnProperty('host3') && appConfigObj.redisSentinel.hasOwnProperty('port3')) {
						snetinel.push({host: appConfigObj.redisSentinel.host3, port: appConfigObj.redisSentinel.port3});
				}


			    const sockPub 		 = new IoRedis({//{
					sentinels: snetinel,
					name: 'mymaster',

			    });
			    const sockSub 		 = new IoRedis({//{
					sentinels: snetinel,
					name: 'mymaster',

			    });

			    socketIO.adapter(redisAd({key: 'socket.io', pubClient: sockPub, subClient: sockSub}));
			    }else{
			    	 socketIO.adapter(redisAd({host: appConfigObj.redisServer.host, port: appConfigObj.redisServer.port,}));
			    }
	 
		    function getRedisKeys(){
		    	setTimeout(function(){ 
		    		objdaemon.getKeys(); 
		    	    getRedisKeys();
		    	}, 300000);
		    }
		    getRedisKeys();
		  //  objdaemon.delofflinepending(socketIO.of('/sync'));
		    logger.info('We are starting HCSOCKET  --- ', cache);
		    if(common.appConfigObj.client.hasOwnProperty('kafka')) {
				const Kafka = require('./routes/etKafka');
				common.kafkalibs = new Kafka();
				if(common.appConfigObj.client.kafka === 'local') {
					logger.info('local working for kafka');
					common.kafkalibs.initKafkaDeveloper();
				}
				if(common.appConfigObj.client.kafka === 'server') {
					logger.debug('server working for kafka');
					common.kafkalibs.initKafka();
				}
			}
		});
	});
}else{
	let setROutes = function(_strategy, iPlugins) {
		let _routesArr = [
		
		{method: '*', path: '/', config: {handler: Login.angLogin, auth: {mode: 'try', strategy: _strategy},
			plugins: iPlugins}},
			
		{method: 'GET', path: '/mstorm', config: {handler: Handler.homePage, auth: {mode: 'try', strategy: _strategy}}},

		{method: '*', path: '/apiAretasData', config: {handler: Handler.apiAretas, auth: false}},

		{method: 'GET', path: '/auth/google', config: {handler: Handler.googleDrive, auth: _strategy}},

		{method: 'GET', path: '/auth/box', config: {handler: Handler.boxDrive, auth: _strategy}},

		{method: 'GET', path: '/boxCallBack', config: {handler: Handler.boxCallback, auth: {mode: 'try', strategy: _strategy}}},

		{method: 'GET', path: '/auth/dropbox', config: {handler: Handler.dropBox, auth: _strategy}},

		{method: 'GET', path: '/dropBoxCallBack', config: {handler: Handler.dropBoxCallBack,auth:{mode: 'try', strategy: _strategy}}},

		{method: 'GET', path: '/auth/skydrive', config: {handler: Handler.skyDrive, auth: _strategy}},

		{method: 'GET', path: '/skyDriveCallBack', config: {handler: Handler.skyDriveCallBack,auth:{mode: 'try', strategy: _strategy}}},

		{method: 'GET', path: '/auth/googleContacts', config: {handler: Handler.googleContacts, auth: _strategy}},

		{method: 'GET', path: '/googleContactsCallBack', config: {handler: Handler.googleContactsCallBack,  auth: {mode: 'try', strategy: _strategy},
			plugins: iPlugins}},

		{method: 'GET', path: '/ping', config: {handler: Handler.pingServer, auth: _strategy}},

		{method: 'GET', path: '/logoutApp', config: {handler: Login.logoutPage, auth: {mode: 'try', strategy: _strategy}}},

		{method: 'GET', path: '/checkAuthentication', config: {handler: Login.checkAuthentication, auth:_strategy }},
		{method: '*', path: '/org', config: {handler: Handler.orgRedirect, auth: false}},
		{method: 'POST', path: '/upload',
			config: {
				handler: Handler.uploadItem,
				auth: _strategy,
				payload: {
					maxBytes: 209715200,
		            output: 'stream',
		            parse: true,
		            failAction: 'log',
				},
			},
		},
		{method: 'POST' , path:'/getOrgPublishData' , config:{handler:Handler.getOrgPublishData , auth : false}},
		{method: 'GET' , path:'/login' , config:{handler:Login.autoRegister , auth : false}},

		{method: 'GET', path: '/googleDriveCallBack', config: {handler: Handler.googleDriveCallBack, auth: {mode: 'try', strategy: _strategy},
			plugins: iPlugins}},
		{method: 'GET' , path:'/forgotPwd' , config:{handler:Login.forgotPwd , auth : false}},	
		
		{method: 'GET' , path:'/VerifyUser' , config:{handler:Login.VerifyUser , auth : false}}
		];
		//MSA for displaying images for servers and locally
		if(appConfigObject.hasOwnProperty('environment') && appConfigObject.environment.environment === 'production') {
				_routesArr.push({method: 'GET', path: '/fs/{path*}', config: {handler: Handler.localfileUpload, auth: false, }});
		}else{
			_routesArr.push({method: 'GET', path: '/fs', config: {handler: Handler.localfileUpload, auth: false, }});
		}
		server.route(_routesArr);
		};
         const directoryPath = appConfigObject.projectPath.projectPath;
         const rpath=appConfigObject.projectPath.routepath;
         
		 server.register(require('inert'), ()=>{
			 server.route({method: 'GET', path:rpath+'{path*}', handler: {directory: {path: directoryPath, listing: false, index: true}}, config: {auth: false, cache: {expiresIn: 36*100, privacy: 'private'}}});
		 });

	 if(hapiConfigObj!==undefined && hapiConfigObj.sslOn !==undefined && hapiConfigObj.sslOn===true) {
		 server.register(hapiAuthJWT, (err) => {
			let validate = (decodedToken, request, callback)=>{
					let error = null;
			    if (!decodedToken) {
			        return callback(error, false, decodedToken);
			    }

			    return callback(error, true, decodedToken);
			};
	    if (err) throw err;

		    server.auth.strategy('jwt', 'jwt', true,
		    	    {key: common.secretkeycert,    	      // Never Share your secret key
		    	      validateFunc: validate,          		  // validate function defined above
		    	      verifyOptions: {algorithms: ['RS256'], // pick a strong algorithm
		    	    	  cookieKey: 'token'},
	    	    	  cookieKey: 'token',
		   });
		    setROutes('jwt');
		 });
	    }else{
	    	server.register(hapiAuthCookie, () => {
	    		server.auth.strategy('session', 'cookie', {

	    	    	password: 'secret',
	    	        cookie: 'sid-example',
	    	        redirectTo: '/',
	    	        isSecure: false,
	    	      //  parse    : true
	    	    });
	    	setROutes('session', {'hapi-auth-cookie': {redirectTo: false}});
	    	});
	    }

	server.start(() => {
	    logger.info('Server Started at : URL :', server.info.uri);
	    logger.info('Node Process Id : ', process.pid);
	    server.listener.setMaxListeners(1000);
	    let _obj = {path: '/sync'};
	    let _objIOT = {path: '/iot'};
	    if(appConfigObj.client.hasOwnProperty('videoSocket')) {
	    	_obj = {path: appConfigObj.client.videoChatPath};
	    }
	    const socketIO = sio.listen(server.listener, _obj);
	    const socketIOIOT = sio.listen(server.listener, _objIOT);

	    let socketsObj={};

   const iotObj = new socketServer.dbSync();
	iotObj.iotInit(socketIOIOT.of('/iot'));

	    	 if(appConfigObj.redisServer.hasOwnProperty('cluster')) {
	    			const snetinel 	 = [{host: appConfigObj.redisSentinel.host1, port: appConfigObj.redisSentinel.port1}];//,

	    			if(appConfigObj.redisSentinel.hasOwnProperty('host2') && appConfigObj.redisSentinel.hasOwnProperty('port2')) {
	    					snetinel.push({host: appConfigObj.redisSentinel.host2, port: appConfigObj.redisSentinel.port2});
	    			}if(appConfigObj.redisSentinel.hasOwnProperty('host3') && appConfigObj.redisSentinel.hasOwnProperty('port3')) {
	    					snetinel.push({host: appConfigObj.redisSentinel.host3, port: appConfigObj.redisSentinel.port3});
	    			}


	    		    let sockPub 		 = new IoRedis({//{
	    				sentinels: snetinel,
	    				name: 'mymaster',

	    		    });
	    		    let sockSub 		 = new IoRedis({//{
	    				sentinels: snetinel,
	    				name: 'mymaster',

	    		    });
	    		    socketIO.adapter(redisAd({key: 'socket.io', pubClient: sockPub, subClient: sockSub}));
	    		    }else{
	    		    	 socketIO.adapter(redisAd({host: appConfigObj.redisServer.host, port: appConfigObj.redisServer.port,}));
	    		    	 socketIOIOT.adapter(redisAd({host: appConfigObj.redisServer.host, port: appConfigObj.redisServer.port,}));
	    		    }

		if (process.hasOwnProperty('send')) process.send('online');
		let socketCommands = {};
	    	  socketCommands = {
	    			easyrtc: { //RBK
		 	    		class: socketServer.dbSync,
		 	    	},
	    			sync: {
	 	    			class: socketServer.dbSync,
	 	    		},
	 	    		basicSync: {
	 	    			class: _newSocketServer.etSyncWithMultiplexing,
	 	    		},
	 	    		calendarSync: {
	 	    			class: _newSocketServer.etSyncWithMultiplexing,
	 	    		},
	 	    		mediaSync: {
	 	    			class: _newSocketServer.etSyncWithMultiplexing,
	 	    		},
	 	    		messagingSync: {
	 	    			class: _newSocketServer.etSyncWithMultiplexing,
	 	    		},
	 	    		followupSync: {
	 	    			class: _newSocketServer.etSyncWithMultiplexing,
	 	    		},
	 	    		conversationSync: {
	 	    			class: _newSocketServer.etSyncWithMultiplexing,
	 	    		},
	 	    		orgSync: {
		 	    		class: _newSocketServer.etSyncWithMultiplexing,
		 	    	},
		 	    	mobsync: {
		 	    		class: socketServer.dbSync,
		 	    	},
		 	    	login: {
		 	    		class: socketServer.dbSync,
		 	    	},
		 	    	device : {
		 	    		class : socketServer.dbSync,
		 	    	}
	 	    	};

	   let id = null;
	   for(id in socketCommands) {
			if(socketCommands[id].class!==undefined && socketCommands[id].class!==null) {
				if(id === 'sync') {
					socketsObj[id]=new socketCommands[id].class();
					socketsObj[id].inIt(socketIO.of('/'+id));
				}
				if(id === 'mobsync') {
					socketsObj[id]=new socketCommands[id].class();
				}
				if(id==='basicSync') {
					socketsObj[id]=new socketCommands[id].class();
					socketsObj[id].inIt(socketIO.of('/'+id));
				}if(id==='calendarSync') {
					socketsObj[id]=new socketCommands[id].class();
					socketsObj[id].inIt(socketIO.of('/'+id));
				}if(id==='mediaSync') {
					socketsObj[id]=new socketCommands[id].class();
					socketsObj[id].inIt(socketIO.of('/'+id));
				}if(id==='messagingSync') {
					socketsObj[id]=new socketCommands[id].class();
					socketsObj[id].inIt(socketIO.of('/'+id));
				}if(id==='followupSync') {
					socketsObj[id]=new socketCommands[id].class();
					socketsObj[id].inIt(socketIO.of('/'+id));
				}if(id==='conversationSync') {
					socketsObj[id]=new socketCommands[id].class();
					socketsObj[id].inIt(socketIO.of('/'+id));
				}if(id==='orgSync') {
					socketsObj[id]=new socketCommands[id].class();
					socketsObj[id].inIt(socketIO.of('/'+id));
				}if(id === 'login') {
					logger.info('In login ::');
					socketsObj[id]=new socketCommands[id].class();
					socketsObj[id].loginInit(socketIO.of('/'+id));
				}if(id == 'device'){
					logger.info('In device ::');
					socketsObj[id]=new socketCommands[id].class();
					socketsObj[id].deviceInit(socketIO.of('/'+id));
				}
			}
	   }
	});
}
