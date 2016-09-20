var Moment = require('moment');

function progressBar() {

	var done, todo;
	var size = 20;
	var completed = '#';
	var incomplete = '-';
	var firstTick, lastTick;

	function getPercentage() {
		return Math.floor((done / todo) * 100);
	}

	function draw() {
		let result = done + '/' + todo;
		result += ' ' + drawBar();
		result += ' ' + getPercentage() + '%';
		result += ' ' + parseInt(getAverageTickTime() / 1000) + 's/tick';
		result += ' ETA:' + getEstimatedEndTime();
		return result;
	}

	function drawBar() {
		let bar = '[';
		let percentage = getPercentage();
		let completes = Math.floor(percentage * size / 100);
		let incompletes = size - completes;
		for (let i = 0; i < completes; i++) {
			bar += completed;
		}
		for (let i = 0; i < incompletes; i++) {
			bar += incomplete;
		}
		bar += ']';
		return bar;
	}

	function getAverageTickTime() {
		return lastTick.diff(firstTick) / done;
	}

	function getEstimatedEndTime() {
		let eta = getEstimatedTimeLeft();
		let now = new Moment().add(eta, 'milliseconds').format('hh:mm:ss');
		return now;
	}

	function getEstimatedTimeLeft() {
		if (lastTick != null) {
			let averageTimeDiff = getAverageTickTime();
			let estimatedTimeLeft = averageTimeDiff * (todo - done);
			return estimatedTimeLeft;
		} else {
			return '';
		}
	}

	function tick() {
		done++;
		lastTick = new Moment();
		return draw();
	}

	function init(newTodo) {
		done = 0;
		todo = newTodo;
		firstTick = new Moment();
	}

	return {
		init,
		tick
	};
}

module.exports = progressBar();