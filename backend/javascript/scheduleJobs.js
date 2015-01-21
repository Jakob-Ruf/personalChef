var tools = require('../javascript/tools.js');

module.exports = 
{
	scheduleJobs: function (){
		var daily = 60000;
		setInterval(tools.updateRatingsAndLikes, daily);
		setInterval(tools.updateStartScreen, daily);
	};
}