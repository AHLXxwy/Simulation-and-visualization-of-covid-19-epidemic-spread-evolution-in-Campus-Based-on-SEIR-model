var placecolors = ['orange', '#ff1493', '#7FFFAA', '#9370db', '#FFFF00','#F0FFF0']
var svg5=''
function Drawnet(){
  var net_work_data = {
    node: [],
    link: []
};
for (let i in PersonData) {
  net_work_data.node.push({
      "group": type_id[PersonData[i].status],
      "class": type_id[PersonData[i].status],
      "size": PersonData[i].passage,
      "id": PersonData[i].name,
      "infectplace":iplacetype[PersonData[i].infectPlace]
  })
  if (PersonData[i].passage != 0)
      net_work_data.link.push({
          "source": PersonData[i].parent.name,
          "value": 1,
          "target": PersonData[i].name
      })
}
var zoom=d3.behavior.zoom()
      .scaleExtent([-20,20]).on("zoom",zoomed);
if (svg5 != '') {
        svg5.remove();
  }
svg5 = d3.select("#net")
           .call(zoom), 
    width = svg5.attr("width"),
    height = svg5.attr("height");
var nodes=net_work_data.node
var simulation = d3.forceSimulation(nodes)
   
    .force("center", d3.forceCenter(this.width / 2, this.height / 2)) //centering作用力可以使得节点布局开之后围绕某个中心。
    .force("collision",d3.forceCollide(70) //设置节点碰撞半径>= 点半径避免重叠
    .strength(0.9) //则将碰撞强度设置为指定的数值，强度范围为 [0, 1]。并返回当前碰撞力模型,默认0.7
    .iterations(4) )// iterations 则将每次应用碰撞检测力模型时候的迭代次数设置为指定的数值。如果没有指定 iterations 则返回当前的迭代次数，默认为 1。迭代次数越大，最终的布局越优，但是会增加程序运行上的消耗。
    .force("charge", d3.forceManyBody().strength(-900))
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(150).strength(1))
    .on("tick", ticked);

var link = svg5.selectAll(".link"),
    node = svg5.selectAll(".node");

  
  // simulation.nodes(net_work_data.node);
  simulation.force("link").links(net_work_data.link);
  link = link
    .data(net_work_data.link)
    .enter().append("line")
      .attr("class", "link");

  node = node
    .data(net_work_data.node)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", '50')
      .style("fill", function(d) { return placecolors[d.infectplace]; });




    //   links.forEach(function(d) {
    //     if (links[d.source].children==undefined) {
    //         nodes[d.source].children=0;
    //     }
    //     nodes[d.source].children++
    // });
    // function linkArc(d) {
    //   var dx = d.target.x - d.source.x,
    //       dy = d.target.y - d.source.y,
    //       dr = (nodes[d.target].children>1 & nodes[d.source].children>1)?Math.sqrt(dx * dx + dy * dy):0;
    //   return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    // }

  


function ticked() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
      // link.attr("d", linkArc);
}
 // 本地json数据需要放置服务器中请求 XAMPP
 function zoomed(){
    node.attr("transform",
    "translate("+d3.event.translate+")scale(" +
    d3.event.scale + ")");
    link.attr("transform",
    "translate("+d3.event.translate+")scale(" +
    d3.event.scale + ")");
    
    
  }
  //为svg5父元素下的.nodes circle元素绑定鼠标进入事件
  $('#net').on('click', '.node circle', function(event) {
    //如果dragging为false才处理事件

        //d3.select('#net .node').selectAll('circle').attr('class', '');
          
    
});
}
Drawnet();
 