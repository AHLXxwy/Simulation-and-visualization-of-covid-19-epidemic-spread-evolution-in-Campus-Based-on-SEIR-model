

let Map = document.getElementById('B');
let heightk = Map.offsetHeight;
let widthk = Map.offsetWidth;

let svg1 = d3.select('#B').append('svg')
    .attr('height', Map.offsetHeight)
    .attr('width', Map.offsetWidth);

let TouchPeopleNum = 5;

let Touch = {
    'student': 1,
    'baoan': 2,
    'teacher': 1.2,
    'shitang': 1.2,
    'suguan': 2
}

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
var is_Divide=1;

function Position(name, position, area, infect, transition = 1 / 5.2, recover = 0) {
    this.name = name;
    this.position = position;
    this.people = new Array();
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
    // this.door = door;
    this.DrawPos = function () {
        svg1.append('rect')
            .attr('x', this.position[0])
            .attr('y', this.position[1])
            .attr('width', this.area[0])
            .attr('height', this.area[1])
            .attr('fill', 'none')
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
    this.passage = 0;
    this.InfectPlace = nowPosName;
    this.mark = 0;
    this.parent = name;
    this.clear = function () {
        this.nowPos = this.featurePos;
        this.NowPosName = this.FeaturePosName;
        // this.path = new Array();
    }
    this.ClassNum = 0;
    this.RoomNum = 0;
}

var PosFlag = new Object();
var Divide;
var PersonData = new Array();

// 横边界宽度
let stepwidth = 20;
// 纵边界宽度
let stepheight = 20;
// Divied arear的宽和正常区域宽的比例
let DivideP = 0.25

function imitate() {
    PosFlag = {
        'Dorm': new Position('Dorm', [stepwidth, stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], 0.01),
        'Supermarket': new Position('Supermarket', [stepwidth, (heightk - stepheight * 4) / 3 + 2 * stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], 0.005),
        'Classroom': new Position('Classroom', [stepwidth, 2 * (heightk - stepheight * 4) / 3 + 3 * stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], 0.007),
        'Canteen': new Position('Canteen', [(widthk - stepwidth * 4) / (2 + DivideP) + 2 * stepwidth, stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], 0.008),
        'Playground': new Position('Playground', [(widthk - stepwidth * 4) / (2 + DivideP) + 2 * stepwidth, (heightk - stepheight * 4) / 3 + 2 * stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], 0.0005),
        'Library': new Position('Library', [(widthk - stepwidth * 4) / (2 + DivideP) + 2 * stepwidth, 2 * (heightk - stepheight * 4) / 3 + 3 * stepheight], [(widthk - stepwidth * 4) / (2 + DivideP), (heightk - stepheight * 4) / 3], 0.006)
    }
    PosFlag['Dorm'].initRoom();
    PosFlag['Classroom'].initClass();
    Divide = new Position('Divied ', [(widthk - stepwidth * 4) * 2 / (2 + DivideP) + 3 * stepwidth, stepheight], [DivideP * (widthk - stepwidth * 4) / (2 + DivideP), heightk - 2 * stepheight], 0)

    Divide.DrawPos();
    for (let i in PosFlag) {
        // // console.log(i)
        PosFlag[i].DrawPos();
    }

    var PosName = ['Dorm', 'Supermarket', 'Classroom', 'Canteen', 'Playground', 'Library'];

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
        // PersonData[i].path.push(RandomPlaceCoordinate)
        // PosFlag[RandomPlace].people.push(PersonData[i]);
        // if (i == 0) {
        //     PosFlag[RandomPlace].ePos.push(PersonData[i])
        //     PosFlag[RandomPlace].e++;
        // } else {
        //     PosFlag[RandomPlace].sPos.push(PersonData[i]);
        //     PosFlag[RandomPlace].s++;
        // }
        // PersonData[i].markPath.push(PersonData[i].mark);
    }

    for (let j = 0; j < 50; ++j) {
        // let j = randomNum(0, 999);
        if (PersonData[j].status == 'student') {
            PersonData[j].nowPosName = 'Canteen';
            RandomPlace = 'Canteen';
            PersonData[j].nowPos = [randomNum(PosFlag[RandomPlace].position[0] + 10, PosFlag[RandomPlace].position[0] + PosFlag[RandomPlace].area[0] - 10), randomNum(PosFlag[RandomPlace].position[1] + 10, PosFlag[RandomPlace].position[1] + PosFlag[RandomPlace].area[1] - 10)]
            PersonData[j].status = 'shitang';
            PersonData[j].touchNum *= Touch[PersonData[j].status];
        }
    }

    for (let j = 50; j < 150; ++j) {
        // let j = randomNum(0, 999);
        if (PersonData[j].status == 'student') {
            PersonData[j].nowPosName = 'Classroom';
            RandomPlace = 'Classroom';
            PersonData[j].nowPos = [randomNum(PosFlag[RandomPlace].position[0] + 10, PosFlag[RandomPlace].position[0] + PosFlag[RandomPlace].area[0] - 10), randomNum(PosFlag[RandomPlace].position[1] + 10, PosFlag[RandomPlace].position[1] + PosFlag[RandomPlace].area[1] - 10)]
            PersonData[j].status = 'teacher';
            PersonData[j].touchNum *= Touch[PersonData[j].status];
        }
    }

    for (let j = 150; j < 200; ++j) {
        // let j = randomNum(0, 999);
        if (PersonData[j].status == 'student') {
            PersonData[j].nowPosName = 'Dorm';
            RandomPlace = 'Dorm';
            PersonData[j].nowPos = [randomNum(PosFlag[RandomPlace].position[0] + 10, PosFlag[RandomPlace].position[0] + PosFlag[RandomPlace].area[0] - 10), randomNum(PosFlag[RandomPlace].position[1] + 10, PosFlag[RandomPlace].position[1] + PosFlag[RandomPlace].area[1] - 10)]
            PersonData[j].status = 'suguan';
            PersonData[j].touchNum *= Touch[PersonData[j].status];
        }
    }
    let CntPos = 0;

    for (let j = 200; j < 250; ++j) {
        // let j = randomNum(0, 999);
        if (PersonData[j].status == 'student') {
            // // console.log(CntPos / 10 + 1)
            // // console.log(PosName[parseInt(CntPos / 10) + 1])
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
        // // console.log(PersonData[i].nowPosName)
        if (PersonData[i].status == 'student') {
            PersonData[i].RoomNum = parseInt(ClassifyClassAndRoom / 5) + 1;
            PersonData[i].ClassNum = parseInt(ClassifyClassAndRoom / 50) + 1;
            // // console.log("PPP = ", PersonData[i].ClassNum)
            // if (PersonData[i].nowPosName == 'Dorm') {
            //     PosFlag['Dorm'].roomName[PersonData[i].RoomNum].push(PersonData[i]);
            // }
            // if (PersonData[i].nowPosName == 'Classroom') {
            //     PosFlag['Classroom'].className[PersonData[i].ClassNum].push(PersonData[i]);
            // }
            ClassifyClassAndRoom++;
        }
        PersonData[i].path.push(PersonData[i].nowPos)
        PosFlag[PersonData[i].NowPosName].people.push(PersonData[i]);
        // if (PersonData[i].mark == 1) {
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

    // console.log('ClassNum = ', ClassifyClassAndRoom)

    for (let i in PosFlag) {
        PosFlag[i].timeLine.s.push(0);
        PosFlag[i].timeLine.e.push(0);
        PosFlag[i].timeLine.i.push(0);
        PosFlag[i].timeLine.r.push(0);
    }


    // console.log(PersonData);

    // // console.log(PersonData);


    PersonData[0].mark = 1;
    PersonData[0].time = randomNum(1, 14);

    for (let cnt = 1; cnt <= 104; ++cnt) {
        // let cnt = 1;
        // sleep(1000);
        // console.log(cnt)

        if (Divide.people.length > 0) {
            let recover = Math.ceil(Divide.people.length * Divide.recover);
            // // console.log('ss', recover)
            for (let i = 0; i < recover; ++i) {
                Divide.people[i].mark++;
                Divide.people[i].markPath.push(Divide.people[i].mark);
            }
        }
        Divide.clear();

        for (let i in PosFlag['Classroom'].ePos) {
            if (PosFlag['Classroom'].ePos[i] != 'student') continue;
            let InfectNum = 2;
            if (PosFlag['Classroom'].className[PosFlag['Classroom'].ePos[i].ClassNum].length == 1) {
                PosFlag['Classroom'].className[PosFlag['Classroom'].ePos[i].ClassNum][0].mark++;
            } else if (PosFlag['Classroom'].className[PosFlag['Classroom'].ePos[i].ClassNum].length > 1) {
                for (let k = 1; k <= 1; ++k) {
                    let j = randomNum(0, PosFlag['Classroom'].className[PosFlag['Classroom'].ePos[i].ClassNum].length - 1);
                    if (PosFlag['Classroom'].className[PosFlag['Classroom'].ePos[i].ClassNum][j].mark == 0) {
                        PosFlag['Classroom'].className[PosFlag['Classroom'].ePos[i].ClassNum][j].mark++;
                        PosFlag['Classroom'].className[PosFlag['Classroom'].ePos[i].ClassNum][j].parent = PosFlag['Classroom'].ePos[i];
                        PosFlag['Classroom'].className[PosFlag['Classroom'].ePos[i].ClassNum][j].passage = PosFlag['Classroom'].ePos[i].passage + 1;
                        PosFlag['Classroom'].className[PosFlag['Classroom'].ePos[i].ClassNum][j].time = randomNum(1, 14) + 1;
                    }
                }
            }
        }

        for (let i in PosFlag['Dorm'].ePos) {
            if (PosFlag['Dorm'].ePos[i] != 'student') continue;
            let In = [0.6, 0.4];
            let get = [0, 1];
            for (let j in PosFlag['Dorm'].roomName[PosFlag['Dorm'].ePos[i].RoomNum]) {
                if (PosFlag['Dorm'].roomName[PosFlag['Dorm'].ePos[i].RoomNum][j].mark == 0) {
                    PosFlag['Dorm'].roomName[PosFlag['Dorm'].ePos[i].RoomNum][j].mark += RandomPostion(get, In);
                    if (PosFlag['Dorm'].roomName[PosFlag['Dorm'].ePos[i].RoomNum][j].mark == 1) {
                        PosFlag['Dorm'].roomName[PosFlag['Dorm'].ePos[i].RoomNum][j].parent = PosFlag['Dorm'].ePos[i]
                        PosFlag['Dorm'].roomName[PosFlag['Dorm'].ePos[i].RoomNum][j].passage = PosFlag['Dorm'].ePos[i].passage + 1;
                        PosFlag['Dorm'].roomName[PosFlag['Dorm'].ePos[i].RoomNum][j].time = randomNum(1, 14) + 1;
                    }
                }
            }
        }

        for (var i in PosFlag) {
            if (PosFlag[i].people.length <= 0)
                continue;
            // // console.log(i);
            // let Infected = Math.floor(PosFlag[i].e * PosFlag[i].transition);
            // if (cnt > 93)
            //     Infected = Math.ceil(PosFlag[i].e * PosFlag[i].transition);
            // let Expose = Math.ceil((PosFlag[i].e + PosFlag[i].i) * PosFlag[i].infect * PosFlag[i].s / PosFlag[i].people.length);
            let Expose = 0;
            for (let j in Touch) {
                let TouchInPosI = Touch[j];
                if ((i == 'Dorm' || i == 'Classroom') && j == 'student') TouchInPosI = 2 / 5;
                Expose += Math.ceil((PosFlag[i].PeopleType[j]) * TouchInPosI * TouchPeopleNum * PosFlag[i].infect * PosFlag[i].s / PosFlag[i].people.length);
            }

            if (PosFlag[i].ePos.length) {
                for (let j in PosFlag[i].ePos) {
                    PosFlag[i].ePos[j].time--;
                    if (PosFlag[i].ePos[j].time <= 0) {
                        PosFlag[i].ePos[j].mark++;
                    }
                }
            }

            if (PosFlag[i].s > 0 && Expose > 0) {
                // // console.log(222)
                if (Expose >= PosFlag[i].s) {
                    for (let j = 0; j < PosFlag[i].s; ++j) {
                        PosFlag[i].sPos[j].mark++;
                        PosFlag[i].sPos[j].time = randomNum(1, 14);
                        PosFlag[i].sPos[j].parent = PosFlag[i].ePos[randomNum(0, PosFlag[i].e - 1)];
                        PosFlag[i].sPos[j].passage = PosFlag[i].sPos[j].parent.passage + 1;
                    }
                } else {
                    while (Expose > 0) {
                        if (Expose <= 0) break;
                        // for (let j = 0; j < Expose; ++j) {
                        let j = randomNum(0, PosFlag[i].s - 1);
                        if (PosFlag[i].sPos[j].mark != 0) continue;
                        PosFlag[i].sPos[j].mark++;
                        PosFlag[i].sPos[j].time = randomNum(1, 14);
                        PosFlag[i].sPos[j].parent = PosFlag[i].ePos[randomNum(0, PosFlag[i].e - 1)];
                        PosFlag[i].sPos[j].passage = PosFlag[i].sPos[j].parent.passage + 1;
                        Expose--;
                    }
                    // }
                }
            }
        }

        for (let i in PosFlag) {
            PosFlag[i].clear();
        }
        PosFlag['Dorm'].initRoom();
        PosFlag['Classroom'].initClass();

        for (let i = 0; i < 1000; ++i) {
            let RandomPlace;
            if (PersonData[i].status == 'student')
                RandomPlace = RandomPostion(PosName, PosRandom[cnt % 6]);
            else
                RandomPlace = PersonData[i].NowPosName;
            if (is_Divide) {
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
            RandomPlaceCoordinate = [randomNum(PosFlag[RandomPlace].position[0] + 10, PosFlag[RandomPlace].position[0] + PosFlag[RandomPlace].area[0] - 10), randomNum(PosFlag[RandomPlace].position[1] + 10, PosFlag[RandomPlace].position[1] + PosFlag[RandomPlace].area[1] - 10)]
            // PersonData.push(new Person(i, RandomPlace, RandomPlaceCoordinate, 'student'));
            PersonData[i].nowPos = RandomPlaceCoordinate;
            PersonData[i].nowPosName = RandomPlace;
            PersonData[i].path.push(RandomPlaceCoordinate)
            PosFlag[RandomPlace].people.push(PersonData[i]);
            if (PersonData[i].mark == 1) {
                PosFlag[RandomPlace].ePos.push(PersonData[i])
                PosFlag[RandomPlace].e++;
                PosFlag[RandomPlace].PeopleType[PersonData[i].status]++;
            } else if (PersonData[i].mark == 0) {
                PosFlag[RandomPlace].sPos.push(PersonData[i]);
                PosFlag[RandomPlace].s++;
                if (PersonData[i].status == 'student') {
                    if (RandomPlace == 'Dorm') {
                        // console.log(PersonData[i].RoomNum);
                        PosFlag[RandomPlace].roomName[PersonData[i].RoomNum].push(PersonData[i]);
                    }
                    if (RandomPlace == 'Classroom') {
                        PosFlag[RandomPlace].className[PersonData[i].ClassNum].push(PersonData[i]);
                    }
                }
            } else if (PersonData[i].mark == 2) {
                PosFlag[RandomPlace].i++;
                PosFlag[RandomPlace].PeopleType[PersonData[i].status]++;
            } else if (PersonData[i].mark == 3) {
                PosFlag[RandomPlace].r++;
            }
            PersonData[i].markPath.push(PersonData[i].mark);
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
}

imitate();

var Circlesvg1 = svg1.append('g');
Circlesvg1.selectAll('#Circle')
    .attr('id', 'Circle')
    .data(PersonData)
    .enter().append('circle')
    .attr('cx', (d, i) => {
        // return d.nowPos[0];
        return d.path[0][0]
    })
    .attr('cy', (d, i) => {
        // return d.nowPos[1];
        return d.path[0][1]
    })
    .attr('r', (d, i) => {
        if (i == 0)
            return 3;
        else return 3
    })
    .attr('fill', d => {
        // return colors[d.mark];

        return colors[d.markPath[0]]
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
    // // console.log(PersonData)
}
// // console.log('a')
// // console.log(PersonData)

var net_work_data = {
    node: [],
    link: []
};

var type_id = {
    'student': 0,
    'baoan': 1,
    'teacher': 2,
    'shitang': 3,
    'suguan': 4
}

for (let i in PersonData) {
    net_work_data.node.push({
        "group": type_id[PersonData[i].status],
        "class": type_id[PersonData[i].status],
        "size": PersonData[i].passage,
        "id": PersonData[i].name
    })
    if (PersonData[i].passage != 0)
        net_work_data.link.push({
            "source": PersonData[i].parent.name,
            "value": 1,
            "target": PersonData[i].name
        })
}

let TreeData = new Object();

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

console.log(TreeData[0]);
// console.log(net_work_data["node"]);
// console.log(TreeData[0]);
/**
 * 递归遍历树的节点，给每个节点加上标签
 */
function addLable(TreeData) {
    TreeData["group"] = net_work_data["node"][TreeData["id"]]["group"];
    if (TreeData.hasOwnProperty("children")) {
        for(let i = 0; i < TreeData["children"].length; i++) 
            addLable(TreeData["children"][i]);
    }
}
addLable(TreeData[0]);
// console.log(PosFlag);
/**
 * 递归求出树的高度
 */
function GetHeight(tree){
	let m = 0, n = 0;
    if (!tree.hasOwnProperty("children"))
        return 1;
    else {
        let max = 0;
        for(let i = 0; i < tree["children"].length; i++) 
            max = max < GetHeight(tree["children"][i]) ? GetHeight(tree["children"][i]) + 1 : max;
        return max;
    }
}
Tree.Height = GetHeight(TreeData[0]);
var CurseLineData = {
        s: [],
        e: [],
        i: [],
        r: []
    };
for (let i = 0; i < 105; i += 7) {
        var ss = 0, ee = 0, ii = 0, rr = 0;
        for (let j = i; j < i + 7; ++j) {
            for (let k in PosFlag) {
                ss += PosFlag[k].timeLine.s[j];
                ee += PosFlag[k].timeLine.e[j];
                ii += PosFlag[k].timeLine.i[j];
                rr += PosFlag[k].timeLine.r[j];
            }
        }
        CurseLineData.s.push(ss);
        CurseLineData.e.push(ee);
        CurseLineData.i.push(ii);
        CurseLineData.r.push(rr);
    }
    
    console.log(CurseLineData);
