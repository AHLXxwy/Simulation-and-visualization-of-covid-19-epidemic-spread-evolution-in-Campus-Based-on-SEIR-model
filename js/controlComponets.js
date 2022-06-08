var is_D = 0;

var Radardata = []
var creatPosNum = 0;

init_number();
var slider;
// 感染速度
let infectSpeed = 0;

function modalData() {
    console.log(1);

    // init_number();

    var posname = document.getElementById('posname').value;
    var morning = parseFloat(document.getElementById('morning').value);
    var noon = parseFloat(document.getElementById('noon').value);
    var afternoon = parseFloat(document.getElementById('afternoon').value);
    var evening = parseFloat(document.getElementById('evening').value);
    // console.log(creatPosNum);
    document.getElementById('posname').value = "";
    document.getElementById('morning').value = "";
    document.getElementById('noon').value = "";
    document.getElementById('afternoon').value = "";
    document.getElementById('evening').value = "";
    creatPosNum++;
    // console.log($("#creatNum").text());
    $("#creatNum").text("已创建: ");
    $("#creatNum").append(creatPosNum);
    $("#tableBody").append("<tr><td>" + posname + "</td><td>" + (morning) + "</td><td>" + (noon) + "</td><td>" + (afternoon) + "</td><td>" + (evening) + "</td></tr>")
    PosName.push(posname);
    PosRandom[0].push(evening);
    PosRandom[1].push(morning);
    PosRandom[2].push(noon);
    PosRandom[3].push(afternoon);
    PosFlag[posname] = new Position(posname, [], [], TouchPeopleNum, init_infected, infectplacecolors[creatPosNum - 1]);
}

function StartSEIR() {
    // clearPic();
    // 人口流动速度
    var mP = 0.4 * moveSpeed / 100;
    var sP = 0.4 * (1 - moveSpeed / 100);
    kfx[0] += sP;
    kfx[1] += mP;
    // 接触距离
    touchP = [1 - touchPercent, touchPercent];
    divideR = [1 - divided_rate, divided_rate];
    // console.log(moveSpeed);
    SchoolPeople = parseInt(document.getElementById("peopleNum").value);
    $('#modelSum').text("总人数：" + (SchoolPeople));
    $('#modelS').text("易感人数：" + (0));
    $('#modelE').text("潜伏人数：" + (0));
    $('#modelI').text("感染人数：" + (0));
    $('#modelR').text("治愈人数：" + (0));
    creatPosNum = 4;
    PosName = ['a', 'b', 'c', 'd'];
    for (let i in PosName) {
        PosFlag[PosName[i]] = new Position(PosName[i], [], [], TouchPeopleNum, init_infected, infectplacecolors[i]);
    }
    PosRandom = [
        [0.3, 0.3, 0.2, 0.2],
        [0.2, 0.6, 0.1, 0.1],
        [0.1, 0.2, 0.4, 0.3],
        [0.7, 0.1, 0.1, 0.1]
    ]


    let poscnt = 0;
    for (let i in PosFlag) {
        if (creatPosNum <= 3) {
            PosFlag[i]['area'] = [(widthk - (2) * stepwidth), (heightk - stepheight * (2 + creatPosNum - 1)) / creatPosNum];
            PosFlag[i]['position'] = [stepwidth, stepheight * (1 + poscnt) + poscnt * (heightk - (2 + creatPosNum - 1)) / creatPosNum];
        } else {
            PosFlag[i]['area'] = [(widthk - (3) * stepwidth) / 2, (heightk - stepheight * (2 + parseInt(creatPosNum / 2) - 1)) / parseInt(creatPosNum / 2)];
            PosFlag[i]['position'] = [stepwidth + (poscnt % 2 == 0 ? 0 : (stepwidth + (widthk - (2) * stepwidth) / 2)), stepheight * (1 + parseInt(poscnt / 2)) + parseInt(poscnt / 2) * (heightk - stepheight * (2 + parseInt(creatPosNum / 2) - 1)) / parseInt(creatPosNum / 2)];
        }
        poscnt++;
    }
    s();
    DrawLine();
    Drawnet(net_work_data, closeContactTimeLine);
    //DrawMatrix(CloseContactArray,curtime,infectid);

    node.attr('opacity', d => {
        if (d.infectTime <= 0)
            return 1;
        else
            return 0;
    })
    link.attr('opacity', d => {
        if (d.infectTime <= 0)
            return 1;
        else
            return 0;
    })

}

