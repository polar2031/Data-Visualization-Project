var margin = {top: 20, right: 60, bottom: 60, left: 100};
var width = 1500;
var height = 800;
var projection = d3.geo.equirectangular()
    .center([121.54,25.09])
    .scale(170000)
    .translate([width / 2, height / 2]);



function initialMap(divId){
    d3.select(divId)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "rgb(230,230,230)")
}
 // #     #    #    ######
 // ##   ##   # #   #     #
 // # # # #  #   #  #     #
 // #  #  # #     # ######
 // #     # ####### #
 // #     # #     # #
 // #     # #     # #

function drawMap(divId, mapData, outMapData){
    var path = d3.geo.path().projection(projection);
    d3.select(divId)
        .select("svg")
        .append("g")
        .selectAll("path")
        .data(outMapData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "rgb(200,200,200)")
        .attr("fill", "none");

    d3.select(divId)
        .select("svg")
        .append("g")
        .attr("class", "map")
        .selectAll("path")
        .data(mapData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "district")
        .attr("fill", "rgb(161,217,155)");
}

function mapDefault(divId){
    d3.select(divId)
        .select("svg")
        .select(".map")
        .selectAll("path")
        .transition()
        .duration(1000)
        .attr("fill", "rgb(161,217,155)");
}

function mapWithIncome(divId, incomeData){
    var allIncomes = d3.map();
    incomeData.forEach(function(d){
        if(d.項目 != "總計"){
            allIncomes.set(d.項目, parseInt(d.所得總額.replace(/\,/g,"")));
        }
    })

    var incomeExtent = [];
    allIncomes.entries().forEach(function(d){
        incomeExtent = incomeExtent.concat(d.value);
    })
    incomeExtent = d3.extent(incomeExtent);
    var color = d3.scale.linear()
        .domain(incomeExtent)
        .range(["rgb(224,243,219)", "rgb(8,64,129)"])
        .interpolate(d3.interpolateHcl);

    var stations = d3.select(divId)
        .select("svg")
        .select(".map")
        .selectAll("path")
        .transition()
        .duration(1000)
        .attr("fill", function(d){
            //console.log(allIncomes.get(d.properties.TNAME));
            return color(allIncomes.get(d.properties.TNAME));
        })
}
function mapWithPopulation(divId, populationData){
    var incomeData = [];
    var allPopulations = d3.map();
    populationData.forEach(function(d){
        if(d.district != "總計"){
            allPopulations.set(d.district + "區", parseInt(d.population.replace(/\,/g,"")));
        }
    })
    // console.log(allPopulations);
    var populationExtent = [];
    allPopulations.entries().forEach(function(d){
        populationExtent = populationExtent.concat(d.value);
    })
    populationExtent = d3.extent(populationExtent);
    var color = d3.scale.linear()
        .domain(populationExtent)
        .range(["rgb(224,243,219)", "rgb(8,64,129)"])
        .interpolate(d3.interpolateHcl);

    var stations = d3.select(divId)
        .select("svg")
        .select(".map")
        .selectAll("path")
        .transition()
        .duration(1000)
        .attr("fill", function(d){
            // console.log(allPopulations.get(d.properties.TNAME));
            return color(allPopulations.get(d.properties.TNAME));
        });
}
function mapWithDensity(divId, populationData, areaData){
    console.log(areaData[0]);
    var incomeData = [];
    var allDensitys = d3.map();
    populationData.forEach(function(d){
        if(d.district != "總計"){
            n = d.district + "區";
            // console.log(n);
            // console.log(areaData[0][n]);
            allDensitys.set(d.district + "區", parseInt(d.population.replace(/\,/g,"") / parseFloat(areaData[0][n])));
        }
    })
    console.log(allDensitys);
    var densityExtent = [];
    allDensitys.entries().forEach(function(d){
        densityExtent = densityExtent.concat(d.value);
    })
    densityExtent = d3.extent(densityExtent);
    var color = d3.scale.linear()
        .domain(densityExtent)
        .range(["rgb(224,243,219)", "rgb(8,64,129)"])
        .interpolate(d3.interpolateHcl);

    var stations = d3.select(divId)
        .select("svg")
        .select(".map")
        .selectAll("path")
        .transition()
        .duration(1000)
        .attr("fill", function(d){
            //console.log(allDensitys.get(d.properties.TNAME));
            return color(allDensitys.get(d.properties.TNAME));
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
    var path = d3.geo.path().projection(projection);
    d3.select(divId)
        .select("svg")
        .append("g")
        .attr("class", "routes")
        .selectAll("path")
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
    d3.select(divId)
         .select("svg")
         .append("g")
         .attr("class", "stations")
         .selectAll("circle")
         .data(stationsData.features)
         .enter()
         .append("circle")
         .attr("cx", function(d){
             return projection(d.geometry.coordinates)[0];
         })
         .attr("cy", function(d){
             return projection(d.geometry.coordinates)[1];
         })
         .attr("r", 4)
         .attr("stroke", "black")
         .attr("stroke-width", 2)
         .attr("fill", "white")
         .attr("class", "station");
}

function stationDefault(divId){
    d3.select(divId)
         .select("svg")
         .select(".stations")
         .selectAll("circle")
         .transition()
         .duration(1000)
         .attr("r", 4)
         .attr("stroke", "black")
         .attr("stroke-width", 2)
         .attr("fill", "white");
}

function stationsWithUsage(divId, enter, enterH, leave, leaveH, openTime, checkBoxStatus, inNOutStatus){
    var allStations = Object.keys(enter[0]).slice(1);
    var totalUsage = d3.map();
    allStations.forEach(function(d){
        totalUsage.set(d + "站", 0);
    })
    if(inNOutStatus[0] == 1){
        enterH.forEach(function(d){
            if(checkBoxStatus[openTime.indexOf(d.時段)] == 1){
                allStations.forEach(function(d1){
                    totalUsage.set(d1 + "站", totalUsage.get(d1 + "站") + parseInt(d[d1].toString().replace(/\,/g,"")));
                })
            }
        })
    }
    if(inNOutStatus[1] == 1){
        leaveH.forEach(function(d){
            allStations.forEach(function(d1){
                if(checkBoxStatus[openTime.indexOf(d.時段)] == 1){
                    totalUsage.set(d1 + "站", totalUsage.get(d1 + "站") + parseInt(d[d1].toString().replace(/\,/g,"")));
                }
            })
        })
    }
    var usageExtent = [];
    allStations.forEach(function(d){
        usageExtent = usageExtent.concat(totalUsage.get(d + "站"));
    })
    usageExtent = d3.extent(usageExtent);
    var color = d3.scale.linear()
        .domain([0, usageExtent[1]])
        .range(["rgb(254,224,210)", "rgb(222,0,0)"])
        .interpolate(d3.interpolateHcl);
    var r = d3.scale.linear()
        .domain([0, usageExtent[1]])
        .range([0, 30])

    var stations = d3.select(divId)
        .select("svg")
        .select(".stations")
        .selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r",
         function(d){
            //return Math.sqrt(totalUsage.get(d.properties.NAME)/10000);
            return r(parseInt(totalUsage.get(d.properties.NAME)));
        })
        .attr("stroke-width", 0)
        .attr("fill", function(d){
            return color(totalUsage.get(d.properties.NAME))
        })
        if(usageExtent[1] == 0){
            stationDefault(divId);
        }
}

 //  #####  #     # #######  #####  #    # ######  ####### #     #
 // #     # #     # #       #     # #   #  #     # #     #  #   #
 // #       #     # #       #       #  #   #     # #     #   # #
 // #       ####### #####   #       ###    ######  #     #    #
 // #       #     # #       #       #  #   #     # #     #   # #
 // #     # #     # #       #     # #   #  #     # #     #  #   #
 //  #####  #     # #######  #####  #    # ######  ####### #     #

function addCheckBox(divId, enter, enterH, leave, leaveH){
    var openTime = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1]
    var checkBoxStatus = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    var inNOut = ["IN","OUT"];
    var inNOutStatus = [1,1];
    var boxWidth = 30;

    var checkBox = d3.select(divId)
        .select("svg")
        .append("g")
        .attr("class", "checkbox")
        .selectAll("g")
        .data(openTime)
        .enter()
        .append("g")
        .attr("transform", function(d, i){
            return "translate(" + (width - boxWidth) + "," + (i * boxWidth) + ")";
        })
    checkBox.append("rect")
        .attr("class", "background")
        .attr("width", boxWidth)
        .attr("height", boxWidth)
        .attr("fill", "white")
        .attr("stroke", "black")

    checkBox.append("text")
        .attr("transform", "translate(" + boxWidth/2 + "," + boxWidth*2/3 + ")")
        .attr("text-anchor", "middle")
        .text(function(d){
            return d;
        })
    checkBox.append("rect")
        .attr("width", boxWidth)
        .attr("height", boxWidth)
        .attr("fill", "rgba(255,255,255,0)")
        .attr("stroke", "black")

    checkBox.on("click", function(d, i){
            console.log(d, i);
            if(checkBoxStatus[i] == 0){
                checkBoxStatus[i] = 1;
                d3.select(this).select(".background")
                    .attr("fill", "orange");
                stationsWithUsage("#canvas1", enter, enterH, leave, leaveH, openTime, checkBoxStatus, inNOutStatus);

            }
            else{
                checkBoxStatus[i] = 0;
                d3.select(this).select(".background")
                    .attr("fill", "white");
                stationsWithUsage("#canvas1", enter, enterH, leave, leaveH, openTime, checkBoxStatus, inNOutStatus);
            }
        })
    var checkBox2 = d3.select(divId)
        .select("svg")
        .append("g")
        .attr("class", "checkbox")
        .selectAll("g")
        .data(inNOut)
        .enter()
        .append("g")
        .attr("transform", function(d, i){
            return "translate(" + (width - boxWidth * 3) + "," + (i * boxWidth) + ")";
        })
    checkBox2.append("rect")
        .attr("class", "background")
        .attr("width", boxWidth * 2)
        .attr("height", boxWidth)
        .attr("fill", "orange")
        .attr("stroke", "black")

    checkBox2.append("text")
        .attr("transform", "translate(" + boxWidth + "," + boxWidth*2/3 + ")")
        .attr("text-anchor", "middle")
        .text(function(d){
            return d;
        })
    checkBox2.append("rect")
        .attr("width", boxWidth * 2)
        .attr("height", boxWidth)
        .attr("fill", "rgba(255,255,255,0)")
        .attr("stroke", "black")

    checkBox2.on("click", function(d, i){
            console.log(d, i);
            if(inNOutStatus[i] == 0){
                inNOutStatus[i] = 1;
                d3.select(this).select(".background")
                    .attr("fill", "orange");
                stationsWithUsage("#canvas1", enter, enterH, leave, leaveH, openTime, checkBoxStatus, inNOutStatus);

            }
            else{
                inNOutStatus[i] = 0;
                d3.select(this).select(".background")
                    .attr("fill", "white");
                stationsWithUsage("#canvas1", enter, enterH, leave, leaveH, openTime, checkBoxStatus, inNOutStatus);
            }
        })


}

 // #       ### #     # #######   ##    ######     #    ######   #####  #     #    #    ######  #######
 // #        #  ##    # #        #  #   #     #   # #   #     # #     # #     #   # #   #     #    #
 // #        #  # #   # #         ##    #     #  #   #  #     # #       #     #  #   #  #     #    #
 // #        #  #  #  # #####    ###    ######  #     # ######  #       ####### #     # ######     #
 // #        #  #   # # #       #   # # #     # ####### #   #   #       #     # ####### #   #      #
 // #        #  #    ## #       #    #  #     # #     # #    #  #     # #     # #     # #    #     #
 // ####### ### #     # #######  ###  # ######  #     # #     #  #####  #     # #     # #     #    #

