'use strict';

var blessed = require('blessed');
var contrib = require('blessed-contrib');
var sprintf = require("sprintf-js").sprintf;
var _ = require('lodash');

var screen = null;
var table = null;
var grid = null;
var options = null;

var snapshot = [];


var screen = function(){
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
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
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
    _.forEach(json, function(value, key) {
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
    table.setData({headers: headers, data: snapshot})

    // Clear all data values from the snapshot
    snapshot = [];
}

// Render the screen (show the data) periodically
setInterval(function() {
   screen.render()
}, 500);

module.exports = screen;
