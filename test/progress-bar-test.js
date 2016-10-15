require('should');
var Progress = require('../src/progress-bar');

describe('progress bar test', function() {

    const tickTime = 300;
    const todo = 10;
    this.timeout(tickTime * (todo + 1));

    it('should see the desired progress bars', (done) => {

        function parseBar(bar) {
            let barElements = bar.split(' ');
            return {
                doneOutOf: barElements[0],
                graph: barElements[1],
                percentage: barElements[2],
                tickFrequency: barElements[3],
                eta: barElements[4]
            };
        }

        function outOfsShouldNeverDec(bars) {
            let i = 0;
            for (let bar of bars) {
                i++;
                bar.doneOutOf.should.be.equal(i + '/' + todo);
            }
        }

        function hashesShouldNeverDec(bars) {
            let lastBarHashes = 0;
            for (let bar of bars) {
                let barHashes = (bar.graph.split('#').length - 1);
                barHashes.should.be.aboveOrEqual(lastBarHashes);
                lastBarHashes = barHashes;
            }
        }

        function percentageShouldNeverDec(bars) {
            let lastBarPercentage = 0;
            for (let bar of bars) {
                let barPercentage = parseInt(bar.percentage.split('%')[0]);
                barPercentage.should.be.aboveOrEqual(lastBarPercentage);
                lastBarPercentage = barPercentage;
            }
        }

        function freqShouldNeverDec(bars) {
            let lastBarTickFreq;
            for (let bar of bars) {
                let tickFreq = bar.tickFrequency;
                (lastBarTickFreq === undefined || tickFreq === lastBarTickFreq).should.be.true();
                lastBarTickFreq = tickFreq;
            }
        }

        function etaShouldStayConstat(bars) {
            let lastEta;
            for (let bar of bars) {
                let eta = bar.eta;
                (lastEta === undefined || eta === lastEta).should.be.true();
                lastEta = eta;
            }
        }

        function buildBarArray(barStrings) {
            let result = [];
            for (let bar of barStrings) {
                result.push(parseBar(bar));
            }
            return result;
        }

        function scheduleTick(barStrings, i) {
            setTimeout(function() {
                barStrings.push(Progress.tick());
                if (i === todo) {
                    let barArray = buildBarArray(barStrings);
                    outOfsShouldNeverDec(barArray);
                    hashesShouldNeverDec(barArray);
                    percentageShouldNeverDec(barArray);
                    freqShouldNeverDec(barArray);
                    etaShouldStayConstat(barArray);
                    done();
                }
            }, tickTime * i);
        }

        let bars = [];
        Progress.init(todo);
        for (let i = 1; i <= todo; i++) {
            scheduleTick(bars, i);
        }
    });

});
