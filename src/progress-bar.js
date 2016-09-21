var Moment = require('moment');

function progressBar() {

	var done, todo;
	var size = 25;
	var tickHistory;
	const COMPLETE = '#';
	const INCOMPLETE = '-';
	const MAX_TICK_HIST = 15;

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
			bar += COMPLETE;
		}
		for (let i = 0; i < incompletes; i++) {
			bar += INCOMPLETE;
		}
		bar += ']';
		return bar;
	}

	function getAverageTickTime() {
		if (tickHistory.length > 1) {
			let intervalsCount = 0;
			let totalTimeDiff = 0;
			for (let i = 0; i < tickHistory.length - 1; i++) {
				totalTimeDiff += tickHistory[i + 1].diff(tickHistory[i]);
				intervalsCount++;
			}
			return totalTimeDiff / intervalsCount;
		} else {
			return 0;
		}
	}

	function getEstimatedEndTime() {
		let eta = getEstimatedTimeLeft();
		let now = new Moment().add(eta, 'milliseconds').format('hh:mm:ss');
		return now;
	}

	function getEstimatedTimeLeft() {
		let averageTimeDiff = getAverageTickTime();
		let estimatedTimeLeft = averageTimeDiff * (todo - done);
		return estimatedTimeLeft;
	}

	function updateTickHistory() {
		tickHistory.push(new Moment());
		if (tickHistory.length > MAX_TICK_HIST) {
			tickHistory.shift();
		}
	}

	function tick() {
		done++;
		updateTickHistory();
		return draw();
	}

	function init(newTodo) {
		done = 0;
		todo = newTodo;
		tickHistory = [];
		updateTickHistory();
	}

	return {
		init,
		tick
	};
}

module.exports = progressBar();