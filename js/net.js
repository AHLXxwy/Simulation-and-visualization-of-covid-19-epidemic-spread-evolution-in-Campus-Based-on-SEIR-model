var svg = ''
var svgclose = ''
var node;
var link;
var name;
var selectname;
var CloseContactArray = []

var wid = document.getElementById('tree').offsetWidth;
var hig = document.getElementById('tree').offsetHeight;

var ks = d3.select("#tree").append('svg')
    .attr('id', 'net')
    .attr('width', wid)
    .attr('height', hig);

function Drawnet(NetData, closeContactTimeLine) {
    if (svg != '') {
        svg.remove();

    }
    svg = ks.append("g").attr('id', 'net_g');
    // ks =d3.select("#tree").append('svg')
    // .attr('id', 'net')
    // .attr('width', wid)
    // .attr('height', hig)

    var zoom = d3.behavior.zoom()
        //.scale(0.1)
        .scaleExtent([-10, 10]).on("zoom", zoomed);
        console.log(zoom)
    graph = NetData;
    ksvg = d3.select("#net")
        .call(zoom);
    width = ksvg.attr("width");
    height = ksvg.attr('height');
    //定义svg变量将布局net选出来 



    console.log(graph);

    //g用于绘制所有边,selectALL选中所有的line,并绑定数据data(graph.links),enter().append("line")添加元素
    //数据驱动文档,设置边的粗细
    //前面定义var svg = d3.select("#svg1")
    link = svg.append("g").attr("class", "links").selectAll("line").data(graph.links)
        .enter().append("line").attr("stroke-width", function (d) {
            // console.log(d)
            //return Math.sqrt(d.value);
            return 1; //所有线宽度均为1
        });
    node = svg.append("g").attr("class", "nodes").selectAll("circle").data(graph.nodes)
        .enter().append("circle")
        .attr("r", function (d) {
            // console.log(d)
            // console.log(d.size)
            // if (d.size == 0)
            //     d.size = 1;
            return (1 / (d.size) *200);
        })
        .attr("fill", function (d) {
            // if (d.size == 0)
            //     return 'none';
            
            return infectplacecolors[d.infectplace.charCodeAt() - 97];
        }).attr("stroke", "none").attr("name", function (d) {
            return d.id;
        }).call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink(link).id(function (d) {
            return d.id;
        }).distance(150).strength(1))
        .force("charge", d3.forceManyBody().strength(-1200))
        .force("collision", d3.forceCollide(300)) //设置节点碰撞半径>= 点半径避免重叠
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide(100) //设置节点碰撞半径>= 点半径避免重叠
            .strength(0.9) //则将碰撞强度设置为指定的数值，强度范围为 [0, 1]。并返回当前碰撞力模型,默认0.7
            .iterations(4)) // iterations 则将每次应用碰撞检测力模型时候的迭代次数设置为指定的数值。如果没有指定 iterations 则返回当前的迭代次数，默认为 1。迭代次数越大，最终的布局越优，但是会增加程序运行上的消耗。;


    //圆增加title
    node.append("title").text(function (d) {
        return d.id;
    })

    //simulation中ticked数据初始化，并生成图形
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);
    graph.nodes[0].fx = width / 2
    graph.nodes[0].fy = height / 2
    //ticked()函数确定link线的起始点x、y坐标 node确定中心点 文本通过translate平移变化
    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });

        // text.
        // attr('transform', function(d) {
        //     return 'translate(' + d.x+ ',' + (d.y + d.size / 2)+ ')';
        // });
    }


    // Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension
    // 本地json数据需要放置服务器中请求 XAMPP
    function zoomed() {
        node.attr("transform",
            "translate(" + d3.event.translate + ")scale(" +
            d3.event.scale + ")");
        link.attr("transform",
            "translate(" + d3.event.translate + ")scale(" +
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
    //为net父元素下的.nodes circle元素绑定鼠标进入事件
    //mouseenter
    $('#net').on('click', '.nodes circle', function (event) {
        console.log(111111);
        // DrawTree();
        //通过变量dragging保证拖动鼠标时，其状态不受影响，从而改变图形
        //鼠标没有拖动才能处理事件
        // if (!dragging) {
            //获取被选中元素的名字
            var name = $(this).attr("name");
            selectname = name;
            console.log(name)
            var curtime = $('#kslider').slider('option', 'value');
            console.log("curtime");
            console.log(curtime);

            var k = 0;
            //处理密切接触者数据：
            console.log(closeContactTimeLine)
            console.log(name)
            CloseContactArray = [];
            for (var i = (curtime >= 24 * 2 ? curtime - 24 * 2 : 0); i <= curtime; i++) {
                if (typeof(closeContactTimeLine[i].length) != "undefined")
                    for (var j = 0; j < closeContactTimeLine[i].length; j++) {
                        if (closeContactTimeLine[i][j].infect_name == selectname) {
                            CloseContactArray[k] = closeContactTimeLine[i][j];
                            k++;
                            console.log(k)
                        }
                    }

            }
            console.log("closecontact");
            console.log(CloseContactArray);
            DrawMatrix(CloseContactArray, curtime, name);

            //选择#net .nodes中所有的circle，再增加个class
            d3.select('#net .nodes').selectAll('circle').attr('class', function (d) {

                //数据的id是否等于name,返回空
                if (d.id == name) {

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
            d3.select("#net .links").selectAll('line').attr('class', function (d) {
                if (d.source.id == name || d.target.id == name) {
                    return '';
                } else {
                    return 'inactive';
                }
            });
        // }
    });

    //鼠标移开还原原图，显示所有隐藏的点及边
    $('#net').on('mouseleave', '.nodes circle', function (event) {
        //如果dragging为false才处理事件
        if (!dragging) {
            d3.select('#net .nodes').selectAll('circle').attr('class', '');
            d3.select('#net .links').selectAll('line').attr('class', '');
        }
    });

    //鼠标进入文本显示相邻Node及边
    $('#net').on('click', '.texts text', function (event) {
        if (!dragging) {
            var name = $(this).attr('name');
            d3.select("#net .links").selectAll('line').attr('class', function (d) {
                if (d.source.id == name || d.target.id == name) {
                    return '';
                } else {
                    return 'inactive';
                }
            });
        }
    });



}