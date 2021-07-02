
// create the function to get data and create the plots for the id 
function plotData(id) {
    
  d3.json("samples.json").then((data)=> {
      console.log(data)

      // filter sample values by id 
      var samples = data.samples.filter(s => s.id.toString() === id)[0];

      // get only top 10 sample values
      var sampleValues = samples.sample_values.slice(0, 10).reverse();

      // get only top 10 otu ids
      var idValues = (samples.otu_ids.slice(0, 10)).reverse();

      // get the top 10 labels
      var labels = samples.otu_labels.slice(0, 10);
      
      // get the otu ids
      var otuID = idValues.map(d => "OTU " + d);

    
      var barTrace = {
          x: sampleValues,
          y: otuID,
          text: labels,
          type:"bar",
          orientation: "h",
      };

      var data = [barTrace];

      var layout = {
          title: "Top 10 Bacteria Cultures Found",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 100,
              r: 100,
              t: 30,
              b: 30
          }
      };

      // create the bar plot
      Plotly.newPlot("bar", data, layout);

      
      // create the trace for the bubble chart
      var bubbleTrace = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          text: samples.otu_labels,
          marker: {
              size: samples.sample_values,
              color: samples.otu_ids
          }
      };

      var layout = {
          title: "Bacteria Cultures Per Sample",
          xaxis:{title: "OTU ID"},
          height: 600,
          width: 1100
      };

      var data1 = [bubbleTrace];

      // create the bubble plot
      Plotly.newPlot("bubble", data1, layout); 

      // create pie chart
      var pieTrace = {
          labels: otuID,
          values:sampleValues,
          type:"pie",
      }

      var data = [pieTrace]
      
      
      Plotly.newPlot("gauge", data)

  });    
}
  
// create the function to get the specific data information
function infoData(id) {

  d3.json("samples.json").then((data)=> {
      
      // get the metadata info for the demographic info
      var metadata = data.metadata;

      console.log(metadata)

      // filter metadata info by id
      var result = metadata.filter(meta => meta.id.toString() === id)[0];

      var demographicData = d3.select("#sample-metadata");
      
      // empty the demographic data before getting new id info
      demographicData.html("");

      Object.entries(result).forEach((key) => {   
        demographicData.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}

// create the function for the change event
function optionChanged(id) {
    plotData(id);
    infoData(id);
}

// create the init function
function init() {
  // select dropdown menu 
  var dropdown = d3.select("#selDataset");

  d3.json("samples.json").then((data)=> {
      console.log(data)

      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // call the functions and display plots
      plotData(data.names[0]);
      infoData(data.names[0]);
  });
}

init();