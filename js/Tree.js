/*
 * @Author: your name
 * @Date: 2020-06-09 14:51:51
 * @LastEditTime: 2020-06-14 10:40:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \可视化系统\new\js\Tree.js
 */ 
const Tree = {
    Height : 1,
    search:'',
    zoom:1,
    mouseovered : function(active) {
        return function (d) {
            // console.log(d);
            // console.log(this);
            d3.select(this).attr("r", active ? 3 : 2/Tree.zoom)
            // d3.select(this).classed("label--active", active);
            d3.select(d.linkExtensionNode).classed("link-extension--active", active).raise();
            do d3.select(d.linkNode).attr("stroke",active ? "white" : "#555").attr("stroke-width", active ? 2/Tree.zoom : 0.8/Tree.zoom);
            while (d = d.parent);
        };
    },
    render: function () {
        // ["rgb(117, 154, 160)", "rgb(230, 157, 135)", "rgb(141, 193, 169)", "rgb(234, 126, 83)", "rgb(238, 221, 120)", "rgb(47, 69, 84)"];
        var color =  {
            "寝室":"rgb(117, 154, 160)", 
            "超市":"rgb(230, 157, 135)", 
            "教室":"rgb(141, 193, 169)", 
            "餐厅":"#FF4500",
            "操场":"rgb(238, 221, 120)", 
            "图书馆":"#D3D3D3"
        }
                var width = 450;
                var radius = width / 2;
                // var zoom = radius / this.Height;
                // console.log(zoom);
                var tree = d3.tree()
                    .size([2 * Math.PI, radius-20])
                    .separation((a, b) => {
                        // console.log((a.parent == b.parent ? 4 : 2)/10000);
                        return (a.parent == b.parent ? 4 : 2)
                    })
                // var tree = d3.cluster().size([2 * Math.PI, radius - 100]);
                const root = tree(d3.hierarchy(TreeData[0])
                    .sort((a, b) => d3.ascending(a.data.id, b.data.id)));
                // console.log(data);
                // console.log(root);
                const svg = d3.select("svg#Tree");
                svg.select("g#path")
                    .attr("fill", "none")
                    .attr("stroke", "#555")
                    // .attr("stroke-opacity", 0.4)
                    .attr("stroke-width",1)
                    .selectAll("path")
                    
                    .data(root.links()) 
                    .join("path")
                    .each(function (d) {
                        d.target.linkNode = this;//记录父亲节点
                    })
                    .attr("d", d3.linkRadial()
                        .angle(d => d.x)
                        .radius(d => d.y))
                        
                    // console.log(root.descendants());
                svg.select("g#circle")
                    .selectAll("circle.people")
                    .data(root.descendants())
                    .join("circle")
                    .attr("class","people")
                    .attr("transform", (d, i) => `
                        rotate(${d.x * 180 / Math.PI - 90})
                        translate(${d.y},0)
                    `)
                    // .attr("fill", d => d.children ? "#555" : "#999")
                    .attr("fill", d => color[d.data.infectPlace] )
                    .attr("r", 1)
                    // .each(this.mouseovered(d.data.id == Tree.search))
                    .on("mouseover", this.mouseovered(true))
                    .on("mouseout", this.mouseovered(false))
                    .on("click",function (d) {
                        document.getElementById("searchId").value = "" + d.data.id;
                    })
                // svg.append("g").attr("transform","translate(330, 220)")
                //     .attr("font-family", "sans-serif")
                //     .attr("font-size", 10)
                //     .attr("stroke-linejoin", "round")
                //     .attr("stroke-width", 3)
                //     .selectAll("text")
                //     .data(root.descendants())
                //     .join("text")
                //     .attr("transform", d => `
                //         rotate(${d.x * 180 / Math.PI - 90}) 
                //         translate(${d.y*0.7},0) 
                //         rotate(${d.x >= Math.PI ? 180 : 0})
                //     `)
                //     .attr("dy", "0.31em")
                //     .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
                //     .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
                //     .text(d => d.data.i)
                //     .clone(true).lower()
                //     .attr("stroke", "white");
    },
    explainRender: function() {
        let svg = d3.select("svg#ex");
        var color =  [
            ["寝室","rgb(117, 154, 160)"], 
            ["超市","rgb(230, 157, 135)"], 
            ["教室","rgb(141, 193, 169)"], 
            ["食堂","rgb(234, 126, 83)"],
            ["操场","rgb(238, 221, 120)"], 
            ["图书馆","rgb(47, 69, 84)"]
        ]
        svg.selectAll("circle.explain")
            .data(color)
            .join("circle")
            .attr("class","explain")
            .attr("cx", 10)
            .attr("cy", (d, i) => (10 + i*35))
            .attr("r",5)
            // .attr("height",25)
            .attr("fill", (d, i) => d[1])
        svg.selectAll("text.name")
            .data(color)
            .join("text")
            .attr("class","name")
            .attr("x", 16)
            .attr("y", (d, i) => (14 + i*35))
            .attr("fill","white")
            .attr("font-size","11px")
            .text((d) => d[0]);
    }
}