function clearPic() {
    init_number();
    if (svg1 != 0) {
        svg1.remove();
    }
    svg1 = d3.select('#B').append('svg')
        .attr('height', Map.offsetHeight)
        .attr('width', Map.offsetWidth);
    if (svg4 != 0) {
        svg4.remove();
    }

    svg4 = d3.select("#linechart")
        .append("svg")
        .attr('id', 'line_svg')
        .attr("width", 220 + 100)
        .attr("height", 220 + 100)

    if (svg != '') {
        svg.remove();

    }
    svg = ks.append("g").attr('id', 'net_g');


    if (matrixsvg != '') {
        matrixsvg.remove();

    }
    matrixsvg = matrix_svg.append("g");

    
    if (svgbuble != "") {
        svgbuble.remove();
        svgbuble = "";
    }
    svgbuble = d3
    .select("#chart")
    .append("svg")
    .attr("id", "svg_container").attr("viewBox", `0 0 ${container_width} ${container_height}`)
    .attr("preserveAspectRatio", "xMidYMid");
    $("#kslider").remove();
    $("#timescale").append("<div id='kslider' style='width: 300px; display: inline-block;'></div>")
    $("#timeShow").text("第" + (1) + "天" + (0) + "时")
    slider = $("#kslider").slider({
        min: 0,
        max: 2159,
        range: "min",
        value: 0,
        slide: function (event, ui) {
            // select[ 0 ].selectedIndex = ui.value - 1;
            console.log(ui.value - 1)
            // change(ui.value + 1951);

            let ss = 0,
                ee = 0,
                ii = 0,
                rr = 0;
            for (let i in PosFlag) {
                ss += PosFlag[i].timeLine['s'][ui.value];
                ee += PosFlag[i].timeLine['e'][ui.value];
                ii += PosFlag[i].timeLine['i'][ui.value];
                rr += PosFlag[i].timeLine['r'][ui.value];
            }
            // console.log(ss);
            $('#modelS').text("易感人数：" + (ss));
            $('#modelE').text("潜伏人数：" + (ee));
            $('#modelI').text("感染人数：" + (ii));
            $('#modelR').text("治愈人数：" + (rr));
            s1 = ui.value;
            s2 = ui.value + 48;
            e1 = ui.value + 49;
            e2 = ui.value + 96;
            DrawBuble(s1, s2, e1, e2);

            node.attr('opacity', d => {
                if (d.infectTime <= ui.value)
                    return 1;
                else
                    return 0;
            })
            link.attr('opacity', d => {
                if (d.infectTime <= ui.value)
                    return 1;
                else
                    return 0;
            })
            $("#timeShow").text("第" + (parseInt(ui.value / 48) + 1) + "天" + (parseInt(ui.value % 48 / 6)) + "时")
            start(ui.value);
        }
    });
    infectSpeed = 0;
}

function sliderAll() {
    // var select = $( "#minbeds" );
    slider = $("#kslider").slider({
        min: 0,
        max: 719,
        range: "min",
        value: 0,
        slide: function (event, ui) {
            // select[ 0 ].selectedIndex = ui.value - 1;
            console.log(ui.value - 1)
            // change(ui.value + 1951);

            let ss = 0,
                ee = 0,
                ii = 0,
                rr = 0;
            for (let i in PosFlag) {
                ss += PosFlag[i].timeLine['s'][ui.value];
                ee += PosFlag[i].timeLine['e'][ui.value];
                ii += PosFlag[i].timeLine['i'][ui.value];
                rr += PosFlag[i].timeLine['r'][ui.value];
            }
            // console.log(ss);
            $('#modelS').text("易感人数：" + (ss));
            $('#modelE').text("潜伏人数：" + (ee));
            $('#modelI').text("感染人数：" + (ii));
            $('#modelR').text("治愈人数：" + (rr));
            s1 = ui.value;
            s2 = ui.value + 48;
            e1 = ui.value + 49;
            e2 = ui.value + 96;
            DrawBuble(s1, s2, e1, e2);

            node.attr('opacity', d => {
                if (d.infectTime <= ui.value)
                    return 1;
                else
                    return 0;
            })
            link.attr('opacity', d => {
                if (d.infectTime <= ui.value)
                    return 1;
                else
                    return 0;
            })
            $("#timeShow").text("第" + (parseInt(ui.value / 48) + 1) + "天" + (parseInt(ui.value % 48 / 6)) + "时")
            start(ui.value);
        }
    });

    slider2 = $("#peosonMoveslider").slider({
        min: 0,
        max: 100,
        range: "min",
        value: 100,
        slide: function (event, ui) {
            moveSpeed = ui.value / 100;
            $("#peosonMoveShow").text(ui.value / 100);

        }
    });

    slider3 = $("#peopleLengthslider").slider({
        min: 0,
        max: 100,
        range: "min",
        value: 30,
        slide: function (event, ui) {
            touchDistance = ui.value;
            $("#peopleLengthShow").text(ui.value / 100);
        }
    });

    slider4 = $("#dividedRateslider").slider({
        min: 0,
        max: 3,
        range: "min",
        value: 0,
        slide: function (event, ui) {
            is_Divided = ui.value;
            $("#dividedRateShow").text(ui.value * 25 + "%");
        }
    });

    slider5 = $("#incubationLengthslider").slider({
        min: 1,
        max: 14,
        range: "min",
        value: 6,
        slide: function (event, ui) {
            incubation = ui.value;
            $("#incubationLengthShow").text(ui.value + "天");
        }
    });
}


sliderAll()


function Run() {



    // console.log(radion.checked);
    init_number();

    is_Divided = is_D;
    sliderAll()
    s();
    start(0);
    DrawRadar(Radardata)
    DrawLine();


}