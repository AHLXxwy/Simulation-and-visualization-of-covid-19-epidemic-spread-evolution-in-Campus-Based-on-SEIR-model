let Map = document.getElementById('B');
let heightk = Map.offsetHeight;
let widthk = Map.offsetWidth;
var net_work_data = {
    nodes: [],
    links: []
};

var type_id = {
    'student': 0,
    'baoan': 1,
    'teacher': 2,
    'shitang': 3,
    'suguan': 4
}
var iplacetype = {
    '寝室': 0,
    '超市': 1,
    '教室': 2,
    '餐厅': 3,
    '操场': 4,
    '图书馆': 5


}
var infectplacecolors = ['#7FFFAA', '#ff5375', '#FFD700', '#E1FFFF', '#9400D3', '#1E90FF'];
let svg1 = d3.select('#B').append('svg')
    .attr('height', Map.offsetHeight)
    .attr('width', Map.offsetWidth);

var padding = {
    top: 50,
    left: 100,
    right: 100,
    bottom: 50
};

var colors = ['#00FFFFFF', 'yellow', 'red', '#00FF00']
var peopleColor = ['#FF3366', '#FF00FF', '#3366FF', '#FFFF00', '#00FF99'];
var ppp = {
    'student': '#FF3366',
    'baoan': '#FF00FF',
    'teacher': '#3366FF',
    'shitang': '#FFFF00',
    'suguan': '#00FF99'
}

function sleep(d) {
    for (var t = Date.now(); Date.now() - t <= d;);
}

function randomNum(m, n) {
    var num = Math.floor(Math.random() * (m - n) + n);
    return num
}

function RandomPostion(arr1, arr2) {
    var sum = 0,
        factor = 0,
        random = Math.random();

    for (var i = arr2.length - 1; i >= 0; i--) {
        sum += arr2[i]; // 统计概率总和
    };
    random *= sum; // 生成概率随机数
    for (var i = arr2.length - 1; i >= 0; i--) {
        factor += arr2[i];
        if (random <= factor)
            return arr1[i];
    };
    return null;
};

function Position(name, position, area, StouchNum, infect, pos_color, transition = 1 / 5.2, recover = 1 / 18) {
    this.color = pos_color
    this.name = name;
    this.position = position;
    this.people = new Array();
    this.StouchNum = StouchNum;
    this.roomName = new Object();
    this.initRoom = function () {
        for (let i = 1; i <= 150; ++i) {
            this.roomName[i] = new Array();
        }
    }
    this.className = new Object();
    this.initClass = function () {
        for (let i = 1; i <= 20; ++i) {
            this.className[i] = new Array();
        }
    }
    this.clear = function () {
        this.people = new Array();
        this.e = 0;
        this.i = 0;
        this.s = 0;
        this.r = 0;
        this.sPos = new Array();
        this.ePos = new Array();
        this.iPos = new Array();
        this.ePos = new Array();
        this.PeopleType = {
            'student': 0,
            'shitang': 0,
            'suguan': 0,
            'baoan': 0,
            'teacher': 0
        };
    };
    this.area = area;
    this.infect = infect;
    this.transition = transition;
    this.recover = recover;
    this.e = 0;
    this.i = 0;
    this.s = 0;
    this.r = 0;
    this.PeopleType = {
        'student': 0,
        'shitang': 0,
        'suguan': 0,
        'baoan': 0,
        'teacher': 0
    }
    this.timeLine = {
        s: [],
        e: [],
        i: [],
        r: []
    }

    this.sPos = new Array();
    this.ePos = new Array();
    this.iPos = new Array();
    this.rPos = new Array();
    // this.door = door;
    this.DrawPos = function () {
        svg1.append('rect')
            .attr('x', this.position[0])
            .attr('y', this.position[1])
            .attr('width', this.area[0])
            .attr('height', this.area[1])
            .attr('fill', this.color)
            .attr('opacity', 0.3)
            .attr('stroke', 'white')
            .attr('stroke-width', 1);
        svg1.append('text')
            .attr('x', this.position[0])
            .attr('y', this.position[1])
            .attr('dy', '-0.1em')
            .attr('fill', 'white')
            .text(this.name);
    }
}

