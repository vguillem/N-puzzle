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

    constructor(length, initialState) {
        this.length = length;
        this.lengthC = length * length;
        this.node = {};
        this.finalState = finalState(length);
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
        this.node[nodeName] = {f: 0, a: ''};
        let start = Date.now();

        while (!this.end) {
            this.solver(this.getSmallNode())
        }
        console.log('time: ', Math.floor((Date.now() - start)/1000))
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
                if (this.node[name].f < this.node[acc].f) {
                    acc = name;
                }
            }
            return acc;
        }, '');
    }

    solver(nodeName) {
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
            // if (!badPatern.indexOf(`${this.node[nodeName].a}${action}`)) {
            //     return;
            // }
            const newNodeName = this.switchElement(nodeName, action, this.length);

            if (newNodeName) {
                const h = this.manhattan(newNodeName);
                //const h = this.nbInGoodPosition(newNodeName);
                if (!this.node[newNodeName] || this.node[newNodeName].f > this.node[nodeName].f + h) {
                    //console.log('add', newNodeName, h)
                    const {f, a} = this.node[nodeName];
                    this.node[newNodeName] = {f: f + h, a: `${a}${action}`}
                }
            }

        });
        //console.log('end recu', Object.keys(this.node).length, process.memoryUsage())
        this.node[nodeName].d = true;
        this.nbTry += 1;
    }

    switchElement(oldName, action){
        let liste = oldName.split(',');

        let zeroPosition = liste.indexOf('0');

        switch (action) {
            case 't': {
                let newPosition = zeroPosition - this.length;
                if (newPosition < 0) {
                    return false;
                }
                liste[zeroPosition] = liste[newPosition];
                liste[newPosition] = 0;
                return liste.join(',');
            }
            case 'b': {//
                let newPosition = zeroPosition + this.length;
                if (newPosition > (this.lengthC - 1)) {
                    return false;
                }
                liste[zeroPosition] = liste[newPosition];
                liste[newPosition] = 0;
                return liste.join(',');
            }
            case 'r': {
                let newPosition = zeroPosition + 1;
                if (zeroPosition % this.length === this.length - 1) {
                    return false;
                }
                liste[zeroPosition] = liste[newPosition];
                liste[newPosition] = 0;
                return liste.join(',');
            }
            case 'l': {//
                let newPosition = zeroPosition - 1;
                if (zeroPosition % this.length === 0) {
                    return false;
                }
                liste[zeroPosition] = liste[newPosition];
                liste[newPosition] = 0;
                return liste.join(',');
            }

        }
    };

    manhattan(actualState){
        let distance = 0;
        actualState.split(',').forEach((g, index) => {
            const l = Math.floor(index / this.length);
            const c = index % this.length;
            distance += (Math.abs(l - this.finalState[g].l) + Math.abs(c - this.finalState[g].c))
        });
        return distance + this.linearConflict(actualState);
    };

    linearConflict(actualState){
        let distance = 0;
        actualState.split(',').forEach((g, index) => {
            const l = Math.floor(index / this.length);
            const c = index % this.length;
            distance += (Math.abs(l - this.finalState[g].l) + Math.abs(c - this.finalState[g].c))
        });
        return distance;
    }

    nbInGoodPosition(actualState){
        let inGoodPosition = 0;
        !actualState.split(',').forEach((g, index) => {
            const check = this.finalState[g];
            const l = Math.floor(index / this.length);
            const c = index % this.length;
            if(check.c === c && check.l === l){
                inGoodPosition += 1;
            }
        });
        return (this.lengthC) - inGoodPosition;
    };

    isInGoalPosition(actualState){
        //console.log(actualState)
        return !actualState.split(',').some((g, index) => {
            const check = this.finalState[g];
            const l = Math.floor(index / this.length);
            const c = index % this.length;
            // console.log(g, c, l, check.c, check.l)
            return check.c !== c || check.l !== l;
        })
    };
    // algo(noeudRacine, h) {
    //     2 : fringe.ajouter(noeudRacine) // Ajouter le noeud racine à la fringe
    //     3 : while !empty(fringe) do
    //         4 : node ← fringe.retirer(min, f) // Le noeud retirer est celui ayant le plus petit f(n)
    //     5 : if isGoal(state(node)) then
    //     6 : return node
    //     7 : end if
    //         8 : if node not in closedList then
    //     9 : closedList ← node
    //     10 : fringe.ajouter(successeurs(node)) // Ajouter les successeurs du noeud à la fringe
    //     11 : end if
    //         12 : end while
    //
    //
    //     13 : return None
    //     14 : end function
    //     15 : function f(node, h)
    //     16 : // Calculer f à partir de l’heuristique h et du coût du chemin pathCost
    //     17 : f ← pathCost(node) + h(node)
    //     18 : return f
    //     19 : end function
    // }
    //
    // manhattan() {
    //    const state = []
    //    const liste = getList(state);
    //     const n = this.length;
    //     let h = 0
    //     for (let i = 0; i < n; i++) {
    //         if (liste[i] !== 0 && !isAtGoalPosition(liste[i])) {
    //             10 : addrInGoal ← address of liste[i] in goal
    //             11 : h ← h + (abs((i DIV n - addrInGoal DIV n))
    //             12 : + abs((i % n - addrInGoal % n)))
    //         }
    //
    //     }
    //
    //
    //         return h
    // }
};