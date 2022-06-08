/*
 * @Author: your name
 * @Date: 2020-05-29 16:17:15
 * @LastEditTime: 2020-06-14 00:38:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \可视化系统\新建文件夹\js\river.js
 */ 
const river = {
    data:[],
    dataset:["寝室", "图书馆" , "教室", "超市", "食堂", "操场"],
    bs:0.2,
    // jdg: {"寝室":1, "图书馆":1 , "教室":1, "超市":1, "食堂":1, "操场":1},
    // afterJdg:[],
    render: function() {
        
        
        let svg = d3.select("svg#track");
        
        let bs = this.bs;
        // let area = d3.area()
        //             .x(function(d, i) { return 80+i*6; })
        //             .y1(function(d, i) { return 220-d[1]*bs ; })
        //             .y0(function(d, i) { return 220-d[0]*bs ; })
        //             .curve(d3.curveMonotoneX);
        // console.log(this.data);
        svg.selectAll("g.track")
            .data(this.data)
            .join("g")
            .attr("class","track")
            .selectAll("rect.rect")
            .data(d => d)
            .join("rect")
            .attr("class","rect")
            .attr("x", (d, i) => (10+i*5.5))
            .attr("y", d => (205-d[1]*bs))
            .attr("width",5)
            .attr("height", d => (d[1] - d[0])*bs)
            .attr("fill", (d, i) => d[2])
        // svg.selectAll("path")
        //     .data(this.data)
        //     .join("path")
        //     .attr("d", (d, i) => area(d))
        //     .attr("fill", (d, i) => color[i]);
        // console.log(this.data);
    },
    explainRender: function() {
        let svg = d3.select("svg#track");
        let color = ['#32ffff','#ffff32',"red",'#32CD32'];
        if(this.data.length == 6)
            color = ["rgb(117, 154, 160)", "rgb(230, 157, 135)", "rgb(141, 193, 169)", "rgb(234, 126, 83)", "rgb(238, 221, 120)", "rgb(47, 69, 84)"];
        svg.selectAll("circle.explain")
            .data(this.dataset)
            .join("circle")
            .attr("class","explain")
            .attr("cx", (d, i) => (15 + i*50))
            .attr("cy", 260)
            .attr("r",5)
            // .attr("height",25)
            .attr("fill", (d, i) => color[i])
            .on("click", function(d, i) {
                river.dataset[i][2] = river.dataset[i][2] == 0 ? 1 : 0;
                river.render();
            })
        svg.selectAll("text.name")
            .data(this.dataset)
            .join("text")
            .attr("class","name")
            .attr("x", (d, i) => (22 + i*50))
            .attr("y", 264)
            .attr("fill","white")
            .attr("font-size","11px")
            .text((d) => d[0]);
    }
}