function drawLBChart(divId, enter, leave, rainfallData) {
    var year = 2015;
    var month = 11;
    var weekDay = 0;
    var dailyUsage = [];
    Object.keys(enter[0]).slice(1)
    enter.forEach(function(d, i){
        dailyUsage = dailyUsage.concat(0);
        Object.keys(d).slice(1).forEach(function(d1){
            dailyUsage[i] += parseInt(d[d1].replace(/\,/g,""))
        })
    })
    leave.forEach(function(d, i){
        Object.keys(d).slice(1).forEach(function(d1){
            dailyUsage[i] += parseInt(d[d1].replace(/\,/g,""))
        })
    })

    var dt1 = new Date(year + "-1-1");
    var dt2 = new Date(year + "-" + month + "-1");
    var days = new Date(year,month,0).getDate();

    // console.log(days);
    var firstDay = Math.round((dt2 - dt1) / (1000 * 60 * 60 * 24));
    // console.log(firstDay);
    // console.log(rainfallData.dataset.location[3].weatherElement.time[firstDay]);
    dailyRainfall = [];
    for(var i = 0; i < days; i++){
        dailyRainfall = dailyRainfall.concat(isNaN(parseFloat(rainfallData.dataset.location[3].weatherElement.time[firstDay + i].elementValue.value))?0.0:parseFloat(rainfallData.dataset.location[3].weatherElement.time[firstDay + i].elementValue.value))
    }
    // console.log(dailyRainfall);

    var chartWidth = width - margin.left - margin.right;
    var chartHeight = height/2 - margin.top - margin.bottom;

    var yUnit = 1;
    var barWidth = chartWidth/days;

    var svg = d3.select(divId)
        .append("svg")
        .attr("width", width)
        .attr("height", height/2)
        .append("g")
     	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    var x = d3.scale.linear()
        .domain([0, days - 1])
        .range([0, chartWidth]);
    var xd = d3.scale.linear()
        .domain([1, days])
        .range([0, chartWidth]);


    var usageExtent = d3.extent(dailyUsage);
    var rainfallExtent =d3.extent(dailyRainfall);
    var y1 = d3.scale.linear()
        .domain([usageExtent[0] - 100000, usageExtent[1]])
        .range([chartHeight, 0]);
    var y2 = d3.scale.linear()
        .domain(rainfallExtent)
        .range([chartHeight, 0]);

    var y1Axis = d3.svg.axis().scale(y1).orient("left");
    var y2Axis = d3.svg.axis().scale(y2).orient("right");
    var xAxis = d3.svg.axis().scale(xd).orient("bottom").ticks(days);

    var color = d3.scale.linear()
        .domain(rainfallExtent)
        .range(["rgb(158,202,225)", "rgb(8,64,129)"])
        .interpolate(d3.interpolateHcl);



    var bar = svg.selectAll("rect")
        .data(dailyUsage)
        .enter()
        .append("rect")
    svg.append("line")

    bar.attr("x", function(d,i) { return i * barWidth; })
        .attr("y", function(d,i) { return y1(usageExtent[0] - 100000); })
        .attr("width", barWidth - 1)
        .attr("height", function(d,i) { return 0; })
        .attr("class", "bar")
        .attr("fill", function(d, i){
            if(dailyRainfall[i] == 0){
                return "gray";
            }
            else{
                return color(dailyRainfall[i]);
            }
        })
        .transition()
        .duration(2000)
        .attr("y", function(d,i) { return y1(d/yUnit); })
        .attr("height", function(d,i) { return y1(usageExtent[0] - 100000) - y1(d/yUnit); })


    var yName = svg.append("text")
    yName.attr("text-anchor", "middle")
        .attr("x", -margin.left + 15)
        .attr("y", chartHeight/2)
        .attr("transform", "rotate(-90 " + (-margin.left + 15) + " " + chartHeight/2 + ")")
        .text("Number of Passengers")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px");

    svg.append("g")
        .attr("class", "axis")
     	.call(y1Axis);
    svg.append("g")
        .attr("class", "axis")
     	.call(xAxis)
        .attr("transform", "translate(0," + chartHeight + ")")
        .selectAll(".tick")
        .attr("transform", function(d, i){
            return "translate(" + (i * barWidth + barWidth/2) + ", 0)";
        })

    bar.on("mouseover", function(d){
            d3.select(divId)
                .select("svg")
                .select("g")
                .select("line")
                .attr("x1", 0)
                .attr("y1", function() { return y1(d/yUnit); })
                .attr("x2", chartWidth)
                .attr("y2", function() { return y1(d/yUnit); })
                .attr("stroke", "red")
        })
        .on("mouseout", function(){
            d3.select(divId)
                .select("svg")
                .select("g")
                .select("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", 0)
                .attr("stroke", "gray")
        })
 }



 // ######  ######  #######  #####  #######  #####   #####  ######     #    #######    #
 // #     # #     # #     # #     # #       #     # #     # #     #   # #      #      # #
 // #     # #     # #     # #       #       #       #       #     #  #   #     #     #   #
 // ######  ######  #     # #       #####    #####   #####  #     # #     #    #    #     #
 // #       #   #   #     # #       #             #       # #     # #######    #    #######
 // #       #    #  #     # #     # #       #     # #     # #     # #     #    #    #     #
 // #       #     # #######  #####  #######  #####   #####  ######  #     #    #    #     #