function Person(name, nowPosName, nowPos, status, touchNum) {
    this.name = name;
    this.status = status; // S E I R
    this.nowPos = nowPos;
    this.NowPosName = nowPosName;
    this.FeaturePosName = nowPos;
    this.touchNum = touchNum;
    // this.roomNum = roomNum;
    this.time = 0;
    this.featurePos = new Array();
    this.path = new Array();
    this.markPath = new Array();
    this.closeContact = new Array();
    this.closeContactPie = new Array();
    this.passage = 0;
    this.InfectPlace = nowPosName;
    this.InfectTime = 0;
    this.mark = 0;
    this.infectPlace = 0;
    this.parent = name;
    this.clear = function () {
        this.nowPos = this.featurePos;
        this.NowPosName = this.FeaturePosName;
        // this.path = new Array();
    }
    this.ClassNum = 0;
    this.RoomNum = 0;
}
var is_Divided = 0;
var PosFlag = new Object();
var Divide;
var PersonData = new Array();

// 横边界宽度
let stepwidth = 20;
// 纵边界宽度
let stepheight = 20;
// Divided的宽和正常区域宽的比例
let DivideP = 0.25

var init_infected = 0.045;

let TouchPeopleNum = 5;

let Touch = {
    'student': 1,
    'baoan': 2,
    'teacher': 1.2,
    'shitang': 1.2,
    'suguan': 2
}


function init_number() {
    is_Divided = 0;
    init_infected = 0.045;
    TouchPeopleNum = 5;
    Touch = {
        'student': 1,
        'baoan': 2,
        'teacher': 1.2,
        'shitang': 1.2,
        'suguan': 2
    };
    PosFlag = {
        '寝室': new Position('寝室', [stepwidth, stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], TouchPeopleNum, init_infected, infectplacecolors[0]),
        '超市': new Position('超市', [stepwidth, (heightk - stepheight * 4) / 3 + 2 * stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], TouchPeopleNum, init_infected, infectplacecolors[1]),
        '教室': new Position('教室', [stepwidth, 2 * (heightk - stepheight * 4) / 3 + 3 * stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], TouchPeopleNum, init_infected, infectplacecolors[2]),
        '餐厅': new Position('餐厅', [(widthk - stepwidth * 4) / (2 + DivideP) + 2 * stepwidth, stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], TouchPeopleNum, init_infected, infectplacecolors[3]),
        '操场': new Position('操场', [(widthk - stepwidth * 4) / (2 + DivideP) + 2 * stepwidth, (heightk - stepheight * 4) / 3 + 2 * stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], TouchPeopleNum, init_infected, infectplacecolors[4]),
        '图书馆': new Position('图书馆', [(widthk - stepwidth * 4) / (2 + DivideP) + 2 * stepwidth, 2 * (heightk - stepheight * 4) / 3 + 3 * stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], TouchPeopleNum, init_infected, infectplacecolors[5])
    };
    Divide = new Position('隔离区', [(widthk - stepwidth * 4) * 2 / (2 + DivideP) + 3 * stepwidth, stepheight], [DivideP * (widthk - stepwidth * 4) / (2 + DivideP), heightk - 2 * stepheight], 0)

}


let TreeData = new Object();

