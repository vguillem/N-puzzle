const {
    getFinalState,
    isSolvable,
    getList,
} = require('./utils');

const badPatern = [
  'tb',
  'bt',
  'rl',
  'lr',
];

module.exports = class Solver {

    constructor(initialState) {
        const {finalState, name} = getFinalState(initialState[0].length);
        this.length = initialState[0].length;
        this.lengthC = initialState[0].length * initialState[0].length;
        this.node = {};
        this.idNode = [];
        this.finalState = finalState;
        this.finalStateName = name;
        this.initialState = initialState;
        this.nbTry = 0;
        this.end = false;
        this.actualNode = {};
        this.maxS = 0;
        this.nextS = 0;
        this.done = {};
    }

    checkIsSolvable() {
        return isSolvable(this.initialState, this.length);
    }

    solve() {
        //console.log('start')
        const node = getList(this.initialState);
        const nodeName = node.join(',');
        this.node[nodeName] = {f: 0, a: '', h: 0, array: node};
        let start = Date.now();

        while (!this.end) {

            this.idNode.push({f: 0, a: '', h: 0, array: node, name: nodeName});
            this.idAStar()
            //this.aStar()
        }
        console.log('time: ', Math.floor((Date.now() - start)))
        //this.aStar(nodeName);
    }

    getSmallNode() {
        const newNodeName = Object.keys(this.node).reduce((acc, name) => {
            if (this.node[name].d) {
                return acc;
            }
            if (!acc) {
                acc = name;
            } else {
                if ((this.node[name].f + this.node[name].h) < (this.node[acc].f + this.node[acc].h)) {
                    acc = name;
                }
            }
            return acc;
        }, '');

        this.actualNode = {...this.node[newNodeName], name: newNodeName};
    }

    idAStar() {

        while(this.idNode.length && !this.end) {
            this.idAStarRecursive();
        }
        //console.log(this.nextS)
        //this.done = {};
        this.maxS = this.nextS;
        this.nextS = 0;

    }

    idAStarRecursive() {
        this.actualNode = this.idNode.pop();
        //this.done[this.actualNode.name] = true;
        const {f, a} = this.actualNode;
//console.log('start recu')
        if (this.isInGoalPosition()) {
            this.end = true;
            console.log('GoalPosition', this.actualNode, this.nbTry);
            return;
        }

        const lastChar = this.actualNode.a.substring(this.actualNode.a.length - 1);
        ['t', 'b', 'r', 'l'].reduce((acc, a) => {
            if (badPatern.indexOf(`${lastChar}${a}`) === -1){
                acc.push(a);
            }
            return acc;
        }, []).reduce((acc, action) => {

            const newNode = this.switchElement(action);

            if (!newNode) {
                return acc;
            }

            const newNodeName = newNode.join(',');

            // if (this.done[newNodeName]) {
            //     return acc;
            // }

            const h = this.manhattan(newNode);
            //const h = this.nbInGoodPosition(newNodeName);
            //console.log('add', newNodeName, h)
            const s = f + 1 + h;
            //console.log('s', s, this.maxS, this.nextS)
            if (s <= this.maxS ) {

                acc.push({f: f + 1, h, a: `${a}${action}`, array: newNode, name: newNodeName});
            } else if (!this.nextS || s < this.nextS) {
                this.nextS = s;
            }


            return acc;

        }, []).sort((e, oe) => {
            return e.h -  oe.h;
        }).forEach((actual) => {
            this.idNode.push(actual);
        });
        //console.log('end recu', Object.keys(this.node).length, process.memoryUsage())
        this.nbTry += 1;
    }

    aStar() {
        this.getSmallNode();
//console.log('start recu')
        if (this.isInGoalPosition()) {
            this.end = true;
            console.log('GoalPosition', this.actualNode, this.nbTry);
            return;
        }
        const {f, a} = this.actualNode;
        const lastChar = a.substring(a.length - 1);
        ['t', 'b', 'r', 'l'].reduce((acc, a) => {
            if (badPatern.indexOf(`${lastChar}${a}`) === -1){
                acc.push(a);
            }
            return acc;
        }, []).forEach(action => {

            const newNode = this.switchElement(action);

            if (newNode) {
                const newNodeName = newNode.join(',')
                const h = this.manhattan(newNode);
                //const h = this.nbInGoodPosition(newNodeName);
                if (!this.node[newNodeName] || (this.node[newNodeName].f + this.node[newNodeName].h) > (f + 1 + h)) {
                    //console.log('add', newNodeName, h)

                    this.node[newNodeName] = {f: f + 1, h, a: `${a}${action}`, array: newNode}
                }
            }

        });
        //console.log('end recu', Object.keys(this.node).length, process.memoryUsage())
        this.node[this.actualNode.name].d = true;
        this.nbTry += 1;
    }

    switchElement(action){
        let liste = [...this.actualNode.array]

        let zeroPosition = liste.indexOf(0);
        let newPosition = zeroPosition;

        const allAction = {
            t: () => {
                newPosition -= this.length;
                return newPosition < 0
            },
            b: () => {
                newPosition += this.length;
                return newPosition > (this.lengthC - 1)
            },
            r: () => {
                newPosition += 1;
                return zeroPosition % this.length === this.length - 1
            },
            l: () => {
                newPosition -= 1;
                return zeroPosition % this.length === 0
            }
        };

        if (allAction[action]()) {
            return false;
        }

        liste[zeroPosition] = liste[newPosition];
        liste[newPosition] = 0;
        return liste
    };

    manhattan(actualNode){
        let distance = 0;

        actualNode.forEach((g, index) => {
            const l = Math.floor(index / this.length);
            const c = index % this.length;
            distance += g === 0 ? 0 : (Math.abs(l - this.finalState[g].l) + Math.abs(c - this.finalState[g].c))
        });
        const lc = this.linearConflict(actualNode);
        //console.log(actualNode, distance, lc)
        return distance + lc;
    };

    linearConflict(actualNode){
        let conflict = 0;
        let last = 0;

        for (let i = 0; i < this.length; i++) {
            let raw = actualNode.slice(i * this.length, i * this.length + this.length);
            let column = actualNode.filter((g, index) => index % this.length === i);
            const potentialRConflit = raw.reduce((acc, p, actualIndex) =>{
                if(p !== 0 && this.finalState[p].l === i) {
                    acc.push(this.finalState[p].c);
                }
                return acc;
            }, []);
            //console.log(raw, potentialRConflit)
            potentialRConflit.forEach((p, index) => {

                let actualConflit = 0;
                for (let j = index; j < potentialRConflit.length; j++) {
                    if (p < potentialRConflit[j]) {
                        actualConflit += 1;
                    }
                }
                if (actualConflit && actualConflit !== last) {
                    conflict += 1;
                }
                last = actualConflit;
            });
            last = 0;
            const potentialCConflit = column.reduce((acc, p, actualIndex) =>{
                if(p !== 0 && this.finalState[p].c === i) {
                    acc.push(this.finalState[p].l)
                }
                return acc;
            }, [])
            potentialCConflit.forEach((p, index) => {
                let actualConflit = 0;
                for (let j = index; j < potentialRConflit.length; j++) {
                    if (p < potentialRConflit[j]) {
                        actualConflit += 1;
                    }
                }
                if (actualConflit && actualConflit !== last) {
                    conflict += 1;
                }
                last = actualConflit;
            })
        }

        return conflict * 2;
    }

    // nbInGoodPosition(actualState){
    //     let inGoodPosition = 0;
    //     !this.node[actualState].array.forEach((g, index) => {
    //         const check = this.finalState[g];
    //         const l = Math.floor(index / this.length);
    //         const c = index % this.length;
    //         if(check.c === c && check.l === l){
    //             inGoodPosition += 1;
    //         }
    //     });
    //     return (this.lengthC) - inGoodPosition;
    // };

    isInGoalPosition(){
        //console.log(actualState)
        // return !this.actualNode.array.some((g, index) => {
        //     const check = this.finalState[g];
        //     const l = Math.floor(index / this.length);
        //     const c = index % this.length;
        //     // console.log(g, c, l, check.c, check.l)
        //     return check.c !== c || check.l !== l;
        // })
        //return this.actualNode.array.every((e, index) => e === this.finalStateName[index])
        return this.finalStateName === this.actualNode.name;
    };
};