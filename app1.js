// Creating function for Data Plotting
function getPlot (id) {
    // Read in json file
    d3.json("samples.json"). then((data)=> {
        console.log(data)

        var metaData = data.metadata;
        console.log(metaData);

        var wfreq = data.metadata.map(d =>d.wfreq)
        console.log('Washing Freq: ${wfreq}')

        // Filter sample values by id
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);

        // Getting top 10
        var samplevalues = samples.sample_values.slice(0, 10).reverse();

        // Getting top 10 OTU ids for plot
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();

        var OTU_id = OTU_top.map(d => "OTU" + d)

        // Get top 10 labels for plot
        var labels = samples.otu_labels.slice(0, 10);

        console.log('Sample Values: ${samplevalues}')

        // Create trace variable for the plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'rgd(142,124,195)'},
            type: "bar",
            orientation: "h",
        
    
        };
    

        // Create data variable
        var data = [trace];

        // Create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l:100,
                r:100,
                t:100,
                b:30
            }
        };

        // Create bar plot
        Plotly.newPlot("bar", data, layout);


// console.log('ID: ${samples.otu_ids}')
        
        // The bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };

        var data = [bubble];
        var layout = {
            xaxis: {title: "OTU ID"},
            title: "Belly Button Bacteria"
        };

        // Creating data variable
        var data1 = [trace1];

        // Create the bubble plot
        Plotly.newPlot("bubble", data1, layout);

        // The guage chart
        // Get wash frequency data
        var washFreq =metaData.filter(d => d.id.toString() === id);

        // Extract wfreq for each id
        var wFreqData = [];

        Object.entries(washFreq).forEach(([key, value]) => {
            wFreqData.push(value.wfreq);
        });

        console.log(wFreqData);

       // Calculate needle point 

       var degrees = 180 - (parseFloat(wFreqData) * 20),
       radius = .5;

       var radians = degrees * Math.PI / 180;

       var x = radius * Math.cos(radians);
       var y = radius * Math.sin(radians);

       // Create needle path
       var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
           pathX = String(x),
           space = ' ',
           pathY = String(y),
           pathEnd = ' Z';
       var path = mainPath.concat(pathX,space,pathY,pathEnd);

       var data = [{ type: 'scatter',
       x: [0], y:[0],
           marker: {size: 28, color:'850000'},
           showlegend: false,
           name: 'washfreq',
           text: wFreqData.toString(),
           hoverinfo: 'text+name'},
       { values: [80/10, 80/10, 80/10, 80/10, 80/10, 80/10, 80/10, 80/10, 80/10, 80],
       rotation: 90,
       text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9', ''],
       textinfo: 'text',
       textposition:'inside',	  
       marker: {colors:['rgba(255, 230, 204, 1)', 'rgba(255, 204, 153, 1)', 'rgba(255, 179, 102, 1)', 'rgba(255, 153, 51, 1)', 'rgba(255, 128, 0, 1)', 'rgba(222, 111, 0, 1)', 'rgba(153, 77, 0, 1)', 'rgba(102, 51, 0, 1)', 'rgba(51, 26, 0, 1)', 'rgba(51, 0, 22, 0)']},
       labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9', ''],
       hoverinfo: 'label',
       hole: .5,
       type: 'pie',
       showlegend: false,
       direction: "clockwise"
       }];

       var layout = {
           
        shapes:[{

            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {

                color: '850000'
            }
        }],
            title: '<b> Belly Button Washing Frequency</b> <br> Scrubs per Week',
            height: 600,
            width: 600,
            xaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]}
            };

        Plotly.newPlot('gauge', data, layout);
        
    });
}    


// Create the function to get necessary data
function getInfo(id) {
    // Read the json file to get data
    d3.json("samples.json").then((data)=> {

        // Get  metadata info for the demo panel
        var metadata = data.metadata;

        console.log(metadata)

        // Filter meta data info for id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Select demo panel to put data
        var demographicInfo = d3.select("#sample-metadata");

        demographicInfo.html("");

        // Grab necessary demo data for the id + append the info to the panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");


        });
    });
}

// Create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// Create the function for the initial data rendering
function init() {
    // Select dropdown menu
    var dropdown = d3.select("#selDataset");

    // Read the data
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // Get the id data to the dropdown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    
    });
}

init();

