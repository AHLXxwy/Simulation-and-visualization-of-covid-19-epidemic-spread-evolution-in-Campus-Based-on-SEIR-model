/*
 * @Author: your name
 * @Date: 2020-05-29 14:11:48
 * @LastEditTime: 2020-06-14 01:52:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \可视化系统\js\main.js
 */ 
/**
 * 处理流图需要是数据
 */
// console.log(PosFlag);
// function getData(type, option){
/**
 * 渲染树图
 */
d3.select("svg#Tree").append("g").attr("transform","translate(200, 150)").attr("id","circle");
d3.select("svg#Tree").append("g").attr("transform","translate(200, 150)").attr("id","path");
Tree.render();
// Tree.explainRender();
/**
 * 树图人员id查询事件
//  */
// document.getElementById("search").addEventListener("click", function () {
//     Tree.search = document.getElementById("searchId").value;
//     // console.log(Tree.search);
//     Tree.render();
// },false);
function zoomed() {
    d3.select("svg#Tree").attr("transform",
        "translate(" + zoom.translate() + ")" +
        "scale(" + zoom.scale() + ")"
    );
    d3.select("svg#Tree")
        .selectAll("circle.people")
        .attr("r",2/zoom.scale());
    d3.select("svg#Tree")
        .selectAll("path")
        .attr("stroke-width", 1.5/zoom.scale());
    // console.log();
    Tree.zoom = zoom.scale();
}
var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoomed);
d3.select("svg#Tree").call(zoom);

const getData = (type, option) => {
    let riverData;
    console.log(type, option);
    if (type == 1) {
        riverData = [[], [], [], [], [], []];//'寝室', '超市', '教室', '食堂', '操场', '图书馆'
        for(let j = 1; j < 105; j++) {//, , , 
            riverData[0].push([
                0, PosFlag["寝室"]["timeLine"][option][j], "rgb(117, 154, 160)"
            ]);
            riverData[1].push([
                PosFlag["寝室"]["timeLine"][option][j],
                PosFlag["寝室"]["timeLine"][option][j] + PosFlag["超市"]["timeLine"][option][j],
                "rgb(230, 157, 135)"
            ]);
            riverData[2].push([
                PosFlag["寝室"]["timeLine"][option][j] + PosFlag["超市"]["timeLine"][option][j],
                PosFlag["寝室"]["timeLine"][option][j] + PosFlag["超市"]["timeLine"][option][j] + PosFlag["教室"]["timeLine"][option][j],
                "rgb(141, 193, 169)"
            ]);
            riverData[3].push([
                PosFlag["寝室"]["timeLine"][option][j] + PosFlag["超市"]["timeLine"][option][j] + PosFlag["教室"]["timeLine"][option][j],
                PosFlag["寝室"]["timeLine"][option][j] + PosFlag["超市"]["timeLine"][option][j] + PosFlag["教室"]["timeLine"][option][j]
                + PosFlag["餐厅"]["timeLine"][option][j],
                "#FF4500"
            ]);
            riverData[4].push([
                PosFlag["寝室"]["timeLine"][option][j] + PosFlag["超市"]["timeLine"][option][j] + PosFlag["教室"]["timeLine"][option][j]
                + PosFlag["餐厅"]["timeLine"][option][j],
                PosFlag["寝室"]["timeLine"][option][j] + PosFlag["超市"]["timeLine"][option][j] + PosFlag["教室"]["timeLine"][option][j]
                + PosFlag["餐厅"]["timeLine"][option][j] + PosFlag["操场"]["timeLine"][option][j],
                "rgb(238, 221, 120)"
            ]);
            riverData[5].push([
                PosFlag["寝室"]["timeLine"][option][j] + PosFlag["超市"]["timeLine"][option][j] + PosFlag["教室"]["timeLine"][option][j]
                + PosFlag["餐厅"]["timeLine"][option][j] + PosFlag["操场"]["timeLine"][option][j],
                PosFlag["寝室"]["timeLine"][option][j] + PosFlag["超市"]["timeLine"][option][j] + PosFlag["教室"]["timeLine"][option][j]
                + PosFlag["餐厅"]["timeLine"][option][j] + PosFlag["操场"]["timeLine"][option][j] + PosFlag["图书馆"]["timeLine"][option][j],
                "#D3D3D3"
            ]);
        }
    }
    else {//let color = ['#32ffff','#ffff32',"red",'#32CD32'];
        riverData = [[], [], [], []];//s, e, i, r
        for(let j = 1; j < 105; j++) {
            riverData[0].push([0, PosFlag[option]["timeLine"]['s'][j],"#32ffff"]);
            riverData[1].push([PosFlag[option]["timeLine"]['s'][j], PosFlag[option]["timeLine"]['s'][j] + PosFlag[option]["timeLine"]['e'][j],"#ffff32"]);
            riverData[2].push([
                PosFlag[option]["timeLine"]['s'][j] + PosFlag[option]["timeLine"]['e'][j],
                PosFlag[option]["timeLine"]['s'][j] + PosFlag[option]["timeLine"]['e'][j] + PosFlag[option]["timeLine"]['i'][j],
                "red"
            ]);
            riverData[3].push([
                PosFlag[option]["timeLine"]['s'][j] + PosFlag[option]["timeLine"]['e'][j] + PosFlag[option]["timeLine"]['i'][j],
                PosFlag[option]["timeLine"]['s'][j] + PosFlag[option]["timeLine"]['e'][j] + PosFlag[option]["timeLine"]['i'][j] + PosFlag[option]["timeLine"]['r'][j],
                "#32CD32"
            ]);
        }
    }
    
    return riverData;
}
const getDataset = (type) => {
    let dataset;
    if (type == 1) {
        dataset = [//'寝室', '超市', '教室', '食堂', '操场', '图书馆'
            ["寝室", 1],
            ["超市", 1],
            ["教室", 1],
            ["食堂", 1],
            ["操场",  1],
            ["图书馆",  1]
        ];
    }
    else {
        dataset = [
            ["易感者",  1],
            ["潜伏者",  1],
            ["感染者",  1],
            ["康复者",  1]
        ];
    }
    return dataset;
}
var riverData = getData(1, "e");
// console.log(riverData);
let dataset = getDataset(1);

