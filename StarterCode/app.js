// Necessary variables

var demographics = d3.select("#sample-metadata");

var barChart = d3.select("#bar");
var bubbleChart = d3.select("#bubble");
var guageChart = d3.select("#gauge");
var samplejson = d3.json("../Resources/samples.json");

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

// Plots
function optionChanged() {
    // will update the demographics info
    buildPlot();
};

// Write out showTable function to show the demographics for each newName
function buildPlot(subject) {

    // Fetch JSON again
    samplejson.then((data) => {

        // Var for current id in select menu
        var currentId = d3.selectAll("#selDataset").node().value;

        // Var to select metadata in samples.json
        var metadata = data.metadata;

        // Filter JSON metadata to show metadata for currentId
        var filteredmetadata = metadata.filter(subject => subject.id == currentId)[0];

        // Start process to create demographics table
        // reset demographics table metadata
        demographics.html("");

        var demographicslist = demographics.append("ul");

        // Object.entries
        Object.entries(filteredmetadata).forEach(([key, value]) => {
            demographicslist.append('li').text(`${key}: ${value}`);
        });

        // Var to select samples data from json
        var samples = data.samples;

        // Var for current id in select menu
        var currentid = d3.selectAll("#selDataset").node().value;

        // Filter samples for current id
        filteredsamples = samples.filter(subject => subject.id == currentid)[0];

        // Var for bar chart details
        var barCharttrace = {
            x: filteredsamples.sample_values.slice(0,10).reverse(),
            y: filteredsamples.otu_ids.slice(0,10).map(otuid => `OTU ${otuid}`).reverse(),
            text:  filteredsamples.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var barlayout = {
            title: "10 Most Frequent Bacteria found in Chosen ID",
            yaxis: {title:"OTU ID"},
            xaxis: {title: "Bacterial Count/Frequency"}
        };

        Plotly.newPlot("bar", [barCharttrace], barlayout);

        // Var for bubble chart details
        var bubbleCharttrace ={
            x: filteredsamples.otu_ids,
            y: filteredsamples.sample_values,
            text: filteredsamples.otu_labels,
            mode: "markers",
            marker: {
                size: filteredsamples.sample_values,
                color: filteredsamples.otu_ids
            }, 
        };

        var bubblelayout = {
            title: "Bacteria Content of Chosen Belly Button",
            xaxis: {title: "OTU ID"},
            showlegend: false
        };

        Plotly.newPlot("bubble", [bubbleCharttrace], bubblelayout);
        // Var for gauge chart
        var guageCharttrace = {
            type: "indicator",
            mode: "gauge+number+delta",
            value: filteredsamples.wfreq,
            title:  "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
            gauge: {
              axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },
              bar: { color: "darkblue" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                { range: [0, 1], color: "red" },
                { range: [1, 2], color: "darkorange" },
                { range: [2, 3], color: "orange" },
                { range: [3, 4], color: "lightorange" },
                { range: [4, 5], color: "gold" },
                { range: [5, 6], color: "yellow" },
                { range: [6, 7], color: "greenyellow" },
                { range: [7, 8], color: "limegreen" },
                { range: [8, 9], color: "green" },
              ],
            }
        };

        var guagelayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

        Plotly.newPlot("gauge", [guageCharttrace], guagelayout);
    });
};