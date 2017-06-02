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

var program = require('commander');
var spawn = require('child_process').spawn;

var dashboard = null;

var options = cli();

// console.log('options: %j', options);
console.log('Output will be directed to: %s', options.output);
console.log('Tests will be executed using an interval of %s seconds', options.interval);

execute();

function execute(){

    // console.log('Executing...');

    var child = spawn('mocha', ['testcases', '--reporter', 'reporter.js']);

    child.stdout.on('data', function(data) {
        var statistics = JSON.parse(data);
        summarize(statistics);
    });
    child.stderr.on('data', function(data) {
        console.log('An error occurred: ' + data);
    });
    child.on('close', function() {
        // console.log('closing code: ' + code);
    });

    // Convert interval from seconds to milleseconds which is required for setTimeout
    var interval = options.interval * 1000;

    // Use a timer to repeatedly call test execution
    setTimeout(function () {
        // console.log('Interval expired: %s', interval);
        execute();
    }, interval);

}

function summarize(results){
    // console.log('results: %j', results);
    if( options.output == 'console'){
        results.all.forEach(function(result){
            console.log('%j', result);
        });
    } else if( options.output == 'dashboard'){

        if (dashboard == null ){
            dashboard = require('./dashboard.js')();

            var dashboardOptions = {
                title: 'Site Status',
                topRow: 0,
                leftColumn: 0,
                rowSpan: 10,
                colSpan: 12,
                rowHeightInPixels: 12,
                colWidthInPixels: 12,
                columns: [
                    {
                        header: 'Test Case',
                        width: 70
                    },
                    {
                        header: 'Result',
                        width: 8
                    },
                    {
                        header: 'Resp (ms)',
                        width: 12
                    },
                    {
                        header: 'Last Updated',
                        width: 30
                    }
                ]
            };
            dashboard.init(dashboardOptions);
        }

        results.all.forEach(function(result){
            dashboard.append(result);
        });
        dashboard.log();
    } else {
        throw new Error('Unknown output type: ' + options.output);
    }

}

function cli(){

    var defaultVerbose = false;
    var defaultInterval = 5;

    program
        .version('0.0.1')
        .option('-v, --verbose', 'verbose output', defaultVerbose)
        .option('-I, --interval [interval]', 'Time interval, in seconds, between refresh cycles (default: 5 second)', defaultInterval)
        .option('-o, --output <output>', 'Output destination (dashboard, console, default: console)', /^(dashboard|console)$/i)
        .parse(process.argv);

    // Optional parameter: --verbose (default is false)
    var verbose = program.verbose;
    if (program.verbose == null) {
        verbose = false;
    }

    // Optional parameter: --output (default is console)
    if (program.output == null || program.output === true) {
        console.log('Invalid output type');
        program.outputHelp();
        process.exit();
    }

    var output = program.output;
    var interval = program.interval;

    var options = {
        'command': process.argv,
        'verbose': verbose,
        'interval': interval,
        'output': output
    };

    return options;
}
