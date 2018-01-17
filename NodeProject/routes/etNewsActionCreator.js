/**
 * @author : GSS
 * @date : 1-7-2016
 * @purpose : NewsAction creator for redux
 */
/*eslint-env es6*/
const ft = require('./etFT');
const ftOp = new ft();
const guardian = require('./etGuardian');
const guardianOp = new guardian();
const nyt = require('./etNYT');
const nytOp = new nyt();

class actionCreatorsNews {
	constructor() {}

	actionCreatorsNews(iObj) {
		try{
			switch(iObj.action) {

			case 'FETCH_NEWS':

				switch(iObj.NewsPaperName) {
				case 'NYT' 		:nytOp.nytHeadlines();
								break;

				case 'GUARDIAN':guardianOp.guardianNews();
								break;

				case 'FT'	   :ftOp.ftSearch();
								break;
				}
				return {
					NewsPaperName: iObj.NewsPaperName,
					type: 'FETCH_STARTED',
				};
				break;

			case 'Error_Occur':
				return {
				NewsPaperName: iObj.NewsPaperName,
				type: 'Error_Occur',
			};
			logger.error('In etNewsActionCreator : actionCreatorsNews : SwitchCase ');
			break;

			}
		}catch(err) {
			logger.error('In etNewsActionCreator : actionCreatorsNews');
		}
	}
}

module.exports=actionCreatorsNews;
