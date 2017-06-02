var mocha = require('mocha');

var statistics = {};
statistics['pass'] = [];
statistics['fail'] = [];
statistics['all'] = [];

function Reporter(runner) {
    mocha.reporters.Base.call(this, runner);

    // console.log('Custom Mocha Reporter (reporter.js) called...')

    runner.on('pass', function(test){

        var item = {};
        // var duration = test.duration;
        // var title = test.title;
        // var fillTitle = test.fullTitle();
        item['testcase'] = test.fullTitle();
        item['result'] = 'PASS';
        item['duration'] = test.duration;
        item['timestamp'] = new Date().toUTCString();

        statistics['pass'].push(item);
        statistics['all'].push(item);
        // console.log('--- PASS: %s', test.fullTitle());
    });

    runner.on('fail', function(test){

        // console.log('fail');
        var item = {};
        item['testcase'] = test.fullTitle();
        item['result'] = '*FAIL*';
        item['duration'] = '---';
        item['timestamp'] = new Date().toUTCString();

        statistics['fail'].push(item);
        statistics['all'].push(item);
        // console.log('--- FAIL: %s -- error: %s', test.fullTitle(), err.message);
    });

    runner.on('end', function(){
        // console.log('end');
        console.log('%j', statistics);
        // console.log('\n');
        // console.log('--- STATISTICS ---');
        // console.log('PASS:  %d', passes);
        // console.log('FAIL:  %d', failures);
        // console.log('TOTAL: %d', passes + failures);
    });
}

module.exports = Reporter;
