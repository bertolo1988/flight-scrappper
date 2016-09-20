require('should');
var Progress = require('../src/progress-bar');

describe('progress bar test', function() {

  var tickTime = 2000;
  var todo = 3;
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

    function testBarOutOfs(firstBar, secondBar, thirdBar) {
      firstBar.doneOutOf.should.be.equal('1/' + todo);
      secondBar.doneOutOf.should.be.equal('2/' + todo);
      thirdBar.doneOutOf.should.be.equal('3/' + todo);
    }

    function testBarHashes(firstBar, secondBar, thirdBar) {
      let firstBarHashes = (firstBar.graph.split('#').length - 1);
      let secondBarHashes = (secondBar.graph.split('#').length - 1);
      let thirdBarHashes = (thirdBar.graph.split('#').length - 1);
      secondBarHashes.should.be.above(firstBarHashes);
      thirdBarHashes.should.be.above(secondBarHashes);
    }

    function testBarPercentages(firstBar, secondBar, thirdBar) {
      let firstPercentage = parseInt(firstBar.percentage.split('%')[0]);
      let secondPercentage = parseInt(secondBar.percentage.split('%')[0]);
      let thirdPercentage = parseInt(thirdBar.percentage.split('%')[0]);
      secondPercentage.should.be.above(firstPercentage);
      thirdPercentage.should.be.above(secondPercentage);
    }

    function testBarTickFrequency(firstBar, secondBar, thirdBar) {
      firstBar.tickFrequency.should.be.equal(secondBar.tickFrequency);
      firstBar.tickFrequency.should.be.equal(thirdBar.tickFrequency);
    }

    function testBarEtas(firstBar, secondBar, thirdBar) {
      firstBar.eta.should.be.equal(thirdBar.eta);
      secondBar.eta.should.be.equal(thirdBar.eta);
    }

    function scheduleTick(bars, i) {
      setTimeout(function() {
        bars.push(Progress.tick());
        if (i === todo) {
          let firstBar = parseBar(bars[0]);
          let secondBar = parseBar(bars[1]);
          let thirdBar = parseBar(bars[2]);
          testBarOutOfs(firstBar, secondBar, thirdBar);
          testBarHashes(firstBar, secondBar, thirdBar);
          testBarPercentages(firstBar, secondBar, thirdBar);
          testBarTickFrequency(firstBar, secondBar, thirdBar);
          testBarEtas(firstBar, secondBar, thirdBar);
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