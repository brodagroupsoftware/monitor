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
        .option('-o, --output <output>', 'Output destination (screen, console, default: console)', /^(screen|console)$/i, 'console')
        .parse(process.argv);

    // Optional parameter: --verbose (default is false)
    var verbose = program.verbose;
    if (program.verbose == null) {
        verbose = false;
    }

    // Optional parameter: --output (default is console)
    var output = 'console';
    if (program.output != null || program.output == false) {
        output = program.output;
    }

    var interval = program.interval;

    var options = {
        'command': process.argv,
        'verbose': verbose,
        'interval': interval,
        'output': output
    };

    return options;
}
