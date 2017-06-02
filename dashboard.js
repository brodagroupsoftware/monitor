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

var blessed = require('blessed');
var contrib = require('blessed-contrib');
var _ = require('lodash');

var screen = null;
var table = null;
var grid = null;
var options = null;

var snapshot = [];


var dashboard = function(){
    return {
        init: init,
        append: append,
        log: log
    };
};

// Initialize screen operations by establishing the 'blessed' component parts
function init(screenOptions){
    options = screenOptions;

    screen = blessed.screen();
    screen.key(['escape', 'q', 'C-c'], function() {
        return process.exit(0);
    });

    grid = new contrib.grid( {
        rows: screenOptions.rowHeightInPixels,
        cols: screenOptions.colWidthInPixels,
        screen: screen
    });

    var widths = [];
    screenOptions.columns.forEach(function(column){
        widths.push(column.width);
    });

    table = grid.set(
        screenOptions.topRow, screenOptions.leftColumn,
        screenOptions.rowSpan, screenOptions.colSpan,
        contrib.table,
        {
            keys: true,
            fg: 'green',
            label: screenOptions.title,
            columnSpacing: 1,
            columnWidth: widths
        });
    table.focus();
}

// Append an item to the snapshot of test case results
function append(json){
    var row = [];
    _.forEach(json, function(value) {
        row.push(value);
    });

    // var text = sprintf('%j', json);
    // row.push(text);
    // row.push('stuff1');

    snapshot.push(row);
}

// Log the snapshot (ie. put it to the screen)
function log(){
    var headers = [];
    options.columns.forEach(function(column){
        headers.push(column.header);
    });

    // Write the snapshot to the screen table
    table.setData({headers: headers, data: snapshot});

    // Clear all data values from the snapshot
    snapshot = [];
}

// Render the screen (show the data) periodically
setInterval(function() {
    screen.render();
}, 500);

module.exports = dashboard;