function s() {
    console.log('start')


    PosFlag['寝室'].initRoom();
    PosFlag['教室'].initClass();

    Divide.DrawPos();
    for (let i in PosFlag) {
        // // // // console.log(i)
        PosFlag[i].DrawPos();
    }

    var PosName = ['寝室', '超市', '教室', '餐厅', '操场', '图书馆'];

    var PosRandom = [
        [0.08, 0.1, 0.52, 0.15, 0.05, 0.1],
        [0.1, 0.1, 0.55, 0.1, 0.05, 0.1],
        [0.05, 0.05, 0.6, 0.05, 0.05, 0.2],
        [0.25, 0.17, 0.08, 0.42, 0.04, 0.04],
        [0.21, 0.04, 0.43, 0.04, 0.04, 0.24],
        [0.125, 0.04, 0.125, 0.375, 0.2, 0.135],
        [0.5, 0.05, 0.1, 0.05, 0.2, 0.1]
    ];

    PersonData = new Array();
    for (let i = 0; i < 1000; ++i) {
        let RandomPlace = RandomPostion(PosName, PosRandom[0]);
        RandomPlaceCoordinate = [randomNum(PosFlag[RandomPlace].position[0] + 10, PosFlag[RandomPlace].position[0] + PosFlag[RandomPlace].area[0] - 10), randomNum(PosFlag[RandomPlace].position[1] + 10, PosFlag[RandomPlace].position[1] + PosFlag[RandomPlace].area[1] - 10)]
        PersonData.push(new Person(i, RandomPlace, RandomPlaceCoordinate, 'student', TouchPeopleNum));
    }

    for (let j = 750; j < 800; ++j) {
        if (PersonData[j].status == 'student') {
            PersonData[j].nowPosName = '餐厅';
            RandomPlace = '餐厅';
            PersonData[j].nowPos = [randomNum(PosFlag[RandomPlace].position[0] + 10, PosFlag[RandomPlace].position[0] + PosFlag[RandomPlace].area[0] - 10), randomNum(PosFlag[RandomPlace].position[1] + 10, PosFlag[RandomPlace].position[1] + PosFlag[RandomPlace].area[1] - 10)]
            PersonData[j].status = 'shitang';
            PersonData[j].touchNum *= Touch[PersonData[j].status];
        }
    }

    for (let j = 800; j < 900; ++j) {
        if (PersonData[j].status == 'student') {
            PersonData[j].nowPosName = '教室';
            RandomPlace = '教室';
            PersonData[j].nowPos = [randomNum(PosFlag[RandomPlace].position[0] + 10, PosFlag[RandomPlace].position[0] + PosFlag[RandomPlace].area[0] - 10), randomNum(PosFlag[RandomPlace].position[1] + 10, PosFlag[RandomPlace].position[1] + PosFlag[RandomPlace].area[1] - 10)]
            PersonData[j].status = 'teacher';
            PersonData[j].touchNum *= Touch[PersonData[j].status];
        }
    }

    for (let j = 900; j < 950; ++j) {
        if (PersonData[j].status == 'student') {
            PersonData[j].nowPosName = '寝室';
            RandomPlace = '寝室';
            PersonData[j].nowPos = [randomNum(PosFlag[RandomPlace].position[0] + 10, PosFlag[RandomPlace].position[0] + PosFlag[RandomPlace].area[0] - 10), randomNum(PosFlag[RandomPlace].position[1] + 10, PosFlag[RandomPlace].position[1] + PosFlag[RandomPlace].area[1] - 10)]
            PersonData[j].status = 'suguan';
            PersonData[j].touchNum *= Touch[PersonData[j].status];
        }
    }
    let CntPos = 0;

    for (let j = 950; j < 1000; ++j) {
        if (PersonData[j].status == 'student') {
            PersonData[j].nowPosName = PosName[parseInt(CntPos / 10) + 1];
            RandomPlace = PosName[parseInt(CntPos / 10) + 1];
            PersonData[j].nowPos = [randomNum(PosFlag[RandomPlace].position[0] + 10, PosFlag[RandomPlace].position[0] + PosFlag[RandomPlace].area[0] - 10), randomNum(PosFlag[RandomPlace].position[1] + 10, PosFlag[RandomPlace].position[1] + PosFlag[RandomPlace].area[1] - 10)]
            PersonData[j].status = 'baoan';
            PersonData[j].touchNum *= Touch[PersonData[j].status];
            CntPos++;
        }
    }

    var ClassifyClassAndRoom = 0;

    for (let i = 0; i < 1000; ++i) {
        if (PersonData[i].status == 'student') {
            PersonData[i].RoomNum = parseInt(ClassifyClassAndRoom / 5) + 1;
            PersonData[i].ClassNum = parseInt(ClassifyClassAndRoom / 50) + 1;
            ClassifyClassAndRoom++;
        }
        PersonData[i].path.push(PersonData[i].nowPos)
        PosFlag[PersonData[i].NowPosName].people.push(PersonData[i]);
        if (i == 0) {
            PosFlag[PersonData[i].NowPosName].ePos.push(PersonData[i])
            PosFlag[PersonData[i].NowPosName].e++;
            PosFlag[PersonData[i].NowPosName].PeopleType[PersonData[i].status]++;
        } else {
            PosFlag[PersonData[i].NowPosName].sPos.push(PersonData[i]);
            PosFlag[PersonData[i].NowPosName].s++;
        }
        PersonData[i].markPath.push(PersonData[i].mark);
    }

    for (let i in PosFlag) {
        PosFlag[i].timeLine.s.push(PosFlag[i].s);
        PosFlag[i].timeLine.e.push(0);
        PosFlag[i].timeLine.i.push(0);
        PosFlag[i].timeLine.r.push(0);
    }
    Divide.timeLine.s.push(0);
    Divide.timeLine.e.push(0);
    Divide.timeLine.i.push(0);
    Divide.timeLine.r.push(0);

    PersonData[0].mark = 1;
    PersonData[0].time = randomNum(1, 6) * 7;
    PersonData[0].infectPlace = PersonData[300].NowPosName;

    for (let cnt = 1; cnt <= 104; ++cnt) {
        for (var k in PosFlag) {
            let recover = Math.ceil(PosFlag[k].i * PosFlag[k].recover);
            // // console.log(PosFlag[k].iPos);
            for (let i = 0; i < recover; ++i) {
                PosFlag[k].iPos[i].mark++;
                PosFlag[k].iPos[i].markPath.push(PosFlag[k].iPos[i].mark);
            }
        }

        if (Divide.people.length > 0) {
            let recover = Math.ceil(Divide.iPos.length * Divide.recover);
            // // // // console.log('ss', recover)
            // console.log('sdsfd', Divide.iPos.length);
            // console.log('asa', recover)
            for (let i = 0; i < recover; ++i) {
                // console.log(i);
                Divide.iPos[i].mark++;
                Divide.iPos[i].markPath.push(Divide.iPos[i].mark);
            }
        }
        Divide.clear();

        for (let i in Divide.ePos) {
            Divide.ePos[i].time--;
            if (Divide.ePos[i].time <= 0) {
                Divide.ePos[i].mark++;
            }
        }

        for (let i in PosFlag['教室'].ePos) {
            if (PosFlag['教室'].ePos[i] != 'student') continue;
            let InfectNum = 2;
            if (PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum].length == 1) {
                PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum][0].mark++;
            } else if (PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum].length > 1) {
                let In = [0.99, 0.01];
                let get = [0, 1];
                for (let k = 1; k <= RandomPostion(get, In); ++k) {
                    let j = randomNum(0, PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum].length - 1);
                    if (PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum][j].mark == 0) {
                        PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum][j].mark++;
                        PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum][j].infectPlace = '教室';
                        PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum][j].InfectTime = cnt;
                        PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum][j].parent = PosFlag['教室'].ePos[i];
                        PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum][j].passage = PosFlag['教室'].ePos[i].passage + 1;
                        PosFlag['教室'].className[PosFlag['教室'].ePos[i].ClassNum][j].time = randomNum(1, 6) * 7 + 1;
                    }
                }
            }
        }

        for (let i in PosFlag['寝室'].ePos) {
            if (PosFlag['寝室'].ePos[i] != 'student') continue;
            let In = [0.2, 0.8];
            let get = [0, 1];
            for (let j in PosFlag['寝室'].roomName[PosFlag['寝室'].ePos[i].RoomNum]) {
                if (PosFlag['寝室'].roomName[PosFlag['寝室'].ePos[i].RoomNum][j].mark == 0) {
                    PosFlag['寝室'].roomName[PosFlag['寝室'].ePos[i].RoomNum][j].mark += RandomPostion(get, In);
                    if (PosFlag['寝室'].roomName[PosFlag['寝室'].ePos[i].RoomNum][j].mark == 1) {
                        PosFlag['寝室'].roomName[PosFlag['寝室'].ePos[i].RoomNum][j].parent = PosFlag['寝室'].ePos[i]
                        PosFlag['寝室'].roomName[PosFlag['寝室'].ePos[i].RoomNum][j].infectPlace = '寝室';
                        PosFlag['寝室'].roomName[PosFlag['寝室'].ePos[i].RoomNum][j].InfectTime = cnt;
                        PosFlag['寝室'].roomName[PosFlag['寝室'].ePos[i].RoomNum][j].passage = PosFlag['寝室'].ePos[i].passage + 1;
                        PosFlag['寝室'].roomName[PosFlag['寝室'].ePos[i].RoomNum][j].time = (randomNum(1, 6)) * 7 + 1;
                    }
                }
            }
        }

        for (var i in PosFlag) {
            if (PosFlag[i].people.length <= 0)
                continue;
            let Expose = 0;
            for (let j in Touch) {
                let TouchInPosI = Touch[j];
                if ((i == '寝室' || i == '教室') && j == 'student') TouchInPosI = 2 / 5;
                // Expose += Math.ceil((PosFlag[i].PeopleType[j]) * TouchInPosI * TouchPeopleNum * PosFlag[i].infect * PosFlag[i].s / PosFlag[i].people.length);
                Expose += ((PosFlag[i].PeopleType[j]) * TouchInPosI * PosFlag[i].StouchNum * PosFlag[i].infect * PosFlag[i].s / PosFlag[i].people.length);
            }
            Expose = Math.ceil(Expose);

            if (PosFlag[i].ePos.length) {
                for (let j in PosFlag[i].ePos) {
                    PosFlag[i].ePos[j].time--;
                    if (PosFlag[i].ePos[j].time <= 0) {
                        PosFlag[i].ePos[j].mark++;
                    }
                }
            }

            if (PosFlag[i].s > 0 && Expose > 0) {
                // // // // console.log(222)
                if (Expose >= PosFlag[i].s) {
                    for (let j = 0; j < PosFlag[i].s; ++j) {
                        PosFlag[i].sPos[j].mark++;
                        PosFlag[i].sPos[j].time = randomNum(1, 6) * 7;
                        PosFlag[i].sPos[j].parent = PosFlag[i].ePos[randomNum(0, PosFlag[i].e - 1)];
                        PosFlag[i].sPos[j].passage = PosFlag[i].sPos[j].parent.passage + 1;
                        PosFlag[i].sPos[j].infectPlace = i;
                        PosFlag[i].sPos[j].InfectTime = cnt;
                    }
                } else {
                    while (Expose > 0) {
                        if (Expose <= 0) break;
                        // for (let j = 0; j < Expose; ++j) {
                        let j = randomNum(0, PosFlag[i].s - 1);
                        if (PosFlag[i].sPos[j].mark != 0) continue;
                        PosFlag[i].sPos[j].mark++;
                        PosFlag[i].sPos[j].time = randomNum(1, 6) * 7;
                        PosFlag[i].sPos[j].parent = PosFlag[i].ePos[randomNum(0, PosFlag[i].e - 1)];
                        PosFlag[i].sPos[j].passage = PosFlag[i].sPos[j].parent.passage + 1;
                        PosFlag[i].sPos[j].infectPlace = i;
                        PosFlag[i].sPos[j].InfectTime = cnt;
                        Expose--;
                    }
                    // }
                }
            }
            let sum_num = 0;
            let i_mark = new Object();
            for (let k in PosFlag[i].sPos) {
                if (PosFlag[i].sPos[k].mark == 0)
                    sum_num++;
                else {
                    if (typeof (i_mark[PosFlag[i].sPos[k].parent.name]) == 'undefined')
                        i_mark[PosFlag[i].sPos[k].parent.name] = new Array();
                    i_mark[PosFlag[i].sPos[k].parent.name].push(PosFlag[i].sPos[k]);
                }
            }
            // console.log(sum_num);

            let spcnt = 0;

            for (let j in PosFlag[i].ePos) {
                // console.log(j);
                // let mark = new Object();
                let contact = new Array();
                let k = 1;
                let initlen = 0;
                if (typeof (i_mark[PosFlag[i].ePos[j].name]) != 'undefined')
                    initlen = i_mark[PosFlag[i].ePos[j].name].length;

                while (1) {
                    if (k > 5 - initlen || k > sum_num)
                        break;
                    if (PosFlag[i].s == 0)
                        break;
                    if (PosFlag[i].sPos[spcnt].mark != 0) {
                        contact.push(PosFlag[i].sPos[spcnt]);
                        k++;
                    }
                    spcnt = (spcnt + 1) % PosFlag[i].s;
                }

                for (let k in i_mark[PosFlag[i].ePos[j].name]) {
                    contact.push(i_mark[PosFlag[i].ePos[j].name][k]);
                }
                let id_group = new Array();
                for (let t in contact) {
                    id_group.push(contact[t].name);
                    PosFlag[i].ePos[j].closeContact.push({
                        'pos': i,
                        'peo': contact[t],
                        'time': cnt
                    });
                }
                PosFlag[i].ePos[j].closeContactPie.push({
                    'percent': [contact.length - initlen, initlen],
                    'idgroup': id_group,
                    'place': iplacetype[i],
                    'time': cnt
                })
            }
            for (let j in PosFlag[i].iPos) {
                // console.log(j);
                // let mark = new Object();
                let contact = new Array();
                let k = 1;
                let initlen = 0;
                if (typeof (i_mark[PosFlag[i].iPos[j].name]) != 'undefined')
                    initlen = i_mark[PosFlag[i].iPos[j].name].length;

                while (1) {
                    if (k > 5 - initlen || k > sum_num)
                        break;
                    if (PosFlag[i].s == 0)
                        break;
                    if (PosFlag[i].sPos[spcnt].mark != 0) {
                        contact.push(PosFlag[i].sPos[spcnt]);
                        k++;
                    }
                    spcnt = (spcnt + 1) % PosFlag[i].s;
                }

                for (let k in i_mark[PosFlag[i].iPos[j].name]) {
                    contact.push(i_mark[PosFlag[i].iPos[j].name][k]);
                }
                let id_group = new Array();
                for (let t in contact) {
                    id_group.push(contact[t].name);
                    PosFlag[i].iPos[j].closeContact.push({
                        'pos': i,
                        'peo': contact[t],
                        'time': cnt
                    });
                }
                PosFlag[i].iPos[j].closeContactPie.push({
                    'percent': [contact.length - initlen, initlen],
                    'idgroup': id_group,
                    'place': iplacetype[i],
                    'time': cnt
                })
            }

        }

        for (let i in PosFlag) {
            PosFlag[i].clear();
        }
        PosFlag['寝室'].initRoom();
        PosFlag['教室'].initClass();

        for (let i = 0; i < 1000; ++i) {
            let RandomPlace;
            if (PersonData[i].status == 'student')
                RandomPlace = RandomPostion(PosName, PosRandom[cnt % 6]);
            else
                RandomPlace = PersonData[i].NowPosName;
            if (is_Divided == 1) {
                if (PersonData[i].mark == 2) {
                    RandomPlaceCoordinate = [randomNum(Divide.position[0] + 10, Divide.position[0] + Divide.area[0] - 10), randomNum(Divide.position[1] + 10, Divide.position[1] + Divide.area[1] - 10)];
                    PersonData[i].nowPos = RandomPlaceCoordinate;
                    PersonData[i].nowPosName = '隔离';
                    PersonData[i].path.push(RandomPlaceCoordinate)
                    PersonData[i].markPath.push(PersonData[i].mark);
                    Divide.people.push(PersonData[i]);
                    continue;
                }
            }
            if (is_Divided == 2) {
                if (PersonData[i].mark == 2) {
                    if (PersonData[i].status == 'student') {
                        for (let j = (parseInt(PersonData[i].RoomNum) - 1) * 5; j < parseInt(PersonData[i].RoomNum) * 5; ++j) {
                            RandomPlaceCoordinate = [randomNum(Divide.position[0] + 10, Divide.position[0] + Divide.area[0] - 10), randomNum(Divide.position[1] + 10, Divide.position[1] + Divide.area[1] - 10)];
                            PersonData[j].nowPos = RandomPlaceCoordinate;
                            PersonData[j].nowPosName = '隔离';
                            PersonData[j].path.push(RandomPlaceCoordinate)
                            PersonData[j].markPath.push(PersonData[j].mark);
                            Divide.people.push(PersonData[j]);
                        }
                    } else {
                        RandomPlaceCoordinate = [randomNum(Divide.position[0] + 10, Divide.position[0] + Divide.area[0] - 10), randomNum(Divide.position[1] + 10, Divide.position[1] + Divide.area[1] - 10)];
                        PersonData[i].nowPos = RandomPlaceCoordinate;
                        PersonData[i].nowPosName = '隔离';
                        PersonData[i].path.push(RandomPlaceCoordinate)
                        PersonData[i].markPath.push(PersonData[i].mark);
                    }
                    continue;
                }
            }
            if (is_Divided == 3) {
                if (PersonData[i].mark == 2) {
                    if (PersonData[i].status == 'student') {
                        for (let j = (parseInt(PersonData[i].ClassNum) - 1) * 50; j < parseInt(PersonData[i].ClassNum) * 50; ++j) {
                            RandomPlaceCoordinate = [randomNum(Divide.position[0] + 10, Divide.position[0] + Divide.area[0] - 10), randomNum(Divide.position[1] + 10, Divide.position[1] + Divide.area[1] - 10)];
                            PersonData[j].nowPos = RandomPlaceCoordinate;
                            PersonData[j].nowPosName = '隔离';
                            PersonData[j].path.push(RandomPlaceCoordinate)
                            PersonData[j].markPath.push(PersonData[j].mark);
                            Divide.people.push(PersonData[j]);
                        }
                    } else {
                        RandomPlaceCoordinate = [randomNum(Divide.position[0] + 10, Divide.position[0] + Divide.area[0] - 10), randomNum(Divide.position[1] + 10, Divide.position[1] + Divide.area[1] - 10)];
                        PersonData[i].nowPos = RandomPlaceCoordinate;
                        PersonData[i].nowPosName = '隔离';
                        PersonData[i].path.push(RandomPlaceCoordinate)
                        PersonData[i].markPath.push(PersonData[i].mark);
                        Divide.people.push(PersonData[i]);
                    }
                    continue;
                }
            }
            RandomPlaceCoordinate = [randomNum(PosFlag[RandomPlace].position[0] + 10, PosFlag[RandomPlace].position[0] + PosFlag[RandomPlace].area[0] - 10), randomNum(PosFlag[RandomPlace].position[1] + 10, PosFlag[RandomPlace].position[1] + PosFlag[RandomPlace].area[1] - 10)]
            // PersonData.push(new Person(i, RandomPlace, RandomPlaceCoordinate, 'student'));
            PersonData[i].nowPos = RandomPlaceCoordinate;
            PersonData[i].nowPosName = RandomPlace;
            PersonData[i].path.push(RandomPlaceCoordinate)
            PosFlag[RandomPlace].people.push(PersonData[i]);
            PersonData[i].markPath.push(PersonData[i].mark);
        }
        for (let i = 0; i < 1000; ++i) {
            let RandomPlace = PersonData[i].nowPosName;
            if (RandomPlace == '隔离') {
                if (PersonData[i].mark == 1) {
                    Divide.ePos.push(PersonData[i])
                    Divide.e++;
                    Divide.PeopleType[PersonData[i].status]++;
                } else if (PersonData[i].mark == 0) {
                    Divide.sPos.push(PersonData[i]);
                    Divide.s++;
                    if (PersonData[i].status == 'student') {
                        if (RandomPlace == '寝室') {
                            // // // console.log(PersonData[i].RoomNum);
                            Divide.roomName[PersonData[i].RoomNum].push(PersonData[i]);
                        }
                        if (RandomPlace == '教室') {
                            Divide.className[PersonData[i].ClassNum].push(PersonData[i]);
                        }
                    }
                } else if (PersonData[i].mark == 2) {
                    Divide.i++;
                    Divide.PeopleType[PersonData[i].status]++;
                    Divide.iPos.push(PersonData[i]);
                } else if (PersonData[i].mark == 3) {
                    Divide.r++;
                }
            } else {
                if (PersonData[i].mark == 1) {
                    PosFlag[RandomPlace].ePos.push(PersonData[i])
                    PosFlag[RandomPlace].e++;
                    PosFlag[RandomPlace].PeopleType[PersonData[i].status]++;
                } else if (PersonData[i].mark == 0) {
                    PosFlag[RandomPlace].sPos.push(PersonData[i]);
                    PosFlag[RandomPlace].s++;
                    if (PersonData[i].status == 'student') {
                        if (RandomPlace == '寝室') {
                            // // // console.log(PersonData[i].RoomNum);
                            PosFlag[RandomPlace].roomName[PersonData[i].RoomNum].push(PersonData[i]);
                        }
                        if (RandomPlace == '教室') {
                            PosFlag[RandomPlace].className[PersonData[i].ClassNum].push(PersonData[i]);
                        }
                    }
                } else if (PersonData[i].mark == 2) {
                    PosFlag[RandomPlace].i++;
                    PosFlag[RandomPlace].PeopleType[PersonData[i].status]++;
                    PosFlag[RandomPlace].iPos.push(PersonData[i]);
                } else if (PersonData[i].mark == 3) {
                    PosFlag[RandomPlace].r++;
                }
            }
        }
        for (let i in PosFlag) {
            PosFlag[i].timeLine.s.push(PosFlag[i].s);
            PosFlag[i].timeLine.e.push(PosFlag[i].e);
            PosFlag[i].timeLine.i.push(PosFlag[i].i);
            PosFlag[i].timeLine.r.push(PosFlag[i].r);
        }
        Divide.timeLine.s.push(Divide.s);
        Divide.timeLine.e.push(Divide.e);
        Divide.timeLine.i.push(Divide.i);
        Divide.timeLine.r.push(Divide.r);
    }
    TreeData = new Object();

    for (let i = 0; i < 1000; ++i) {
        if (PersonData[i].parent.name == PersonData[i].name) {
            TreeData[i] = {
                "id": i,
                "children": []
            }
        } else {
            if (typeof (TreeData[PersonData[i].parent.name]) == 'undefined') {
                TreeData[PersonData[i].parent.name] = {
                    "id": PersonData[i].parent.name,
                    "children": []
                }
            }
            if (typeof (TreeData[PersonData[i].parent.name]["children"]) == 'undefined') {
                TreeData[PersonData[i].parent.name]["children"] = []
            }
            if (typeof (TreeData[i]) == 'undefined')[
                TreeData[i] = {
                    "id": i,
                    // "children": []
                }
            ]
            TreeData[PersonData[i].parent.name]["children"].push(TreeData[i]);
        }
    }
    for (let i in PersonData) {
        net_work_data.nodes.push({
            "group": type_id[PersonData[i].status],
            "class": type_id[PersonData[i].status],
            "size": PersonData[i].passage,
            "id": PersonData[i].name,
            "infectplace": iplacetype[PersonData[i].infectPlace],
            "infectTime": PersonData[i].InfectTime
        })
        if (PersonData[i].passage != 0)
            net_work_data.links.push({
                "source": PersonData[i].parent.name,
                "value": 1,
                "target": PersonData[i].name,
                "infectTime": PersonData[i].InfectTime
            })
    }
    addLable(TreeData[0]);
    // Tree.Height = GetHeight(TreeData[0]);
    // console.log(Tree.Height);
}

