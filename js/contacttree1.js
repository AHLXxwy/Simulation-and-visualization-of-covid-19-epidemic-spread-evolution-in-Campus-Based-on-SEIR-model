
    	//定义边界
    	var marge = {top:50, bottom:0, left:10, right:0};
    
    	var svg = d3.select("#contacttree");
    	var width = svg.attr("width");
    	var height = svg.attr("height");
    	
    	var g = svg.append("g")
    		.attr("transform","translate("+marge.top+","+marge.left+")");
    	
    	var scale = svg.append("g")
    		.attr("transform","translate("+marge.top+","+marge.left+")");
    	//数据
    	var dataset = {
    		name:"中国",
    		children:[
    			{
    				name:"浙江",
    				children:[
    					{name:"杭州" ,value:100},
    					{name:"宁波",value:100},
            			{name:"温州",value:100},
            			{name:"绍兴",value:100}
    				]
    			},
    			{
    				name:"广西",
    				children:[
    					{
    						name:"桂林",
    						children:[
    							{name:"秀峰区",value:100},
                				{name:"叠彩区",value:100},
                				{name:"象山区",value:100},
               					{name:"七星区",value:100}
    						]
    					},
    					{name:"南宁",value:100},
            			{name:"柳州",value:100},
            			{name:"防城港",value:100}
    				]
    			},
    			{
    				name:"黑龙江",
    				children:[
    					{name:"哈尔滨",value:100},
            			{name:"齐齐哈尔",value:100},
            			{name:"牡丹江",value:100},
            			{name:"大庆",value:100}
    				]
    			},
    			{
    				name:"新疆" , 
        			children:
        			[
			            {name:"乌鲁木齐"},
			            {name:"克拉玛依"},
			            {name:"吐鲁番"},
			            {name:"哈密"}
        			]
    			}
    		]
    	};
    	
    	//创建一个hierarchy layout
    	var hierarchyData = d3.hierarchy(dataset)
    		.sum(function(d){
    			return d.value;
    		});
    		
    	//创建一个树状图
    	var tree = d3.tree()
    		.size([width-400,height-200])
    		.separation(function(a,b){
    			return (a.parent==b.parent?1:2)/a.depth;
    		})
    	
    	//初始化树状图，也就是传入数据,并得到绘制树基本数据
    	var treeData = tree(hierarchyData);
    	console.log(treeData);
    	//得到节点
    	var nodes = treeData.descendants();
    	var links = treeData.links();
    	
    	//输出节点和边
    	console.log(nodes);
    	console.log(links);
    	
    	//创建一个贝塞尔生成曲线生成器
    	var Bézier_curve_generator = d3.linkHorizontal()
    		.x(function(d) { return d.y; })
    		.y(function(d) { return d.x; });
    		
    	//有了节点和边集的数据后，我们就可以开始绘制了，
    	//绘制边
    	g.append("g")
    		.selectAll("path")
    		.data(links)
    		.enter()
    		.append("path")
    		.attr("d",function(d){
    			var start = {x:d.source.x,y:d.source.y};
    			var end = {x:d.target.x,y:d.target.y};
    			return Bézier_curve_generator({source:start,target:end});
    		})
    		.attr("fill","none")
    		.attr("stroke","yellow")
    		.attr("stroke-width",1);
    		
    	//绘制节点和文字
    	//老规矩，先创建用以绘制每个节点和对应文字的分组<g>
    	var gs = g.append("g")
    		.selectAll("g")
    		.data(nodes)
    		.enter()
    		.append("g")
    		.attr("transform",function(d){
    			var cx = d.x;
    			var cy= d.y;
    			return "translate("+cy+","+cx+")";
    		});
    	//绘制节点
    	gs.append("circle")
    		.attr("r",2)
    		.attr("fill","white")
    		.attr("stroke","blue")
    		.attr("stroke-width",0.5);
    		
    	//文字
    	// gs.append("text")
    	// 	.attr("x",function(d){
    	// 		return d.children?-40:8;
    	// 	})
    	// 	.attr("y",-5)
    	// 	.attr("dy",10)
    	// 	.text(function(d){
    	// 		return d.data.name;
        //     });
            function collapse(d){
                if(d.children){
                    console.log(d);
                    d._children=d.children;
                    d.children.forEach(collapse);
                    update(root)
                }
            }
            root.children.forEach(collapse);
            // 折叠之后要重绘
            update(root);
            function update(source) {
                // (2-1) 计算新树的布局
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);
                
                // (2-2) 树的深度这里树d.y。树的宽度最大720，要分四层，所以每层就乘180
                nodes.forEach(function(d) { 
                  d.y = d.depth * 180;// 树的x,y倒置了，所以这里Y其实是横向的
                });
               
                // (2-3) 数据连接，根据id绑定数据
                var node = svg.selectAll("g.node")
                    .data(nodes, function(d) {
                      return d.id //最初新点开的节点都没有id
                      || (d.id = ++i); //为没有id的节点添加上ID
                    });
               
                // (2-4) 点击时增加新的子节点
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                    .on("click", click);
                nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
                nodeEnter.append("text")
                    .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                    .text(function(d) { return d.name; })
                    .style("fill-opacity", 1e-6);
                
                // (2-5) 原有节点更新到新位置
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
                nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
                nodeUpdate.select("text")
                    .style("fill-opacity", 1);
                
                // (2-6) 折叠节点的子节点收缩回来
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) { 
                      return "translate(" + source.y + "," + source.x + ")"; 
                     })
                    .remove();
                nodeExit.select("circle")
                    .attr("r", 1e-6);
                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);
                
                // (2-7) 数据连接，根据目标节点的id绑定数据
                var link = svg.selectAll("path.link")
                    .data(links, function(d) { return d.target.id; });
                
                // (2-8) 增加新连接
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function(d) {
                      var o = {x: source.x0, y: source.y0};
                      return diagonal({source: o, target: o});
                    });
                
                // (2-9) 原有连接更新位置
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);
                
                // (2-10) 折叠的链接，收缩到源节点处
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                      var o = {x: source.x, y: source.y};
                      return diagonal({source: o, target: o});
                    })
                    .remove();
                // 把旧位置存下来，用以过渡
                nodes.forEach(function(d) {
                  d.x0 = d.x;
                  d.y0 = d.y;
                });
              }
              // (3) 切换折叠与否
            function click(d) {
                if (d.children) {
                d._children = d.children;
                d.children = null;
                } else {
                d.children = d._children;
                d._children = null;
                }
                update(d);// 重新渲染
            }
