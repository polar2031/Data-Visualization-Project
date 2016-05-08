 function visitsChoropleth(divId, map){
  //set canvus size
  var width = 600;
  var height = 600;

  var svg = d3.select(divId)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //set projection function
  var projection = d3.geo.equirectangular()
    .center([121.58,25.07])
    .scale(120000)
    .translate([width / 2, height / 2]);
  //set projection function for path
  var path = d3.geo.path().projection(projection);

  var color = d3.scale.category20();

  var states = svg.append("g")
    .selectAll("path")
    .data(map.features)
    .enter()
    .append("path")
    .attr("d", path);

  states.attr("class", "state-boundary")
    .style("fill", function(d, i) {
      return "none"
      //"rgb(174, 199, 232)";
    });
}

function processData(errors, map){
  visitsChoropleth("#usage", map);
}

// Use the queue library to load multiple files and then process them
queue()
  .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/routes.geojson")
  .await(processData);