init_number();
s();

var Circlesvg1 = svg1.append('g');


function start(cntx) {

    if (Circlesvg1 != 0) {
        Circlesvg1.remove();
        Circlesvg1 = svg1.append('g');
    }
    Circlesvg1.selectAll('#Circle')
        .attr('id', 'Circle')
        .data(PersonData)
        .enter().append('circle')
        .attr('cx', (d, i) => {
            // return d.nowPos[0];
            return d.path[cntx][0]
        })
        .attr('cy', (d, i) => {
            // return d.nowPos[1];
            return d.path[cntx][1]
        })
        .attr('r', (d, i) => {
            if (i == 0)
                return 3;
            else return 3
        })
        .attr('fill', d => {
            // return colors[d.mark];

            return colors[d.markPath[cntx]]
            // return ppp[d.status]
        })
        // .attr('fill-opacity', 0.3)
        .attr('stroke-width', 1)
        .attr('stroke', d => {
            // return colors[d.mark];
            // return colors[d.mark];
            // return colors[d.markPath[cntx]]
            // return ppp[d.status];
        });
    let rectData = new Array();

    let maxlen = 0;
    for (let i in PosFlag) {
        for (let j in PosFlag[i].timeLine) {
            for (let k in PosFlag[i].timeLine[j]) {
                maxlen = Math.max(PosFlag[i].timeLine[j][k], maxlen);
            }
        }
    }

    let rectScale = d3.scaleLinear()
        .domain([0, maxlen])
        .range([0, Divide.area[0]]);

    let s_sum = 0;
    let e_sum = 0;
    let i_sum = 0;
    let r_sum = 0;

    for (let i in PosFlag) {
        rectData.push(PosFlag[i].timeLine['s'][cntx]);
        s_sum += PosFlag[i].timeLine['s'][cntx];
        rectData.push(PosFlag[i].timeLine['e'][cntx]);
        e_sum += PosFlag[i].timeLine['e'][cntx];
        rectData.push(PosFlag[i].timeLine['i'][cntx]);
        i_sum += PosFlag[i].timeLine['i'][cntx];
        rectData.push(PosFlag[i].timeLine['r'][cntx]);
        r_sum += PosFlag[i].timeLine['r'][cntx];
    }

    Circlesvg1.selectAll('#rectA')
        .attr('id', 'rectA')
        .data(rectData)
        .enter()
        .append('rect')
        .attr('x', Divide.position[0])
        .attr('y', (d, i) => {
            return i * 10 + Divide.position[1];
        })
        .attr('width', (d, i) => {
            return rectScale(d);
        })
        .attr('height', 10)
        .attr('fill', (d, i) => {
            // console.log(i);
            return colors[i % 4];
        })
    // // // // console.log(PersonData)
}
// // // // console.log('a')
// // // // console.log(PersonData)