river.data = riverData;
river.dataset = dataset;
// console.log(riverData);
// 渲染流图
river.render();
river.explainRender();
//加一条线
d3.select("svg#track").append("line");
/**
 * 添加滑块事件
 */
// var range = document.getElementById("range");
// var timeList = ["起床到早上离上课20分钟", "早上离上课20分钟到上课", "早上", "中午", "下午", "晚饭时间", "晚上"];
// range.addEventListener("input", function() {
//     let value = parseInt(this.value);
//     document.getElementById("time").innerHTML = "Time: day " + (value+1);
//     river.data = riverData[""+value];
//     river.render();
//     // console.log(river.data);
// }, false);


/**
 * 添加鼠标进入事件
 */
let svgTrack = d3.select("svg#track");
var track = document.getElementById("track");
track.addEventListener("mousemove", function(e) {
    svgTrack.select("line")
            .attr("x1", e.offsetX <=10 ? 10 : (e.offsetX >= 587.5 ? 587.5 : e.offsetX))
            .attr("x2", e.offsetX <=10 ? 10 : (e.offsetX >= 587.5 ? 587.5 : e.offsetX))
            .attr("y1", 0)
            .attr("y2",245)
            .attr("stroke","white")
            .attr("stroke-width","2px")
            .attr("stroke-dasharray","6 3");
        let type = (vm.selected == "潜伏者" || vm.selected == "易感者" || vm.selected == "感染者" || vm.selected == "康复者") ? 1 : 2;
        var option;
        if(type == 1) {
            option = vm.selected == "潜伏者" ? 'e' :
                        vm.selected == "易感者" ? 's' : 
                        vm.selected == "康复者" ? 'r' :'i';
        }
        else {
            option = vm.selected == '寝室' ? '寝室' : 
                        vm.selected == '教室' ? '教室' :
                        vm.selected == '超市' ? '超市' :
                        vm.selected == '食堂' ? '餐厅' :
                        vm.selected == '操场' ? '操场' : '图书馆';
             
        }
    if(parseInt(e.offsetX)>10 && parseInt(e.offsetX)<587.5){
        value = parseInt((parseInt(e.offsetX)-10)/5.5);
        let tooltip = document.getElementById("tooltip");
        tooltip.style.opacity ="0.6";
        tooltip.style.left = e.offsetX + "px";
        tooltip.style.top = e.offsetY + "px";
        tooltip.style.width = "100px";
        tooltip.style.height = "100px";
        if (type == 1)//'寝室', '超市', '教室', '食堂', '操场', '图书馆'
            tooltip.innerHTML = "" 
                                + (river.dataset[5][1] == 1 ? "图书馆：" + PosFlag["图书馆"]["timeLine"][option][value] + "<br>" : "") 
                                + (river.dataset[4][1] == 1 ? "操场：" + PosFlag["操场"]["timeLine"][option][value] + "<br>" : "") 
                                + (river.dataset[3][1] == 1 ? "食堂：" + PosFlag["餐厅"]["timeLine"][option][value] + "<br>" : "") 
                                + (river.dataset[2][1] == 1 ? "教室：" + PosFlag["教室"]["timeLine"][option][value] + "<br>" : "") 
                                + (river.dataset[1][1] == 1 ? "超市：" + PosFlag["超市"]["timeLine"][option][value] + "<br>" : "") 
                                + (river.dataset[0][1] == 1 ? "寝室：" + PosFlag["寝室"]["timeLine"][option][value] + "<br>" : "") 
        else{
            tooltip.innerHTML = "" 
                            + (river.dataset[3][1] == 1 ? "康复者：" + PosFlag[option]["timeLine"]['r'][value] + "<br>" : "")
                            + (river.dataset[2][1] == 1 ? "感染者：" + PosFlag[option]["timeLine"]['i'][value] + "<br>" : "")
                            + (river.dataset[1][1] == 1 ? "潜伏者：" + PosFlag[option]["timeLine"]['e'][value] + "<br>" : "") 
                            + (river.dataset[0][1] == 1 ? "易感者：" + PosFlag[option]["timeLine"]['s'][value] + "<br>" : "")
            

        }
            
                            
                            
        // console.log(object);
    }
    else {
        let tooltip = document.getElementById("tooltip");
        tooltip.style.opacity = "0";
        svgTrack.select("line").attr("stroke-width","0px")
    }
}, false);

