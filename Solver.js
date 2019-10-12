const {
    finalState,
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
        this.length = initialState[0].length;
        this.lengthC = initialState[0].length * initialState[0].length;
        this.node = {};
        this.finalState = finalState(initialState[0].length);
        this.initialState = initialState;
        this.nbTry = 0;
        this.end = false;
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
            this.solver()
        }
        console.log('time: ', Math.floor((Date.now() - start)))
        //this.solver(nodeName);
    }

    getSmallNode() {
        return Object.keys(this.node).reduce((acc, name) => {
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
    }

    solver() {
        const nodeName = this.getSmallNode();
//console.log('start recu')
        if (this.isInGoalPosition(nodeName, this.finalState, this.length)) {
            this.end = true;
            console.log('GoalPosition', this.node[nodeName], this.nbTry);
            return;
        }

        const lastChar = this.node[nodeName].a.substr(this.node[nodeName].length - 1);
        ['t', 'b', 'r', 'l'].reduce((acc, a) => {
            if (badPatern.indexOf(`${lastChar}${a}`) === -1){
                acc.push(a);
            }
            return acc;
        }, []).forEach(action => {

            const newNode = this.switchElement(nodeName, action, this.length);

            if (newNode) {
                const newNodeName = newNode.join(',')
                const h = this.manhattan(newNode);
                //const h = this.nbInGoodPosition(newNodeName);
                if (!this.node[newNodeName] || (this.node[newNodeName].f + this.node[newNodeName].h) > (this.node[nodeName].f + 1 + h)) {
                    //console.log('add', newNodeName, h)
                    const {f, a} = this.node[nodeName];
                    this.node[newNodeName] = {f: f + 1, h, a: `${a}${action}`, array: newNode}
                }
            }

        });
        //console.log('end recu', Object.keys(this.node).length, process.memoryUsage())
        this.node[nodeName].d = true;
        this.nbTry += 1;
    }

    switchElement(oldName, action){
        let liste = [...this.node[oldName].array]

        let zeroPosition = liste.indexOf(0);
        let newPosition = zeroPosition;

        switch (action) {
            case 't': {
                newPosition -= this.length;
                if (newPosition < 0) {
                    return false;
                }
                break;
            }
            case 'b': {//
                newPosition += this.length;
                if (newPosition > (this.lengthC - 1)) {
                    return false;
                }
                break;
            }
            case 'r': {
                newPosition += 1;
                if (zeroPosition % this.length === this.length - 1) {
                    return false;
                }
                break;
            }
            case 'l': {//
                newPosition -= 1;
                if (zeroPosition % this.length === 0) {
                    return false;
                }
                break;
            }

        }
        liste[zeroPosition] = liste[newPosition];
        liste[newPosition] = 0;
        return liste
    };

    manhattan(actuaNode){
        let distance = 0;

        actuaNode.forEach((g, index) => {
            const l = Math.floor(index / this.length);
            const c = index % this.length;
            distance += (Math.abs(l - this.finalState[g].l) + Math.abs(c - this.finalState[g].c))
        });
        return distance + this.linearConflict(actuaNode);
    };

    linearConflict(actuaNode){
        let distance = 0;

        for (let i = 0; i < this.length; i++) {
            let raw = actuaNode.slice(i * this.length, i * this.length + this.length);
            let column = actuaNode.filter((g, index) => index % this.length === i);
            const potentialConflit = raw.reduce((acc, p) =>{
                if(this.finalState[p].l === i) {
                    acc.push(p)
                }
                return acc;
            }, []);
            potentialConflit.reduce((acc, p, index) => {
                for (let j = index; j < this.length; j++) {
                    if ()
                }
            }, 0)
console.log(raw, column, conflit)
        }

        return distance;
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

    isInGoalPosition(actualState){
        //console.log(actualState)
        return !this.node[actualState].array.some((g, index) => {
            const check = this.finalState[g];
            const l = Math.floor(index / this.length);
            const c = index % this.length;
            // console.log(g, c, l, check.c, check.l)
            return check.c !== c || check.l !== l;
        })
    };
};