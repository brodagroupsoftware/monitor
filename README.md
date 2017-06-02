# Broda Group Software Inc.

# Monitor - Simple Monitor to Test Site Availability

Monitor, as the name suggests, will monitor site availability.  This capability
is implemented as a node.js program and uses [Mocha](https://mochajs.org/),
a common test runner, to implement testing of site availability.

Sites can be monitoring using a simple console, where JSON information about
site availability is sent to the terminal ("console"), or to a rolling update terminal
"dashboard" view (similar to Linux's "top" monitor program).

The use of Mocha test cases is a specific design choice which allows for
reuse of previously created unit test cases for testing site functionality.   

# Installation

1.  Clone the github repo:

```
    git clone https://github.com/brodagroupsoftware/monitor.git
```

2.  Monitor is a typical node.js program and can be installed using the following
command (from the installation directory)

```
    npm install
```

3.  Run the program:

```
    node main.js -o console
```

4.  Program Options;

```
    Usage: node main.js [options]

      Options:

        -h, --help                 output usage information
        -V, --version              output the version number
        -v, --verbose              verbose output
        -I, --interval [interval]  Time interval, in seconds, between refresh cycles (default: 5 second)
        -o, --output <output>      Output destination (dashboard, console, default: console)

    Example:  To view the dashboard:

        node main.js -o dashboard

    Example:  To view the console output

        node main.js -o console
```

# Configuration

A JSON configuration file, config.js in the main program directory,
is used to determine which sites are monitored.  An example of a configuration
file to monitor availaiblity of google and facebook is illustrated below:

```
    [
        {
            "host" : "http://www.google.ca",
            "path" : "/",
            "method" : "GET"
        },
        {
            "host" : "http://www.facebook.ca",
            "path" : "/",
            "method" : "GET"
        }
    ]
```

Each site to be monitored is defined by:
- host:  the fully qualified host (including port, if needed)
- path:  the URI path in the host to monitor
- method: the HTTP operation (GET/POST/PUT/DELETE etc) to be executed

# Key Components

Monitor is composed of a number of components:
- [Node](https://nodejs.org/):  Javascript execution engine
- [Mocha](https://mochajs.org/):  test cases execution engine; a
custom "reporter" is used to capture and format test case results
- [Blessed](https://www.npmjs.com/package/blessed):  a node package module
(npm) that provides terminal output manipulation with the curses terminal library

Program modules include:
- main.js:  mainline program that parses the command line, spawns a child
process that runs mocha test cases with a custom reporter, and presents
the output in the desired "console" or "dashboard" format
- reporter.js:  Mocha custom reporter that captures test results and formats
them into JSON messages to the parent (main.js)
- dashboard.js:  Consumes JSON messages and formats them for viewing on a
rolling update dashboard
- testcases/simple.js: Contains the mocha test case that execute site
monitoring; the provided test cases sycles through the elements of the
configuration file to determine which sites to test
