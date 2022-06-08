


$(document).ready(function() {
    // if (svg != '') {
    //     svg.remove();
    // }
   
    var zoom=d3.behavior.zoom()
    .scale(0.1)
    .scaleExtent([-10,10]).on("zoom",zoomed);

    //定义svg变量将布局net选出来 
  var svg = d3.select("#net")
                .call(zoom), 
        width = svg.attr("width"), 
        height = svg.attr('height');
    

    //定义name变量制作图标
    var names = ['Students', 'Teachers', 'Guards', 'CateenStaffs', 'DormitorManagers'];
    var colors = ['#7FFFAA', '#ff5375', '#FFD700', '#00FFFF', '#7B68EE'];

    //背景颜色设置 补充CSS样式设置字体布局
    for (var i=0; i < names.length; i++) {
        $('#indicator').append("<div><span style='background-color:" + colors[i] + "'></span>" + names[i] + "</div>");
    }
    
    //利用d3.forceSimulation()定义关系图 包括设置边link、排斥电荷charge、关系图中心点
    
    //存储关系图的数据
    var graph;
    
    //定义d3.json请求python处理好的Node及边 请求成功返回数据，否则报错
        
        graph = net_work_data;
        console.log(graph);
        console.log(graph.nodes.infectTime)
        //D3映射数据至HTML中
        //g用于绘制所有边,selectALL选中所有的line,并绑定数据data(graph.links),enter().append("line")添加元素
        //数据驱动文档,设置边的粗细
        //前面定义var svg = d3.select("#svg1")
        var link = svg.append("g").attr("class","links").selectAll("line").data(graph.links)
        .enter().append("line").attr("stroke-width", function(d) {
            //return Math.sqrt(d.value);
            return 1; //所有线宽度均为1
        });
        var node = svg.append("g").attr("class", "nodes").selectAll("circle").data(graph.nodes)
        .enter().append("circle")
        .attr('r','50')
        // .attr("r", function(d) {
        //     return (d.size*5);
        // })
        .attr("fill", function(d) {
            return colors[d.group];
        }).attr("stroke", "none").attr("name", function(d) {
            return d.id;
        }).call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );
        var simulation = d3.forceSimulation()
        .force("link",d3.forceLink(link).id(function(d) {
            return d.id;
        }).distance(150).strength(1))
        .force("charge",  d3.forceManyBody().strength(-1000))
        .force("collision",d3.forceCollide(200))//设置节点碰撞半径>= 点半径避免重叠
        .force("center", d3.forceCenter(width/2, height/2))
        .force("collision",d3.forceCollide(70) //设置节点碰撞半径>= 点半径避免重叠
        .strength(0.9) //则将碰撞强度设置为指定的数值，强度范围为 [0, 1]。并返回当前碰撞力模型,默认0.7
        .iterations(4) )// iterations 则将每次应用碰撞检测力模型时候的迭代次数设置为指定的数值。如果没有指定 iterations 则返回当前的迭代次数，默认为 1。迭代次数越大，最终的布局越优，但是会增加程序运行上的消耗。;

        //添加所有的点
        //selectAll("circle")选中所有的圆并绑定数据,圆的直径为d.size
        //再定义圆的填充色,同样数据驱动样式,圆没有描边,圆的名字为d.id
        //call()函数：拖动函数,当拖动开始绑定dragstarted函数，拖动进行和拖动结束也绑定函数
        

        //显示所有的文本 
        //设置大小、填充颜色、名字、text()设置文本
        //attr("text-anchor", "middle")文本居中
        // var text = svg.append("g").attr("class", "texts").selectAll("text").data(graph.nodes)
        // .enter().append("text").attr("font-size", function(d) {
        //     return d.size;
        // }).attr("fill", function(d) {
        //     return colors[d.group];
        // }).attr('name', function(d) {
        //     if (d.group==0)
        //     add='Stu'
        //     else if(d.group==1)
        //     add='Guard'
        //     else
        //     add='else'
        //     return (add+d.id);
        // }).text(function(d) {
        //     return d.id;
        // }).attr('text-anchor', 'middle').call(d3.drag()
        //     .on("start", dragstarted)
        //     .on("drag", dragged)
        //     .on("end", dragended)
        // );

        //圆增加title
        node.append("title").text(function(d) {
            return d.id;
        })

        //simulation中ticked数据初始化，并生成图形
        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        //ticked()函数确定link线的起始点x、y坐标 node确定中心点 文本通过translate平移变化
        function ticked() {
            link
                .attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            node
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });

            // text.
            // attr('transform', function(d) {
            //     return 'translate(' + d.x+ ',' + (d.y + d.size / 2)+ ')';
            // });
        }
   

    // Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension
    // 本地json数据需要放置服务器中请求 XAMPP
    function zoomed(){
        node.attr("transform",
        "translate("+d3.event.translate+")scale(" +
        d3.event.scale + ")");
        link.attr("transform",
        "translate("+d3.event.translate+")scale(" +
        d3.event.scale + ")");
        
        
      }
      
    //该变量保证拖动鼠标时，不会影响图形变换，默认为false未选中鼠标
    var dragging = false;

    //开始拖动并更新相应的点
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        dragging = true;
    }

    //拖动进行中
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    //拖动结束
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        dragging = false;
    }

    //span点击事件
    // $('#mode span').click(function(event) {
    //     //span都设置为不激活状态
    //     $('#mode span').removeClass('active');

    //     //点击的span被激活
    //     $(this).addClass('active');

    //     //text隐藏 nodes显示
    //     if ($(this).text() == 'Node') {
    //         $('.texts text').hide();
    //         $('.nodes circle').show();
    //     } else {
    //         $('.texts text').show();
    //         $('.nodes circle').hide();
    //     }
    // });
    var nodeid = []
    d3.select('#net .nodes').selectAll('circle').attr('class', function(d) {
        if(d.infectTime<10){
            nodeid.push(d.id);
           return '';
        }
        else{
           
            return 'inactive';
        }
        
        } )
        console.log('nodeid');
        console.log(nodeid)
        d3.select("#net .links").selectAll('line').attr('class', function(d) {
            for(var i=0;i<nodeid.lenghth;i++){
            if (d.source.id == nodeid[i] || d.target.id == nodeid[i]) {
                return '';
            } 
        }
        });
    
    //为net父元素下的.nodes circle元素绑定鼠标进入事件
    //mouseenter
    $('#net').on('click', '.nodes circle', function(event) {
        DrawTree();
        //通过变量dragging保证拖动鼠标时，其状态不受影响，从而改变图形
        //鼠标没有拖动才能处理事件
        if(!dragging) {
            //获取被选中元素的名字
            var name = $(this).attr("name");

            //设置#info h4样式的颜色为该Node的颜色，文本为该Nodename
            //$(this).attr('fill')表示当前悬浮圆的填充色
            // $('#info h4').css('color', $(this).attr('fill')).text(name);

            // //每次点击添加属性前把上次显示的信息去除，否则会不断叠加
            // $('#info p').remove();

            // //打印悬浮的Node信息
            // //console.log(info[name]);

            // //遍历所有的
            // for (var key in info[name]) {
            // 	//类型复杂的不进行显示
            // 	if (typeof(info[name][key]) == 'object') {
            //     	continue;
            // 	}
            // 	//比较复杂的超链接字段不显示
            //     if (key == 'url' || key == 'title' || key == 'name' || 
            //     	key == 'edited' || key == 'created' || key == 'homeworld') {
            //         continue;
            //     }
            //     //显示值及其字段名字
            //     $('#info').append('<p><span>' + key + '</span>' + info[name][key] + '</p>');
            // }

            //选择#net .nodes中所有的circle，再增加个class
            d3.select('#net .nodes').selectAll('circle').attr('class', function(d) {
               
                //数据的id是否等于name,返回空
                if(d.id==name) {
                    if(d.infectTime<10){
                      
                       return '';
                    }
                    else{
                       
                        return 'inactive';
                    }
                    
                } 
                //当前Node返回空，否则其他Node循环判断是否被隐藏起来(CSS设置隐藏)
                else {
                    //links链接的起始Node进行判断,如果其id等于name则显示这类Node
                    //注意: graph=data
                    for (var i = 0; i < graph.links.length; i++) {
                        //如果links的起点等于name，并且终点等于正在处理的则显示
                        if (graph.links[i]['source'].id == name && graph.links[i]['target'].id == d.id) {
                            return '';
                        }
                        if (graph.links[i]['target'].id == name && graph.links[i]['source'].id == d.id) {
                            return '';
                        }
                    }
                    return "inactive"; //前面CSS定义 .nodes circle.inactive
                }
            });

            //处理相邻的边line是否隐藏 注意 || 
            d3.select("#net .links").selectAll('line').attr('class', function(d) {
                if (d.source.id == name || d.target.id == name) {
                    return '';
                } else {
                    return 'inactive';
                }
            });
        }
       });

    //鼠标移开还原原图，显示所有隐藏的点及边
    $('#net').on('mouseleave', '.nodes circle', function(event) {
        //如果dragging为false才处理事件
        if(!dragging) {
            d3.select('#net .nodes').selectAll('circle').attr('class', '');
               d3.select('#net .links').selectAll('line').attr('class', '');
        } 
    });

    //鼠标进入文本显示相邻Node及边
    $('#net').on('click', '.texts text', function(event) {
        if (!dragging) {
            var name = $(this).attr('name');

            //同样的代码从选中圆中赋值过来
            // $('#info h4').css('color', $(this).attr('fill')).text(name);
            // $('#info p').remove();
            // for (var key in info[name]) {
            //     if (typeof(info[name][key]) == 'object') {
            //         continue;
            //     }
            //     if (key == 'url' || key == 'title' || key == 'name' || key == 'edited' || key == 'created' || key == 'homeworld') {
            //         continue;
            //     }
            //     $('#info').append('<p><span>' + key + '</span>' + info[name][key] + '</p>');
            // }

            // d3.select('#net .texts').selectAll('text').attr('class', function(d) {
            //     if (d.id == name) {
            //         return '';
            //     }

            //     for (var i = 0; i < graph.links.length; i++) {
            //         if (graph.links[i]['source'].id == name && graph.links[i]['target'].id == d.id) {
            //             return '';
            //         }
            //         if (graph.links[i]['target'].id == name && graph.links[i]['source'].id == d.id) {
            //             return '';
            //         }
            //     }
            //     return 'inactive';
            // });
            d3.select("#net .links").selectAll('line').attr('class', function(d) {
                if (d.source.id == name || d.target.id == name) {
                    return '';
                } else {
                    return 'inactive';
                }
            });
        }
    });

    //鼠标移除文本还原相应Node及边
    // $('#net').on('mouseleave', '.texts text', function(event) {
    //     if (!dragging) {
    //         d3.select('#net .texts').selectAll('text').attr('class', '');
    //         d3.select('#net .links').selectAll('line').attr('class', '');
    //     }
    // });

    //搜索框中输入内容则响应该事件
    //keyup按键敲击响应event
    // $('#search input').keyup(function(event) {
        
    //     //如果Input值是空的显示所有的圆和线(没有进行筛选)
    //     if ($(this).val() == '') {
    //         d3.select('#net .texts').selectAll('text').attr('class', '');
    //         d3.select('#net .nodes').selectAll('circle').attr('class', '');
    //         d3.select('#net .links').selectAll('line').attr('class', '');
    //     }
    //     //否则判断判断三个元素是否等于name值，等于则显示该值
    //     else {
    //         var name = $(this).val();
    //         //搜索所有的Node
    //         d3.select('#net .nodes').selectAll('circle').attr('class', function(d) {
    //             //输入Nodeid的小写等于name则显示，否则隐藏
    //             if (d.id.toString().indexOf(name.toString()) >= 0) {
    //                 return '';
    //             } else {
    //                 //优化：与该搜索Node相关联的Node均显示
    //                 //links链接的起始Node进行判断,如果其id等于name则显示这类Node
    //                 //注意: graph=data
    //                 for (var i = 0; i < graph.links.length; i++) {
    //                     //如果links的起点等于name，并且终点等于正在处理的则显示
    //                     if ((graph.links[i]['source'].id.toString().indexOf(name.toString()) >= 0) && 
    //                         (graph.links[i]['target'].id == d.id)) {
    //                         return '';
    //                     }
    //                     //如果links的终点等于name，并且起点等于正在处理的则显示
    //                     if ((graph.links[i]['target'].id.toString().indexOf(name.toString()) >= 0) && 
    //                         (graph.links[i]['source'].id == d.id)) {
    //                         return '';
    //                     }
    //                 }  
    //                 return 'inactive'; //隐藏其他Node  
    //             }

    //         });

    //         //搜索texts
    //         d3.select('#net .texts').selectAll('text').attr('class', function(d) {
    //             if (d.id.toString().indexOf(name.toString()) >= 0) {
    //                 return '';
    //             } else {
    //                 //优化：与该搜索Node相关联的Node均显示
    //                 //links链接的起始Node进行判断,如果其id等于name则显示这类Node
    //                 //注意: graph=data
    //                 for (var i = 0; i < graph.links.length; i++) {
    //                     //如果links的起点等于name，并且终点等于正在处理的则显示
    //                     if ((graph.links[i]['source'].id.toString().indexOf(name.toString()) >= 0) && 
    //                         (graph.links[i]['target'].id == d.id)) {
    //                         return '';
    //                     }
    //                     //如果links的终点等于name，并且起点等于正在处理的则显示
    //                     if ((graph.links[i]['target'].id.toString().indexOf(name.toString()) >= 0) && 
    //                         (graph.links[i]['source'].id == d.id)) {
    //                         return '';
    //                     }
    //                 }  
    //                 return 'inactive'; //隐藏其他Node
    //             }
    //         });

    //         //搜索links 所有与搜索name相关联的边均显示
    //         //显示相的邻边 注意 || 
    //         //name=$(this).val()：名字为键盘输入的内容
    //         d3.select("#net .links").selectAll('line').attr('class', function(d) {
    //             if ((d.source.id.toString().indexOf(name.toString()) >= 0) || 
    //                 (d.target.id.toString().indexOf(name.toString()) >= 0) 
    //                 ) {
    //                 return '';
    //             } else {
    //                 return 'inactive'; //隐藏
    //             }
    //         });
    //     }
    // }); //end input

    //加载Python获取的Json信息：六类实体详细属性信息
    // var info;

    // //d3.json获取数据
    // d3.json("all_data.json", function(error, data) {
    // 	if(error) throw error;
    // 	info = data;
    // });
    
});

