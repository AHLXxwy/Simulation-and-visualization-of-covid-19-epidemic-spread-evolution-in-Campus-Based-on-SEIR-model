
var margin = ({ top: 40, right: 50, bottom: 70, left: 50 })  
var gridSize = 35;
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var hours = d3.range(24);
var color = d3
.scaleSequential()
.domain([0, d3.max(data, d => d.value)])
.interpolator(t => d3.interpolateViridis(1 - t)) // reverses the color ramp
var svg = d3.select("#gridchart").append("svg") // 选择“chart”（就是div），加入一个svg，设置属性跟div一样大
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g") // 在svg内加入一个g（group组），并设置元素g的显示位置
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var legend = g => {
    g.attr("transform", `translate(0, ${h - margin.bottom - legendBarHeight })`)
    .append("rect")
    .attr("width", w)
    .attr("height", legendBarHeight)
    .style("fill", "url(#linear-gradient)")
    
    g.call(axisBottom)
}
var data=[{"hour":0,"day":0,"value":1},
    {"hour":0,"day":0,"value":1},
    {"hour":1,"day":2,"value":2},
    {"hour":3,"day":0,"value":3},
    {"hour":6,"day":1,"value":4},
    {"hour":10,"day":3,"value":5},
    {"hour":11,"day":4,"value":6},
    {"hour":5,"day":5,"value":7},
    {"hour":8,"day":6,"value":8},]  
 // code credit: https://observablehq.com/@tmcw/d3-scalesequential-continuous-color-legend-example
 // and: https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
const defs = svg.append("defs");
const linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient");

linearGradient.selectAll("stop")
    .data(color.ticks().map((t, i, n) => ({
        offset: `${100*i/n.length}%`,
    color: color(t)
    })))
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

g.selectAll("rect")
    .data(data)
    .enter().append("rect")
     .attr("x", d => d.hour * gridSize)
     .attr("y", d => d.day * gridSize)
    .attr("width", gridSize)
    .attr("height", gridSize)
    .attr("fill", d => color(d.value))
    .attr("stroke", "#e2e2e2")
    .append("title")
    .text(d => d.value)

g.selectAll(".day")
    .data(days)
    .enter().append("text")
    .text(d => d)
    .classed("day", true)
    .attr("x", 0)
     .attr("y", (d, i) => i * gridSize)
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")

g.selectAll(".hour")
    .data(hours)
    .enter().append("text")
    .text(d => d)
    .classed("hour", true)
     .attr("x", (d, i) => i * gridSize)
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)");

g.append("g")
    .call(legend)
axisScale = d3.scaleLinear()
.domain(color.domain())
.range([0, 500])

axisBottom = g => {
    g.classed("axis axis--bottom", true)
    .attr("transform", `translate(0, ${600 - margin.bottom - legendBarHeight})`)
    .call(d3.axisBottom(axisScale)
    .ticks(width / 80)
    .tickSize(legendBarHeight))
    .select(".domain")
    .remove()
}