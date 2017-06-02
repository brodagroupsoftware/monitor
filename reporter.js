/***

MIT License

Copyright (c) 2017 Broda Group Software Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

***/

/*
*
* Author:  Eric Broda, June 2, 2017
*
*/

'use strict';

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
