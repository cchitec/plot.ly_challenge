// Necessary variables

var select = d3.select("#selDataset");
var demographics = d3.select("#sample-metadata");

var barChart = d3.select("#bar");
var bubbleChart = d3.select("#bubble");
var guageChart = d3.select("#gauge");
var samplejson = d3.json("samples.json");

// Dropdown menu

function init() {
    
    // Fetch the JSON data

    samplejson.then((data) => {

        data.names.forEach((name) => {
            var option = seldataset.append("option");
            option.text(name).property('value', name);
        });
    });
};

// initialize dropdownMenu
init();