/**
 * 给下拉列表添加改变事件
 */
// let select = document.getElementById("attribute");
// select.addEventListener("click", function() {
//     riverData = getData();
//     river.data = riverData;
//     dataset = getDataset();
//     river.dataset = dataset;
//     river.render();
// }, false);

/**
 * 利用Vue操作控制窗口
 */
var vm = new Vue({
    el:"#risk",
    data:{
        selections : [
            "潜伏者",
            "易感者",
            "感染者",
            "康复者",
            "寝室",
            "图书馆",
            "教室",
            "超市",
            "食堂",
            "操场"
        ],
        selected:"潜伏者"
    },
    methods: {
        vary() {
            let type = (vm.selected == "潜伏者" || vm.selected == "易感者" || vm.selected == "感染者" || vm.selected == "康复者") ? 1 : 2;
            // console.log(type);
            var option;
            if(type == 1) {
                option = vm.selected == "潜伏者" ? 'e' :
                            vm.selected == "易感者" ? 's' : 
                            vm.selected == "康复者" ? 'r' :'i';
            }
            else {
                option = vm.selected == '寝室' ? '寝室' : 
                        vm.selected == '教室' ? '教室' :
                        vm.selected == '超市' ? '超市' :
                        vm.selected == '食堂' ? '餐厅' :
                        vm.selected == '操场' ? '操场' : '图书馆';
            }
            river.data = getData(type, option);
            river.dataset = getDataset(type);
            river.bs = (option == '操场'|| option == '超市'|| option == '图书馆'|| option == '寝室') ? 0.8 : 
                            option == 'e' ? 0.2 :
                            option == 's' ? 0.15 :
                            option == 'r' ? 0.2 :
                            option == '教室' ? 0.3 :0.5;
            river.render();
            river.explainRender();
        }
    }
    
})