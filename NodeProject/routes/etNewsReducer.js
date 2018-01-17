/**
 * @author : GSS
 * @date : 01/07/2016
 * @purpose : NewsAction creator for redux
 * @param : states and action
 */
/*eslint-env es6*/
'use strict';
const common		= require('./common');
const logger = common.logger;

class newsReducer {
	constructor(state, action) {
	}

	 reducer(state, action) {
		 let _newState = null;
		 let INITIAL_STATE_NEWS = {
				'GUARDIAN': {
			'isFetching': false,
			'lastSyncTime': 0,
			'internetConnectivity': false,
			'auth': false,
		},

		'NYT': {
			'isFetching': false,
			'lastSyncTime': 0,
			'internetConnectivity': false,
			'auth': false,
			},

		'FT': {
			'isFetching': false,
			'lastSyncTime': 0,
			'internetConnectivity': false,
			'auth': false,
			},
		 };

		state = state || INITIAL_STATE_NEWS;
		if(action)

		switch (action.type) {
		case 'AUTH_SUCCESS':
			 _newState = Object.assign({}, state, {internetConnectivity: true, auth: true});
			return _newState;
			break;
		case 'FETCH_STARTED':
			 _newState = Object.assign({}, state);
			_newState[action.NewsPaperName].isFetching = true,
			_newState[action.NewsPaperName].lastSyncTime = new Date().toJSON();
			return _newState;
			break;
		case 'FETCH_COMPLETED':
		      _newState = Object.assign({}, state);
			_newState[action.NewsPaperName].isFetching = false,
			_newState[action.NewsPaperName].lastSyncTime = new Date().toJSON();
			return _newState;
			break;
		case 'Error_Occur':
			 _newState = Object.assign({}, state);
			_newState[action.NewsPaperName].isFetching = true,
			_newState[action.NewsPaperName].auth=false,
			_newState[action.NewsPaperName].lastSyncTime = new Date().toJSON();
			_newState[action.NewsPaperName].message =action.message;   // "Error Occur";
			return _newState;
			break;
		default :
			return state;
		}
	}
}

exports.newsReducer = newsReducer;