function processData(errors, mapData, outMapData, routesData, stationsData, enter, enterH, leave, leaveH, rainfallData, incomeData, populationData, areaData){
    initialMap("#canvas1");
    drawMap("#canvas1", mapData, outMapData);
    drawRoutes("#canvas1", routesData);
    drawStations("#canvas1", stationsData);
    drawLBChart("#canvas3", enter, leave, rainfallData);
    addCheckBox("#canvas1", enter, enterH, leave, leaveH);

    d3.select("#DEFAULT")
        .on("click", function(){
            d3.select("#buttonsBar1")
            .selectAll(".button.highlight")
                .classed("highlight", false);
            d3.select(this)
                .classed("highlight", true);
            mapDefault("#canvas1");
        }
        )
    d3.select("#INCOME")
        .on("click", function(){
            d3.select("#buttonsBar1")
            .selectAll(".button.highlight")
                .classed("highlight", false);
            d3.select(this)
                .classed("highlight", true);
            mapWithIncome("#canvas1", incomeData);
        })
    d3.select("#POPULATION")
        .on("click", function(){
            d3.select("#buttonsBar1")
            .selectAll(".button.highlight")
                .classed("highlight", false);
            d3.select(this)
                .classed("highlight", true);
            mapWithPopulation("#canvas1", populationData);
        })
    d3.select("#DENSITY")
        .on("click", function(){
            d3.select("#buttonsBar1")
            .selectAll(".button.highlight")
                .classed("highlight", false);
            d3.select(this)
                .classed("highlight", true);
            mapWithDensity("#canvas1", populationData, areaData);
        })

    d3.select("#RAIN")
        .select("#button2")
        .on("click", function(){

        })


}

// Use the queue library to load multiple files and then process them
queue()
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/taipei_district.geojson")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/new_taipei_district.geojson")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/routes.geojson")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/stations.geojson")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/in_11_2015.json")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/in_hourly_11_2015.json")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/out_11_2015.json")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/out_hourly_11_2015.json")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/rainfall2015.json")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/income.json")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/population.json")
    .defer(d3.json, "https://raw.githubusercontent.com/polar2031/Data-Visualization-Project/master/taipei_district_area.json")
    .await(processData);
