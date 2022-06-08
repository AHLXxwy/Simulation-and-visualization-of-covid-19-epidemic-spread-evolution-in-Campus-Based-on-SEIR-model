var dists = d3.range(10),
	times = d3.range(24);
var matrixsvg = '';

var margin = {
	top: 20,
	right: 10,
	bottom: 10,
	left: 20
};

var width = Math.max(Math.min(window.innerWidth, 1000), 300) - margin.left - margin.right - 500,
	gridSize = Math.floor(width / times.length) - 1,
	height = gridSize * (dists.length + 2);
let matrix_svg = d3.select('#gridchart')
	.append("svg")
	.attr('id', 'matrix_svg')
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("id", 'matrix_g')
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
function DrawMatrix(CloseContactArray, curtime, infectid) {
	//SVG container
	if (matrixsvg != '') {
		matrixsvg.remove();

	}
	matrixsvg = matrix_svg.append("g");
	//Based on the heatmap example of: http://blockbuilder.org/milroc/7014412

	var colorScale = d3.scale.linear()
		.domain([0, d3.max(CloseContactArray, function (d) {
			return d.risk;
		}) / 2, d3.max(CloseContactArray, function (d) {
			return d.risk;
		})])
		.range(["#FFFFDD", "#3E9583", "#1F2D86"])
	//.interpolate(d3.interpolateHcl);

	var distLabels = matrixsvg.selectAll(".distLabel")
		.data(dists)
		.enter().append("text")
		.text(function (d) {
			return d;
		})
		.attr("x", 0)
		.attr("y", function (d, i) {
			return i * gridSize+10;
		})
		.style("text-anchor", "end")
		.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
		.attr("class", function (d, i) {
			return ("distLabel mono axis axis-workweek");
		});

	var timeLabels = matrixsvg.selectAll(".timeLabel")
		.data(times)
		.enter().append("text")
		.text(function (d) {
			return d;
		})
		.attr("x", function (d, i) {
			return i * gridSize;
		})
		.attr("y", 0)
		.style("text-anchor", "start")
		.attr("transform", "translate(" + gridSize / 2 + ", -6)")
		.attr("class", function (d, i) {
			return ("timeLabel mono axis axis-worktime");
		});

	var heatMap = matrixsvg.selectAll(".hour")
		.data(CloseContactArray)
		.enter().append("rect")
		.attr("x", function (d) {
			return (Math.ceil(d.hour / 2) % 24 - 1) * gridSize+20;
		})
		.attr("y", function (d) {
			return parseFloat(d.dis * 10) * gridSize;
		})
		.attr("rx",4)
		.attr("ry",4)
		.attr("class", "hour bordered")
		.attr("width", gridSize)
		.attr("height", gridSize)
		.style("stroke", "white")
		.style("stroke-opacity", 0.6)
		.style("fill", function (d) {
			return colorScale(d.risk);
		})
		.on('click', function (d) {
			console.log("密切接触者id")
			console.log(d.id)

			//tooltip.html("id:"+d.id)
			return d3.select(".rect").append("title").text(function (d) {
				return d.id;
			});
		})

		


	//Append title to the top
	// matrixsvg.append("text")
	// 	.attr("class", "title")
	//     .attr("x", width/2)
	//     .attr("y", -90)
	//     .style("text-anchor", "middle")
	//     .text("Number of Traffic accidents per dist & Hour combination");
	// 	matrixsvg.append("text")
	// 	.attr("class", "subtitle")
	//     .attr("x", width/2)
	//     .attr("y", -60)
	//     .style("text-anchor", "middle")
	//     .text("The Netherlands | 2014");

	// //Append credit at bottom
	// matrixsvg.append("text")
	// 	.attr("class", "credit")
	//     .attr("x", width/2)
	//     .attr("y", gridSize * (dists.length+1) + 80)
	//     .style("text-anchor", "middle")
	//     .text("Based on Miles McCrocklin's Heatmap block");

	///////////////////////////////////////////////////////////////////////////
	//////////////// Create the gradient for the legend ///////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Extra scale since the color scale is interpolated
	var riskScale = d3.scale.linear()
		.domain([0, d3.max(CloseContactArray, function (d) {
			return d.risk;
		})])
		.range([0, width])

	//Calculate the variables for the temp gradient
	// var numStops =2;
	// riskRange = riskScale.domain();
	// riskRange[2] = riskRange[1] - riskRange[0];
	// riskPoint = [];
	// for (var i = 0; i < numStops; i++) {
	// 	riskPoint.push(i * riskRange[2] / (numStops - 1) + riskRange[0]);
	// } //for i

	//Create the gradient
	// 这段有啥用？
	// const linearGradient=matrixsvg.append("defs")
	// 	.append("linearGradient")
	// 	.attr("id", "legend-traffic")
	// 	.attr("x1", "0%").attr("y1", "0%")
	// 	.attr("x2", "100%").attr("y2", "0%")
	// 	.selectAll("stop")
	// 	.data(d3.range(numStops))
	// 	//.enter().append("stop")
	// 	// .attr("offset", function (d, i) {
	// 	// 	return riskScale(riskPoint[i]) / width;
	// 	// })
	// 	.attr("stop-color", function (d, i) {
	// 		return colorScale(riskPoint[i]);
	// 	});

	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Draw the legend ////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	// var legendWidth = Math.min(width * 0.8, 400);
	// //Color Legend container
	// var legendsvg = matrixsvg.append("g")
	// 	.attr("class", "legendWrapper")
	// 	.attr("transform", "translate(" + (width / 2) + "," + (gridSize * dists.length + 10) + ")");

	//Draw the Rectangle
	// legendsvg.append("rect")
	// 	.attr("class", "legendRect")
	// 	.attr("x", legendWidth / 2)
	// 	.attr("y", 50)
	// 	//.attr("rx", hexRadius*1.25/2)
	// 	.attr("width", legendWidth)
	// 	.attr("height", 10)
	// 	.style("fill", "url(#legend-traffic)");


	//Set scale for x-axis
	// var xScale = d3.scale.linear()
	// 	.range([-legendWidth / 2, legendWidth / 2])
	// 	.domain([0, d3.max(CloseContactArray, function (d) {
	// 		return d.risk;
	// 	})]);

	// //Define x-axis
	// var xAxis = d3.svg.axis()
	// 	.orient("bottom")
	// 	.ticks(5)
	// 	//.tickFormat(formatPercent)
	// 	.scale(xScale);

	// //Set up X axis
	// legendsvg.append("g")
	// 	.attr("class", "axis")
	// 	.attr("transform", "translate(0," + (10) + ")")
	// 	.call(xAxis);
	// matrixsvg.append("rect")
	// .attr("class", "legendRect")
	// .attr("x", legendWidth / 2)
	// .attr("y", 50)
	// //.attr("rx", hexRadius*1.25/2)
	// .attr("width", legendWidth)
	// .attr("height", 10)
	// .style("fill","url(#legend-traffic)" );

}