start(0);

// console.log(PosFlag)

// console.log(PersonData)
// console.log(TreeData[0]);
/**
 * 递归遍历树的节点，给每个节点加上标签
 */
function addLable(TreeData) {
    TreeData["group"] = net_work_data["nodes"][TreeData["id"]]["group"];
    TreeData["infectPlace"] = PersonData[TreeData["id"]]["infectPlace"];
    if (TreeData.hasOwnProperty("children")) {
        for (let i = 0; i < TreeData["children"].length; i++)
            addLable(TreeData["children"][i]);
    }
}
// addLable(TreeData[0]);
// // // console.log(PosFlag);
/**
 * 递归求出树的高度
 */
// function GetHeight(tree) {
//     if (!tree.hasOwnProperty("children"))
//         return 1;
//     else {
//         let max = 0;
//         for (let i = 0; i < tree["children"].length; i++)
//             max = max < GetHeight(tree["children"][i]) ? GetHeight(tree["children"][i]) + 1 : max;
//         return max;
//     }
// }
// Tree.Height = GetHeight(TreeData[0]);
var preLineData = {}
var CurseLineData = {
    s: [],
    e: [],
    i: [],
    r: []
};
for (let i = 0; i < 105; i += 7) {
    var ss = 0,
        ee = 0,
        ii = 0,
        rr = 0;
    for (let j = i; j < i + 7; ++j) {
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
    CurseLineData.s.push(ss / 7);
    CurseLineData.e.push(ee / 7);
    CurseLineData.i.push(ii / 7);
    CurseLineData.r.push(rr / 7);
}
preLineData = CurseLineData
// CurseLineData.s[0] = 999;

// console.log(ttt);
// console.log(CurseLineData);
// console.log(TreeData[0])

console.log(PersonData)