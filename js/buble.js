var dataset;
var svgbuble = ""
var margin = {
    top: 10,
    right: 10,
    bottom: 50,
    left: 10
  },
  container_width = 900,
  container_height = 550,
  width = container_width - margin.left - margin.right,
  height = container_height - margin.top - margin.bottom;

 


function DrawBuble(s1, s2, e1, e2) {
  dataset = GeographyDataCaculate(s1, s2, e1, e2);
  console.log("buble");
  console.log(dataset)
  draw(dataset);


  function draw(data) {
    if (svgbuble != "") {
      svgbuble.remove();
      svgbuble = "";
    }
    "use strict";


    // svgbuble =
      
    //   bublesvg.append("g")
    //   .attr("id", "container")
    //   .attr("transform", "translate(" + margin.left*5 + "," + margin.top-10+ ")");

    // var main_padding = 20;
    // var sub_padding = 45;

    var chart = d3.select('#container')
      .append('g')
      .attr('id', 'text-label')
    svgbuble = d3
      .select("#chart")
      .append("svg")
      .attr("id", "svg_container").attr("viewBox", `0 0 ${container_width} ${container_height}`)
      .attr("preserveAspectRatio", "xMidYMid");
    svgbuble
      .append("circle")
      .attr("cx","30")
      .attr("cy","30")
      .attr("r","20")
      .style("stroke","#FF69B4")
      .style("stroke-width",'0.5')
      .attr("stroke-dasharray","3,3")
    svgbuble.append('text')
      .text('当前')
      .attr("x", 70)
      .attr('y', 35)
      .style("font-size", "15px")
      .style("font-family","宋体")
      .attr("stroke", "white")

    svgbuble
      .append("circle")
      .attr("cx","140")
      .attr("cy","30")
      .attr("r","20")
      .style("fill","#FF69B4")
      .style("opacity","0.5")
      // .style("stroke","blue")
      // .style("stroke-width",'2');
    svgbuble.append('text')
      .text('对照')
      .attr("x", 180)
      .attr('y', 35)
      .style("font-size", "18px")
      .style("font-family","宋体")
      .attr("stroke", "white")
    svgbuble.append('text')
      .text('风险指数')
      .attr("x",620)
      .attr('y', 50)
      .style("font-size", "18px")
      .style("font-family","宋体")
      .attr("stroke", "white")
    svgbuble.append('text')
      .text('地点')
      .attr("x",120)
      .attr('y', 450)
      .style("font-size", "18px")
      .style("font-family","宋体")
      .attr("stroke", "white")
   
   
    
    var y_extent = d3.extent(data, function (d) {
      return d.Change;
    })

    var y_scale = d3
      .scaleLinear()
      .domain([0, 1.5])
      .range([height, 0]);

    var r_scale = d3
      .scaleSqrt()
      .domain([0, y_extent[1]])
      .range([0, width / 14]);

    var base = 0
    var newbase = 5
    var gap = 12
    // base = current circle's left diameter point 
    // base + d = current circle's center 
    // newbase = next circle's left diameter point
    data.forEach(function (d, i) {
      base = newbase;
      let radius = 2 * r_scale(d.Change);
      newbase = newbase + 2 * radius + gap;
      d['r'] = radius;
      d['cx'] = base + radius+30;
    });

    var maxWidth = d3.max(data, function (d) {
      return d.cx + d.r;
    })

    // console.log(data);
    // console.log(maxWidth,'yer');
    // console.log(width);

    var yAxis = svgbuble.append("g").attr("class", "y-axis");
    yAxis
      .attr("transform", `translate(${200},15 )`)
      .call(
        d3
        .axisRight(y_scale)
        .tickSizeInner(width)
        .tickSizeOuter(0)
        .tickPadding(5)
        .tickFormat(function (d) {
          return d 
        })
      )
      .call(g => g.select(".domain").remove())
      .attr('text-anchor', 'end');
    d3.select(".y-axis")
      .selectAll(".tick")
      .each(function (d, i) {
        if (i % 2 != 0) {
          d3.select(this).remove();
        }
      });

    var groups = svgbuble.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return `translate(${d.cx+120},0)`;//cicrle偏离
      })

    var arrowColor = "#00CED1";
    svgbuble
      .append("svg:defs").append("svg:marker")
      .attr('class', 'skirty')
      .attr("id", "arrow")
      .attr("refX", 4)
      .attr("refY", 4)
      .attr("markerWidth", 30)
      .attr("markerHeight", 30)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0,0 8,4 0,8 3,4")
      .style("fill", arrowColor);

    // var keys = data.columns.slice(1, 3);
    var keys = ['former', 'latter'];

    groups.append('text')
      .attr('class', 'yer')
      .text(function (d) {
        return d.Geography
      })
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'hanging')
      .attr('x', 0)
      .attr('y', height)
      .attr('font-size', '14')
      .attr('fill', '#66605c')
      .attr('transform', function (d) {
        return `rotate(${0} ${0} ${height}) translate(${0} ${20})`
      })
      .attr('dy', '-0.35rem')

    dataset.forEach(function (d) {
      d.text = d.Geography;
    })

    groups
      .append('line')
      .attr("x1", 0)
      .attr("y1", function (d) {
        let key = keys[0];
        return y_scale(d[key]);
      })
      .attr("x2", 0)
      .attr("y2", function (d) {
        let key = keys[1];
        return y_scale(d[key]);
      })
      .attr("stroke-width", 2.0)
      .attr('stroke', arrowColor)
      .attr('marker-end', "url(#arrow)");

    var primaryColor = '#FF69B4'

    groups.selectAll(".circle")
      // [{},{}]
      .data(function (d) {
        return keys.map(function (key) {
          return {
            key: key,
            val: y_scale(d[key]),
            size: r_scale(d.Change)
          };
        });
      })
      .enter()
      .append("circle")
      .attr("cy", function (d, i) {
        return d.val;
      })
      .attr('r', function (d) {
        return d.size;
      })
      .attr("fill", function (d, i) {
        return i == 0 ? primaryColor : "none"
      })
      .attr('stroke', function (d, i) {
        return i == 0 ? 'none' : primaryColor
      })
      .attr('stroke-width', function (d, i) {
        return i == 0 ? 'none' : "3"
      })
      .attr("stroke-dasharray", function (d, i) {
        return i == 0 ? '0' : "4"
      })
      .attr('opacity', '0.5')


    // var z_scale = d3
    //   .color("white")
    //   .scale.ordinal()
    //   .domain(['2013-2017', '2018-2022'])
    //   .range([
    //     primaryColor,
    //     primaryColor
    //   ]);

    // var compLegend = d3.legendColor().orient('vertical')
    //   .shape("circle")
    //   .shapeRadius(10)
    //   .labelOffset(7)
    //   .shapePadding(20)
    //   .scale(z_scale);

    // svgbuble.append("g")
    //   .attr("class", "compLegend")
    //   .attr("transform", `translate(${0},${-margin.top / 2})`)
    //   .call(compLegend);

    var cells = d3.selectAll(".cell");
    cells
      .select("text")
      .style("text-anchor", "start")
      .style("font-size", 15)
      .attr("dominant-baseline", "central");

    var offset = 0;
    cells.each(function (d, i) {

      let d3sel = d3.select(this);

      if (i == 1) {
        let shape = d3sel.select('circle');
        shape.style('fill', 'none');
        shape.style('stroke-width', '2');
        shape.style('stroke-dasharray', '3');
        shape.style('stroke', primaryColor);
      }

      let textWidth = d3sel
        .select("text")
        .node()
        .getComputedTextLength();

      let offsetInc = textWidth + compLegend.shapeRadius() * 2 + compLegend.shapePadding() + compLegend.labelOffset();
      d3sel.attr("transform", "translate(" + offset + " 0)");

      let xTranslate = compLegend.shapeRadius() + compLegend.labelOffset();
      // this 0 for circle only
      d3sel.select("text").attr("transform", `translate(${xTranslate},${0})`)

      offset += offsetInc;
    });

  }
}