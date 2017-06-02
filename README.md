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
