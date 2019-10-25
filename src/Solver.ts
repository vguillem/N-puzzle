import { getFinalState } from "./utils";

interface Node {
  f: number;
  a: string;
  h: number;
  array: number[];
  name: string;
  d: boolean;
}

interface Piece {
  column: number;
  line: number;
}

type Puzzle = number[][];

type Action = "t" | "b" | "r" | "l";

const badPattern = new Set(["tb", "bt", "rl", "lr"]);

export class Solver {
  length: number = 0;
  lengthC: number = 0;
  nbTry: number = 0;
  maxS: number = 0;
  nextS: number = 0;
  end: boolean = false;
  node: { [name: string]: Node } = {};
  idNode: Node[] = [];
  finalState: Piece[] = [];
  finalStateName: string = "";
  initialState: Puzzle = [];
  actualNode: Node = {} as Node;

  constructor(initialState: number[][]) {
    const { finalState, name } = getFinalState(initialState[0].length);
    this.length = initialState[0].length;
    this.lengthC = initialState[0].length * initialState[0].length;
    this.finalState = finalState;
    this.finalStateName = name;
    this.initialState = initialState;
  }

  solve() {
    const node = this.initialState.flat();
    const nodeName = node.join(",");
    this.node[nodeName] = {
      f: 0,
      a: "",
      h: 0,
      array: node,
      name: nodeName,
      d: false
    };
    let start = Date.now();

    while (!this.end) {
      this.idNode.push({
        f: 0,
        a: "",
        h: 0,
        array: node,
        name: nodeName,
        d: false
      });
      this.idAStar();
      //this.aStar()
    }
    console.log("time: ", Math.floor(Date.now() - start));
  }

  getSmallNode() {
    const newNodeName = Object.keys(this.node).reduce((acc, name) => {
      if (this.node[name].d) return acc;
      if (
        !acc ||
        this.node[name].f + this.node[name].h <
          this.node[acc].f + this.node[acc].h
      ) {
        return name;
      }
      return acc;
    }, "");
    this.actualNode = { ...this.node[newNodeName], name: newNodeName };
  }

  idAStar() {
    while (this.idNode.length && !this.end) this.idAStarRecursive();
    this.maxS = this.nextS;
    this.nextS = 0;
  }

  idAStarRecursive() {
    this.actualNode = this.idNode.pop() as Node;
    const { f, a } = this.actualNode;
    if (this.isInGoalPosition()) {
      this.end = true;
      console.log("GoalPosition", this.actualNode, this.nbTry);
      return;
    }

    const lastChar = this.actualNode.a.substring(this.actualNode.a.length - 1);
    const actions = ["t", "b", "r", "l"] as Action[];
    actions
      .filter(d => !badPattern.has(`${lastChar}${d}`))
      .reduce<Node[]>((acc, action) => {
        const newNode = this.switchElement(action);

        if (!newNode) return acc;

        const newNodeName = newNode.join(",");

        const h = this.manhattan(newNode);
        const s = f + 1 + h;
        if (s <= this.maxS) {
          acc.push({
            f: f + 1,
            h,
            a: `${a}${action}`,
            array: newNode,
            name: newNodeName,
            d: false
          });
        } else if (!this.nextS || s < this.nextS) {
          this.nextS = s;
        }

        return acc;
      }, [])
      .sort((e, oe) => e.h - oe.h)
      .forEach(actual => this.idNode.push(actual));
    //console.log('end recu', Object.keys(this.node).length, process.memoryUsage())
    this.nbTry += 1;
  }

  aStar() {
    this.getSmallNode();
    //console.log('start recu')
    if (this.isInGoalPosition()) {
      this.end = true;
      console.log("GoalPosition", this.actualNode, this.nbTry);
      return;
    }
    const { f, a } = this.actualNode as Node;
    const lastChar = a.substring(a.length - 1);
    const actions = ["t", "b", "r", "l"] as Action[];
    actions
      .filter(d => !badPattern.has(`${lastChar}${d}`))
      .forEach(action => {
        const newNode = this.switchElement(action);

        if (newNode) {
          const newNodeName = newNode.join(",");
          const h = this.manhattan(newNode);
          if (
            !this.node[newNodeName] ||
            this.node[newNodeName].f + this.node[newNodeName].h > f + 1 + h
          ) {
            this.node[newNodeName] = {
              f: f + 1,
              h,
              a: `${a}${action}`,
              array: newNode,
              name: newNodeName,
              d: false
            };
          }
        }
      });
    //console.log('end recu', Object.keys(this.node).length, process.memoryUsage())
    this.node[this.actualNode.name].d = true;
    this.nbTry += 1;
  }

  switchElement(action: Action) {
    let liste = [...this.actualNode.array];

    let zeroPosition = liste.indexOf(0);
    let newPosition = zeroPosition;

    const allAction: { [id: string]: () => boolean } = {
      t: () => {
        newPosition -= this.length;
        return newPosition < 0;
      },
      b: () => {
        newPosition += this.length;
        return newPosition > this.lengthC - 1;
      },
      r: () => {
        newPosition += 1;
        return zeroPosition % this.length === this.length - 1;
      },
      l: () => {
        newPosition -= 1;
        return zeroPosition % this.length === 0;
      }
    };

    if (allAction[action]()) return false;

    liste[zeroPosition] = liste[newPosition];
    liste[newPosition] = 0;
    return liste;
  }

  manhattan(actualNode: number[]) {
    let distance = 0;

    actualNode.forEach((g, index) => {
      const l = Math.floor(index / this.length);
      const c = index % this.length;
      if (g === 0) distance = 0;
      else {
        distance =
          Math.abs(l - this.finalState[g].line) +
          Math.abs(c - this.finalState[g].column);
      }
    });
    const lc = this.linearConflict(actualNode);
    return distance + lc;
  }

  linearConflict(actualNode: number[]) {
    let conflict = 0;
    let last = 0;

    for (let i = 0; i < this.length; i++) {
      let raw = actualNode.slice(
        i * this.length,
        i * this.length + this.length
      );
      let column = actualNode.filter((_, index) => index % this.length === i);
      const potentialRConflit = raw.reduce<number[]>((acc, p) => {
        if (p !== 0 && this.finalState[p].line === i)
          acc.push(this.finalState[p].column);
        return acc;
      }, []);
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
      const potentialCConflit = column.reduce<number[]>((acc, p) => {
        if (p !== 0 && this.finalState[p].column === i) {
          acc.push(this.finalState[p].line);
        }
        return acc;
      }, []);
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
      });
    }

    return conflict * 2;
  }

  isInGoalPosition() {
    return this.finalStateName === this.actualNode.name;
  }
}
