var dists = d3.range(10),
	times = d3.range(24);

var margin = {
	top: 170,
	right: 50,
	bottom: 70,
	left: 50
};
var tooltip = d3.select('body')
.append('div')
.attr("id", "tooltip") 
.style('position', 'absolute')
.style('z-index', '10')
.style('color', '#3497db')
.style('visibility', 'visible') // 是否可见（一开始设置为隐藏）
.style('font-size', '12px')
.style('font-weight', 'bold')
.style('font-color',"black")
.text('')
var width = Math.max(Math.min(window.innerWidth, 1000), 500) - margin.left - margin.right - 20,
	gridSize = Math.floor(width / times.length),
	height = gridSize * (dists.length+2);

//SVG container
var svg = d3.select('#trafficAccidents')
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Reset the overall font size
var newFontSize = width * 62.5 / 900;
d3.select("html").style("font-size", newFontSize + "%");

///////////////////////////////////////////////////////////////////////////
//////////////////////////// Draw Heatmap /////////////////////////////////
///////////////////////////////////////////////////////////////////////////
	
//Based on the heatmap example of: http://blockbuilder.org/milroc/7014412

var colorScale = d3.scale.linear()
	.domain([0, d3.max(accidents, function(d) {return d.risk; })/2, d3.max(accidents, function(d) {return d.risk; })])
	.range(["#FFFFDD", "#3E9583", "#1F2D86"])
	//.interpolate(d3.interpolateHcl);

var distLabels = svg.selectAll(".distLabel")
    .data(dists)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridSize; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "distLabel mono axis axis-workweek" : "distLabel mono axis"); });

var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", function(d, i) { return ((i >= 8 && i <= 17) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var heatMap = svg.selectAll(".hour")
    .data(accidents)
    .enter().append("rect")
    .attr("x", function(d) { return (d.hour - 1) * gridSize; })
    .attr("y", function(d) { return (d.dist - 1) * gridSize; })
    .attr("class", "hour bordered")
    .attr("width", gridSize)
    .attr("height", gridSize)
    .style("stroke", "white")
    .style("stroke-opacity", 0.6)
    .style("fill", function (d) {
            return colorScale(d.risk);
        })
        .on('click', function (d) {
            console.log(d.id)
    
            //tooltip.html("id:"+d.id)
            return tooltip.style('visibility', 'visible').text(d.id);
        })
    
        .on('mouseout', function (d) {
    
            return tooltip.style('visibility', 'hidden');
    
        });
  

//Append title to the top
svg.append("text")
	.attr("class", "title")
    .attr("x", width/2)
    .attr("y", -90)
    .style("text-anchor", "middle")
    .text("Number of Traffic accidents per dist & Hour combination");
svg.append("text")
	.attr("class", "subtitle")
    .attr("x", width/2)
    .attr("y", -60)
    .style("text-anchor", "middle")
    .text("The Netherlands | 2014");

//Append credit at bottom
svg.append("text")
	.attr("class", "credit")
    .attr("x", width/2)
    .attr("y", gridSize * (dists.length+1) + 80)
    .style("text-anchor", "middle")
    .text("Based on Miles McCrocklin's Heatmap block");

///////////////////////////////////////////////////////////////////////////
//////////////// Create the gradient for the legend ///////////////////////
///////////////////////////////////////////////////////////////////////////

//Extra scale since the color scale is interpolated
var riskScale = d3.scale.linear()
	.domain([0, d3.max(accidents, function(d) {return d.risk; })])
	.range([0, width])

//Calculate the variables for the temp gradient
var numStops = 10;
riskRange = riskScale.domain();
riskRange[2] = riskRange[1] - riskRange[0];
riskPoint = [];
for(var i = 0; i < numStops; i++) {
	riskPoint.push(i * riskRange[2]/(numStops-1) + riskRange[0]);
}//for i

//Create the gradient
svg.append("defs")
	.append("linearGradient")
	.attr("id", "legend-traffic")
	.attr("x1", "0%").attr("y1", "0%")
	.attr("x2", "100%").attr("y2", "0%")
	.selectAll("stop") 
	.data(d3.range(numStops))                
	.enter().append("stop") 
	.attr("offset", function(d,i) { 
		return riskScale( riskPoint[i] )/width;
	})   
	.attr("stop-color", function(d,i) { 
		return colorScale( riskPoint[i] ); 
	});

///////////////////////////////////////////////////////////////////////////
////////////////////////// Draw the legend ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var legendWidth = Math.min(width*0.8, 400);
//Color Legend container
var legendsvg = svg.append("g")
	.attr("class", "legendWrapper")
	.attr("transform", "translate(" + (width/2) + "," + (gridSize * dists.length + 40) + ")");

//Draw the Rectangle
legendsvg.append("rect")
	.attr("class", "legendRect")
	.attr("x", -legendWidth/2)
	.attr("y", 0)
	//.attr("rx", hexRadius*1.25/2)
	.attr("width", legendWidth)
	.attr("height", 10)
	.style("fill", "url(#legend-traffic)");
	
//Append title
legendsvg.append("text")
	.attr("class", "legendTitle")
	.attr("x", 0)
	.attr("y", -10)
	.style("text-anchor", "middle")
	.text("Number of Accidents");

//Set scale for x-axis
var xScale = d3.scale.linear()
	 .range([-legendWidth/2, legendWidth/2])
	 .domain([ 0, d3.max(accidents, function(d) { return d.risk; })] );

//Define x-axis
var xAxis = d3.svg.axis()
	  .orient("bottom")
	  .ticks(5)
	  //.tickFormat(formatPercent)
	  .scale(xScale);

//Set up X axis
legendsvg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + (10) + ")")
	.call(xAxis);