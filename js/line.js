var svg4 = ''
var pre = 0;
var data_sumpre = []

function DrawLine() {
    var color = ['#00FFFFFF', '#FFD700', "red", '#00FF00'];
    var CurseLineData = {
        s: [],
        e: [],
        i: [],
        r: []
    };
    for (let i = 0; i < 720; i += 48) {
        var ss = 0,
            ee = 0,
            ii = 0,
            rr = 0;
        for (let j = i; j < i + 48; ++j) {
            for (let k in PosFlag) {
                ss += PosFlag[k].timeLine.s[j];
                ee += PosFlag[k].timeLine.e[j];
                ii += PosFlag[k].timeLine.i[j];
                rr += PosFlag[k].timeLine.r[j];
            }
            ss += Divide.timeLine.s[j];
            ee += Divide.timeLine.e[j];
            ii += Divide.timeLine.i[j];
            rr += Divide.timeLine.r[j];
        }
        CurseLineData.s.push(ss / 48);
        CurseLineData.e.push(ee / 48);
        CurseLineData.i.push(ii / 48);
        CurseLineData.r.push(rr / 48);
    }
    if (svg4 != '') {
        svg4.remove();

    }
    // 绘制折线图
    var padding = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 5
    };
    const height = 220;
    const width = 220;
    const xAxisWidth = width - padding.left - padding.right;
    const yAxisWidth = height - padding.top - padding.bottom;
    svg4 = d3.select("#linechart")
        .append("svg")
        .attr('id', 'line_svg')
        .attr("width", width + 100)
        .attr("height", height + 100)
    // for (var i = 0; i < data_sumpre.length; ++i) {
    //     svg4.append("path")
    //         .attr("d", pathLine(data_sumpre[i]))
    //         .attr("stroke", color[i])
    //         .attr("stroke-width", "1px")
    //         .attr("fill", "none")
    //         .attr("transform", `translate(${(padding.left)*2},0)`);
    // }

    dataset = CurseLineData;

    console.log(dataset);
    data_key = []
    year = []
    data_sum = []
    console.log(dataset);


    for (var i in dataset) {
        // console.log(i);
        if (i == 's') {
            data_change = [parseInt(dataset['s'][0] + dataset['e'][0] + dataset['i'][0] + dataset['r'][0])]
        } else {
            data_change = [0];
        }
        data_key.push(i);
        for (var num in dataset[i]) {
            data_change.push(parseInt(dataset[i][num]))
        }
        data_sum.push(data_change)
    }

    console.log(data_sum)

    const xScale = d3.scaleBand()
        .domain(dataset[data_key[0]].map((o, i) => i + 1))
        .range([0, xAxisWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, SchoolPeople])
        .rangeRound([yAxisWidth, 0])

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale);

    const gx = svg4.append("g").attr("class", 'axis')
        // .attr('stroke', 'white')
        .attr("transform", `translate(${(padding.left)*3}, ${height - padding.bottom+20})`);
    const gy = svg4.append('g').attr("class", 'axis')
        .attr("transform", "translate(" + ((padding.left) * 3 + 5) + "," + (height - padding.bottom - yAxisWidth + 20) + ")");

    // 绘制x轴
    gx.call(xAxis)
        .attr('stroke', '#FFF')
        .selectAll("text")
        .style("font-size", "10px")

    //     .attr("text-anchor", "end")
    //     .attr("x", 100)
    //     .attr("stroke", "white")
    //     .style("font-size", "8px")
    //     .style("font-style", "宋体")
    //     .attr("x", width - padding.right * 5)
    //     .attr("y", padding.bottom * 2)
    // .text(d => "day");

    // 绘制y轴
    gy.call(yAxis)
        .attr('stroke', '#FFF')
        .selectAll("text")
        .style("font-size", "10px")
    //     .append("text")
    //     .attr("text-anchor", "end")
    //     .attr("stroke", "white")
    //     .style("font-size", "8px")
    //     .style("font-style", "宋体")
    //     .attr("x", (padding.left - 10))
    //     .attr("y", 40)
    // .text(d => "pepole");
    svg4.append('text')
        .text('人数')
        .attr("x", 10)
        .attr('y', 20)
        .style("font-size", "10px")
        .style("font-style", "宋体")
        .attr("stroke", "white")
    svg4.append('text')
        .text('天')
        .attr("x", 235)
        .attr('y', 245)
        .style("font-family", "宋体")
        .style("font-size", "10px")
        .attr("stroke", "white")
    svg4.append("line")
        .attr("x1", 240)
        .attr("y1", 27)
        .attr("x2", 270)
        .attr("y2", 27)
        .attr("stroke", "#00FFFFFF")
        .attr("stroke-width", "1px");
    svg4.append('text')
        .text('易感者')
        .attr("x", 280)
        .attr('y', 30)
        .style("font-family", "宋体")
        .style("font-size", "12px")
        .attr("stroke", "white")
    svg4.append("line")
        .attr("x1", 240)
        .attr("y1", 47)
        .attr("x2", 270)
        .attr("y2", 47)
        .attr("stroke", "red")
        .attr("stroke-width", "1px");
    svg4.append('text')
        .text('感染者')
        .attr("x", 280)
        .attr('y', 50)
        .style("font-family", "宋体")
        .style("font-size", "12px")
        .attr("stroke", "white")
    svg4.append("line")
        .attr("x1", 240)
        .attr("y1", 67)
        .attr("x2", 270)
        .attr("y2", 67)
        .attr("stroke", "yellow")
        .attr("stroke-width", "1px");
    svg4.append('text')
        .text('潜伏者')
        .attr("x", 280)
        .attr('y', 70)
        .style("font-family", "宋体")
        .style("font-size", "12px")
        .attr("stroke", "white")
    svg4.append("line")
        .attr("x1", 240)
        .attr("y1", 87)
        .attr("x2", 270)
        .attr("y2", 87)
        .attr("stroke", "#00FF00")
        .attr("stroke-width", "1px");
    svg4.append('text')
        .text('治愈者')
        .attr("x", 280)
        .attr('y', 90)
        .style("font-family", "宋体")
        .style("font-size", "12px")
        .attr("stroke", "white")
    svg4.append("line")
        .attr("x1", 240)
        .attr("y1", 107)
        .attr("x2", 270)
        .attr("y2", 107)
        .attr("stroke", "white")
        .attr("stroke-dasharray", "5,5,5,5")
        .attr("stroke-width", "1px");
    svg4.append('text')
        .text('对照')
        .attr("x", 280)
        .attr('y', 110)
        .style("font-family", "宋体")
        .style("font-size", "12px")
        .attr("stroke", "white")



    // 创建线生成器
    const pathLine = d3.line()
        .curve(d3.curveBasis) // 如果没有这一行则是折线，有则为曲线
        .x((d, i) => xScale(i + 1) + padding.left + xScale.bandwidth() / 2)
        .y(d => height - padding.bottom - (yScale(0) - yScale(d)) + 20);

    // 绘制曲线
    console.log(data_sum);
    for (var i = 0; i < data_sum.length; ++i) {
        svg4.append("path")
            .attr("d", pathLine(data_sum[i]))
            .attr("stroke", color[i])
            .attr("stroke-width", "1px")
            .style("stroke-dasharray", "5,5")
            .attr("fill", "none")
            .attr("transform", `translate(${(padding.left)*2},0)`);
        if (pre != 0) {
            svg4.append("path")
                .attr("d", pathLine(data_sumpre[i]))
                .attr("stroke", color[i])
                .attr("stroke-width", "1px")
                .attr("fill", "none")
                .attr("transform", `translate(${(padding.left)*2},0)`);
        }

    }

    // let area=d3.area()
    // .x(function(d,i){return 50 + i * 80})
    // .y0(function(d,i){return height})
    // .y1(function(d,i){return height - d})
    // .curve(d3.curveCatmullRom)

    //     svg4.append('path')

    //     .attr('d', area(data_sum[1]))
    //     .attr("stroke","black")
    //     .attr("stroke-width","3px") 
    //     .style('fill','blue')
    pre = 1;
    data_sumpre = data_sum
}