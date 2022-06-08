for (var i in PosFlag) {
    if (PosFlag[i].people.length <= 0)
        continue;

    if (i == '寝室') {
        for (let k in PosFlag[i].ePos) {
            if (PosFlag[i].ePos[k].status != 'student') {
                let TouchNumPeople = Math.min(Touch[PosFlag[i].ePos[k].status], PosFlag[i].people.length);
                let contact = new Array();
                let id_mark = new Array();
                if (TouchNumPeople == PosFlag[i].people.length) {
                    for (let j in PosFlag[i].people) {
                        contact.push(PosFlag[i].people[j]);
                        if (PosFlag[i].people[j].mark == 0) {
                            let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                            let get = [0, 1];
                            PosFlag[i].people[j].mark += RandomPostion(get, In);
                            if (PosFlag[i].people[j].mark == 1) {
                                PosFlag[i].people[j].parent = PosFlag[i].ePos[k];
                                PosFlag[i].people[j].infectPlace = i;
                                PosFlag[i].people[j].InfectTime = cnt;
                                PosFlag[i].people[j].passage = PosFlag[i].ePos[k].passage + 1;
                                PosFlag[i].people[j].time = randomNum(1, 6) * 7 + 1;
                            }
                        }
                    }
                } else {
                    while (TouchNumPeople) {
                        let j = randomNum(0, PosFlag[i].people.length - 1);
                        if (id_mark == 1) {
                            continue;
                        } else {
                            TouchNumPeople--;
                            id_mark[j] = 1;
                        }
                        contact.push(PosFlag[i].people[j]);
                        if (PosFlag[i].people[j].mark == 0) {
                            let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                            let get = [0, 1];
                            PosFlag[i].people[j].mark += RandomPostion(get, In);
                            if (PosFlag[i].people[j].mark == 1) {
                                PosFlag[i].people[j].parent = PosFlag[i].ePos[k];
                                PosFlag[i].people[j].infectPlace = i;
                                PosFlag[i].people[j].InfectTime = cnt;
                                PosFlag[i].people[j].passage = PosFlag[i].ePos[k].passage + 1;
                                PosFlag[i].people[j].time = randomNum(1, 6) * 7 + 1;
                            }
                        }
                    }
                }
                let id_group = new Array();
                for (let t in contact) {
                    if (contact[t].name == PosFlag[i].ePos[k].name) {
                        continue;
                    }
                    id_group.push(contact[t].name);
                    PosFlag[i].ePos[k].closeContact.push({
                        pos: i,
                        peo: contact[i],
                        time: cnt
                    })
                }
                PosFlag[i].ePos[k].closeContactPie.push({
                    percent: [contact.length - initLen, initLen],
                    idgroup: id_group,
                    place: iplacetype[i],
                    time: cnt
                })
                continue;
            }
            let In = [0.2, 0.8];
            let get = [0, 1];
            let contact = new Array();
            let initLen = 0;
            for (let j in PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum]) {
                if (PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum].name == PosFlag[i].ePos[k].name) {
                    continue;
                }
                contact.push(PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum][j]);
                if (PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum][j].mark == 0) {
                    initLen++;
                    PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum][j].mark += RandomPostion(get, In);
                    if (PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum][j].mark == 1) {
                        PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum][j].parent = PosFlag[i].ePos[k];
                        PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum][j].infectPlace = i;
                        PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum][j].InfectTime = cnt;
                        PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum][j].passage = PosFlag[i].ePos[k].passage + 1;
                        PosFlag[i].roomName[PosFlag[i].ePos[k].RoomNum][j].time = randomNum(1, 6) * 7 + 1;
                    }
                }
            }
            let id_group = new Array();
            for (let t in contact) {
                if (contact[t].name == PosFlag[i].ePos[k].name) {
                    continue;
                }
                id_group.push(contact[t].name);
                PosFlag[i].ePos[k].closeContact.push({
                    pos: i,
                    peo: contact[i],
                    time: cnt
                })
            }
            PosFlag[i].ePos[k].closeContactPie.push({
                percent: [contact.length - initLen, initLen],
                idgroup: id_group,
                place: iplacetype[i],
                time: cnt
            })
        }

        for (let k in PosFlag[i].iPos) {
            if (PosFlag[i].iPos[k].status != 'student') {
                let TouchNumPeople = Math.min(Touch[PosFlag[i].iPos[k].status], PosFlag[i].people.length);
                let contact = new Array();
                let id_mark = new Array();
                if (TouchNumPeople == PosFlag[i].people.length) {
                    for (let j in PosFlag[i].people) {
                        contact.push(PosFlag[i].people[j]);
                        if (PosFlag[i].people[j].mark == 0) {
                            let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                            let get = [0, 1];
                            PosFlag[i].people[j].mark += RandomPostion(get, In);
                            if (PosFlag[i].people[j].mark == 1) {
                                PosFlag[i].people[j].parent = PosFlag[i].ePos[k];
                                PosFlag[i].people[j].infectPlace = i;
                                PosFlag[i].people[j].InfectTime = cnt;
                                PosFlag[i].people[j].passage = PosFlag[i].ePos[k].passage + 1;
                                PosFlag[i].people[j].time = randomNum(1, 6) * 7 + 1;
                            }
                        }
                    }
                } else {
                    while (TouchNumPeople) {
                        let j = randomNum(0, PosFlag[i].people.length - 1);
                        if (id_mark == 1) {
                            continue;
                        } else {
                            TouchNumPeople--;
                            id_mark[j] = 1;
                        }
                        contact.push(PosFlag[i].people[j]);
                        if (PosFlag[i].people[j].mark == 0) {
                            let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                            let get = [0, 1];
                            PosFlag[i].people[j].mark += RandomPostion(get, In);
                            if (PosFlag[i].people[j].mark == 1) {
                                PosFlag[i].people[j].parent = PosFlag[i].iPos[k];
                                PosFlag[i].people[j].infectPlace = i;
                                PosFlag[i].people[j].InfectTime = cnt;
                                PosFlag[i].people[j].passage = PosFlag[i].iPos[k].passage + 1;
                                PosFlag[i].people[j].time = randomNum(1, 6) * 7 + 1;
                            }
                        }
                    }
                }
                let id_group = new Array();
                for (let t in contact) {
                    if (contact[t].name == PosFlag[i].iPos[k].name) {
                        continue;
                    }
                    id_group.push(contact[t].name);
                    PosFlag[i].iPos[k].closeContact.push({
                        pos: i,
                        peo: contact[i],
                        time: cnt
                    })
                }
                PosFlag[i].iPos[k].closeContactPie.push({
                    percent: [contact.length - initLen, initLen],
                    idgroup: id_group,
                    place: iplacetype[i],
                    time: cnt
                })
                continue;
            }
            let In = [0.2, 0.8];
            let get = [0, 1];
            let contact = new Array();
            let initLen = 0;
            for (let j in PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum]) {
                if (PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum].name == PosFlag[i].iPos[k].name) {
                    continue;
                }
                contact.push(PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum][j]);
                if (PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum][j].mark == 0) {
                    initLen++;
                    PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum][j].mark += RandomPostion(get, In);
                    if (PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum][j].mark == 1) {
                        PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum][j].parent = PosFlag[i].iPos[k];
                        PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum][j].infectPlace = i;
                        PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum][j].InfectTime = cnt;
                        PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum][j].passage = PosFlag[i].iPos[k].passage + 1;
                        PosFlag[i].roomName[PosFlag[i].iPos[k].RoomNum][j].time = randomNum(1, 6) * 7 + 1;
                    }
                }
            }
            let id_group = new Array();
            for (let t in contact) {
                if (contact[t].name == PosFlag[i].iPos[k].name) {
                    continue;
                }
                id_group.push(contact[t].name);
                PosFlag[i].iPos[k].closeContact.push({
                    pos: i,
                    peo: contact[i],
                    time: cnt
                })
            }
            PosFlag[i].iPos[k].closeContactPie.push({
                percent: [contact.length - initLen, initLen],
                idgroup: id_group,
                place: iplacetype[i],
                time: cnt
            })
        }
        continue;
    } else if (i == '教室') {
        for (let k in PosFlag[i].ePos) {
            if (PosFlag[i].ePos[k].status != 'student') {
                let TouchNumPeople = Math.min(Touch[PosFlag[i].ePos[k].status], PosFlag[i].people.length);
                let contact = new Array();
                let id_mark = new Array();
                if (TouchNumPeople == PosFlag[i].people.length) {
                    for (let j in PosFlag[i].people) {
                        contact.push(PosFlag[i].people[j]);
                        if (PosFlag[i].people[j].mark == 0) {
                            let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                            let get = [0, 1];
                            PosFlag[i].people[j].mark += RandomPostion(get, In);
                            if (PosFlag[i].people[j].mark == 1) {
                                PosFlag[i].people[j].parent = PosFlag[i].ePos[k];
                                PosFlag[i].people[j].infectPlace = i;
                                PosFlag[i].people[j].InfectTime = cnt;
                                PosFlag[i].people[j].passage = PosFlag[i].ePos[k].passage + 1;
                                PosFlag[i].people[j].time = randomNum(1, 6) * 7 + 1;
                            }
                        }
                    }
                } else {
                    while (TouchNumPeople) {
                        let j = randomNum(0, PosFlag[i].people.length - 1);
                        if (id_mark == 1) {
                            continue;
                        } else {
                            TouchNumPeople--;
                            id_mark[j] = 1;
                        }
                        contact.push(PosFlag[i].people[j]);
                        if (PosFlag[i].people[j].mark == 0) {
                            let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                            let get = [0, 1];
                            PosFlag[i].people[j].mark += RandomPostion(get, In);
                            if (PosFlag[i].people[j].mark == 1) {
                                PosFlag[i].people[j].parent = PosFlag[i].ePos[k];
                                PosFlag[i].people[j].infectPlace = i;
                                PosFlag[i].people[j].InfectTime = cnt;
                                PosFlag[i].people[j].passage = PosFlag[i].ePos[k].passage + 1;
                                PosFlag[i].people[j].time = randomNum(1, 6) * 7 + 1;
                            }
                        }
                    }
                }
                let id_group = new Array();
                for (let t in contact) {
                    if (contact[t].name == PosFlag[i].ePos[k].name) {
                        continue;
                    }
                    id_group.push(contact[t].name);
                    PosFlag[i].ePos[k].closeContact.push({
                        pos: i,
                        peo: contact[i],
                        time: cnt
                    })
                }
                PosFlag[i].ePos[k].closeContactPie.push({
                    percent: [contact.length - initLen, initLen],
                    idgroup: id_group,
                    place: iplacetype[i],
                    time: cnt
                })
                continue;
            }
            let TouchNumPeople = Math.min(Touch[PosFlag[i].ePos[k].status], PosFlag[i].className[PosFlag[i].ePos[k].ClassNum].length);
            let contact = new Array();

            if (TouchNumPeople == PosFlag[i].className[PosFlag[i].ePos[k].ClassNum].length) {
                for (let j in PosFlag[i].className[PosFlag[i].ePos[k].ClassNum]) {
                    contact.push(PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j]);
                    if (PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].mark == 0) {
                        let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                        let get = [0, 1];
                        PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].mark += RandomPostion(get, In);
                        if (PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].mark == 1) {
                            PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].parent = PosFlag[i].ePos[k];
                            PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].infectPlace = i;
                            PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].InfectTime = cnt;
                            PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].passage = PosFlag[i].ePos[k].passage + 1;
                            PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].time = randomNum(1, 6) * 7 + 1;
                        }
                    }
                }
            } else {
                let id_mark = new Array();
                while (TouchNumPeople) {
                    let j = randomNum(0, PosFlag[i].className[PosFlag[i].ePos[k].ClassNum].length - 1);
                    if (id_mark == 1) {
                        continue;
                    } else {
                        TouchNumPeople--;
                        id_mark[j] = 1;
                    }
                    contact.push(PosFlag[i].people[j]);
                    if (PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].mark == 0) {
                        let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                        let get = [0, 1];
                        PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].mark += RandomPostion(get, In);
                        if (PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].mark == 1) {
                            PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].parent = PosFlag[i].ePos[k];
                            PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].infectPlace = i;
                            PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].InfectTime = cnt;
                            PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].passage = PosFlag[i].ePos[k].passage + 1;
                            PosFlag[i].className[PosFlag[i].ePos[k].ClassNum][j].time = randomNum(1, 6) * 7 + 1;
                        }
                    }
                }
            }

            let id_group = new Array();
            for (let t in contact) {
                if (contact[t].name == PosFlag[i].ePos[k].name) {
                    continue;
                }
                id_group.push(contact[t].name);
                PosFlag[i].ePos[k].closeContact.push({
                    pos: i,
                    peo: contact[i],
                    time: cnt
                })
            }
            PosFlag[i].ePos[k].closeContactPie.push({
                percent: [contact.length - initLen, initLen],
                idgroup: id_group,
                place: iplacetype[i],
                time: cnt
            })
        }
        for (let k in PosFlag[i].iPos) {
            if (PosFlag[i].iPos[k].status != 'student') {
                let TouchNumPeople = Math.min(Touch[PosFlag[i].iPos[k].status], PosFlag[i].people.length);
                let contact = new Array();
                let id_mark = new Array();
                if (TouchNumPeople == PosFlag[i].people.length) {
                    for (let j in PosFlag[i].people) {
                        contact.push(PosFlag[i].people[j]);
                        if (PosFlag[i].people[j].mark == 0) {
                            let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                            let get = [0, 1];
                            PosFlag[i].people[j].mark += RandomPostion(get, In);
                            if (PosFlag[i].people[j].mark == 1) {
                                PosFlag[i].people[j].parent = PosFlag[i].iPos[k];
                                PosFlag[i].people[j].infectPlace = i;
                                PosFlag[i].people[j].InfectTime = cnt;
                                PosFlag[i].people[j].passage = PosFlag[i].iPos[k].passage + 1;
                                PosFlag[i].people[j].time = randomNum(1, 6) * 7 + 1;
                            }
                        }
                    }
                } else {
                    while (TouchNumPeople) {
                        let j = randomNum(0, PosFlag[i].people.length - 1);
                        if (id_mark == 1) {
                            continue;
                        } else {
                            TouchNumPeople--;
                            id_mark[j] = 1;
                        }
                        contact.push(PosFlag[i].people[j]);
                        if (PosFlag[i].people[j].mark == 0) {
                            let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                            let get = [0, 1];
                            PosFlag[i].people[j].mark += RandomPostion(get, In);
                            if (PosFlag[i].people[j].mark == 1) {
                                PosFlag[i].people[j].parent = PosFlag[i].iPos[k];
                                PosFlag[i].people[j].infectPlace = i;
                                PosFlag[i].people[j].InfectTime = cnt;
                                PosFlag[i].people[j].passage = PosFlag[i].iPos[k].passage + 1;
                                PosFlag[i].people[j].time = randomNum(1, 6) * 7 + 1;
                            }
                        }
                    }
                }
                let id_group = new Array();
                for (let t in contact) {
                    if (contact[t].name == PosFlag[i].iPos[k].name) {
                        continue;
                    }
                    id_group.push(contact[t].name);
                    PosFlag[i].iPos[k].closeContact.push({
                        pos: i,
                        peo: contact[i],
                        time: cnt
                    })
                }
                PosFlag[i].iPos[k].closeContactPie.push({
                    percent: [contact.length - initLen, initLen],
                    idgroup: id_group,
                    place: iplacetype[i],
                    time: cnt
                })
                continue;
            }
            let TouchNumPeople = Math.min(Touch[PosFlag[i].iPos[k].status], PosFlag[i].className[PosFlag[i].iPos[k].ClassNum].length);
            let contact = new Array();

            if (TouchNumPeople == PosFlag[i].className[PosFlag[i].iPos[k].ClassNum].length) {
                for (let j in PosFlag[i].className[PosFlag[i].iPos[k].ClassNum]) {
                    contact.push(PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j]);
                    if (PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].mark == 0) {
                        let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                        let get = [0, 1];
                        PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].mark += RandomPostion(get, In);
                        if (PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].mark == 1) {
                            PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].parent = PosFlag[i].iPos[k];
                            PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].infectPlace = i;
                            PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].InfectTime = cnt;
                            PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].passage = PosFlag[i].iPos[k].passage + 1;
                            PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].time = randomNum(1, 6) * 7 + 1;
                        }
                    }
                }
            } else {
                let id_mark = new Array();
                while (TouchNumPeople) {
                    let j = randomNum(0, PosFlag[i].className[PosFlag[i].iPos[k].ClassNum].length - 1);
                    if (id_mark == 1) {
                        continue;
                    } else {
                        TouchNumPeople--;
                        id_mark[j] = 1;
                    }
                    contact.push(PosFlag[i].people[j]);
                    if (PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].mark == 0) {
                        let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                        let get = [0, 1];
                        PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].mark += RandomPostion(get, In);
                        if (PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].mark == 1) {
                            PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].parent = PosFlag[i].iPos[k];
                            PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].infectPlace = i;
                            PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].InfectTime = cnt;
                            PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].passage = PosFlag[i].iPos[k].passage + 1;
                            PosFlag[i].className[PosFlag[i].iPos[k].ClassNum][j].time = randomNum(1, 6) * 7 + 1;
                        }
                    }
                }
            }

            let id_group = new Array();
            for (let t in contact) {
                if (contact[t].name == PosFlag[i].iPos[k].name) {
                    continue;
                }
                id_group.push(contact[t].name);
                PosFlag[i].iPos[k].closeContact.push({
                    pos: i,
                    peo: contact[i],
                    time: cnt
                })
            }
            PosFlag[i].iPos[k].closeContactPie.push({
                percent: [contact.length - initLen, initLen],
                idgroup: id_group,
                place: iplacetype[i],
                time: cnt
            })
        }
    } else {
        for (let k in PosFlag[i].ePos) {
            let TouchNumPeople = Math.min(Touch[PosFlag[i].ePos[k].status], PosFlag[i].people.length);
            let contact = new Array();
            let id_mark = new Array();
            if (TouchNumPeople == PosFlag[i].people.length) {
                for (let j in PosFlag[i].people) {
                    contact.push(PosFlag[i].people[j]);
                    if (PosFlag[i].people[j].mark == 0) {
                        let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                        let get = [0, 1];
                        PosFlag[i].people[j].mark += RandomPostion(get, In);
                        if (PosFlag[i].people[j].mark == 1) {
                            PosFlag[i].people[j].parent = PosFlag[i].ePos[k];
                            PosFlag[i].people[j].infectPlace = i;
                            PosFlag[i].people[j].InfectTime = cnt;
                            PosFlag[i].people[j].passage = PosFlag[i].ePos[k].passage + 1;
                            PosFlag[i].people[j].time = randomNum(1, 6) * 7 + 1;
                        }
                    }
                }
            } else {
                while (TouchNumPeople) {
                    let j = randomNum(0, PosFlag[i].people.length - 1);
                    if (id_mark == 1) {
                        continue;
                    } else {
                        TouchNumPeople--;
                        id_mark[j] = 1;
                    }
                    contact.push(PosFlag[i].people[j]);
                    if (PosFlag[i].people[j].mark == 0) {
                        let In = [1 - PosFlag[i].transition, PosFlag[i].transition];
                        let get = [0, 1];
                        PosFlag[i].people[j].mark += RandomPostion(get, In);
                        if (PosFlag[i].people[j].mark == 1) {
                            PosFlag[i].people[j].parent = PosFlag[i].ePos[k];
                            PosFlag[i].people[j].infectPlace = i;
                            PosFlag[i].people[j].InfectTime = cnt;
                            PosFlag[i].people[j].passage = PosFlag[i].ePos[k].passage + 1;
                            PosFlag[i].people[j].time = randomNum(1, 6) * 7 + 1;
                        }
                    }
                }
            }
            let id_group = new Array();
            for (let t in contact) {
                if (contact[t].name == PosFlag[i].ePos[k].name) {
                    continue;
                }
                id_group.push(contact[t].name);
                PosFlag[i].ePos[k].closeContact.push({
                    pos: i,
                    peo: contact[i],
                    time: cnt
                })
            }
            PosFlag[i].ePos[k].closeContactPie.push({
                percent: [contact.length - initLen, initLen],
                idgroup: id_group,
                place: iplacetype[i],
                time: cnt
            })
            continue;
        }
    }
}