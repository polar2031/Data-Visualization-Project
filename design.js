var width = 1000;
var height = 800;
var projection = d3.geo.equirectangular()
  .center([121.58,25.09])
  .scale(170000)
  .translate([width / 2, height / 2]);

function initialMap(divId){
    var svg = d3.select(divId)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
}
 // #     #    #    ######
 // ##   ##   # #   #     #
 // # # # #  #   #  #     #
 // #  #  # #     # ######
 // #     # ####### #
 // #     # #     # #
 // #     # #     # #

function drawMap(divId, mapData){
    var svg = d3.select(divId)
        .select("svg")
        .append("g")
        .attr("class", "map")
    var path = d3.geo.path().projection(projection);
    var color = d3.scale.category20();
    var states = svg.selectAll("path")
        .data(mapData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "district")
        .style("fill", function(d, i) {
            return "rgb(154, 179, 202)";
        });
}
 // ######  ####### #     # ####### #######  #####
 // #     # #     # #     #    #    #       #     #
 // #     # #     # #     #    #    #       #
 // ######  #     # #     #    #    #####    #####
 // #   #   #     # #     #    #    #             #
 // #    #  #     # #     #    #    #       #     #
 // #     # #######  #####     #    #######  #####
function drawRoutes(divId, routesData){
    var svg = d3.select(divId)
        .select("svg")
        .append("g")
        .attr("class", "routes")
    var path = d3.geo.path().projection(projection);
    console.log(routesData);
    var routes = svg.selectAll("path")
        .data(routesData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "route")
}
 //  #####  #######    #    ####### ### ####### #     #  #####
 // #     #    #      # #      #     #  #     # ##    # #     #
 // #          #     #   #     #     #  #     # # #   # #
 //  #####     #    #     #    #     #  #     # #  #  #  #####
 //       #    #    #######    #     #  #     # #   # #       #
 // #     #    #    #     #    #     #  #     # #    ## #     #
 //  #####     #    #     #    #    ### ####### #     #  #####

function drawStations(divId, stationsData){
    var svg = d3.select(divId)
         .select("svg")
         .append("g")
         .attr("class", "stations");

    var routes = svg.selectAll("circle")
         .data(stationsData.features)
         .enter()
         .append("circle")
         .attr("cx", function(d){
             return projection(d.geometry.coordinates)[0];
         })
         .attr("cy", function(d){
             return projection(d.geometry.coordinates)[1];
         })
         .attr("r", 3)
         .attr("class", "station");
}

function stationsWithIncome(divId, enter, leave){
    console.log(enter);
    console.log(leave);
}

function processData(errors, mapData, routesData, stationsData, enter, leave, rainfall){
    initialMap("#canvas");
    drawMap("#canvas", mapData);
    drawRoutes("#canvas", routesData);
    drawStations("#canvas", stationsData);
    stationsWithIncome("#canvas", enter, leave);
}

// Use the queue library to load multiple files and then process them
queue()
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/taipei_district.geojson")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/routes.geojson")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/stations.geojson")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/in_11_2015.json")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/out_11_2015.json")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/rainfall2015.json")
    .await(processData);
