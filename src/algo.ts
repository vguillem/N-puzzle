import {
  wrongMove,
  switcher,
  getMinFromPool,
  badMoves,
  getCreateNode,
  findEmptyBlock
} from './utils';
import { config } from './config';

interface Props {
  puzzle: Puzzle;
  heuristic: Heuristic;
  search: searchStyle;
}

interface Return {
  node: sNode;
  createdNodes: number;
  numNodes: number;
  maxNumNodes: number;
}

export const astar = ({ puzzle, heuristic, search }: Props): Return => {
  const createNode = getCreateNode(heuristic);

  const getValue = getGetter[search];
  const [x, y] = findEmptyBlock(puzzle);
  const firstNode = createNode(puzzle, x, y, [], -1);

  const value = getValue(firstNode);
  // toStudy is a pool of node organized by value, which makes the sorting faster
  // as we dont have to sort a whole array but only chunks of it
  const toStudy = { [value]: [firstNode] };
  // we havent studied anything yet
  const studied: { [id in string]: number } = {};

  // data
  let createdNodes = 1;
  let allCurrentNodes = 1;
  let numNodes = 0;
  let maxNumNodes = 1;

  while (Object.keys(toStudy).length) {
    // we get the smallest value node
    const minValue = getMinFromPool(toStudy);
    const currentNode = toStudy[minValue]
      // i'm not sure about this sort, TODO: discuss this with mr Vianney
      .sort((a, b) => a.level - b.level)
      .pop() as sNode;

    // as its an object, we must delete the key when its pool of node is empty
    if (!toStudy[minValue].length) delete toStudy[minValue];

    // some data stuff, TODO: rename these its not clear what those represent
    allCurrentNodes -= 1;
    maxNumNodes = Math.max(allCurrentNodes, maxNumNodes);
    numNodes++;

    // if my heuristic is 0, i am done
    // TODO: in case we want to make this more reliable (not based on the heuristic), check that its id matches the solved id
    if (!currentNode.heuristic) {
      return {
        node: currentNode,
        createdNodes,
        numNodes,
        maxNumNodes
      };
    }

    // add the value of the node to the studied pool, as the node has been studied here
    const value = getValue(currentNode);
    studied[currentNode.id] = value;

    const {
      path: prevPath,
      level: prevLevel,
      x: prevX,
      y: prevY,
      puzzle: prevPuzzle
    } = currentNode;

    const lastMove: Move = prevPath[prevPath.length - 1];

    (['up', 'left', 'right', 'down'] as Move[]).forEach(move => {
      // dont move where it shouldnt
      const badMove = badMoves.has(`${lastMove}|${move}`);
      const shouldNotMove = wrongMove[move](prevX, prevY, config.size);
      if (badMove || shouldNotMove) return;

      // create the new node
      const newPuzzle = prevPuzzle.map(l => l.slice());
      const [newX, newY] = switcher[move](newPuzzle, prevX, prevY);
      const newNode = createNode(
        newPuzzle,
        newX,
        newY,
        prevPath,
        prevLevel,
        move
      );

      // TODO: rename ?
      createdNodes++;

      // value is either f(x), g(x) or h(x) depending on the search style (normal, uniform or greedy)
      const value = getValue(newNode);

      // if node has already been studied and its value is less than the new node value, do not study the node
      if (studied[newNode.id] && studied[newNode.id] < value) return;

      // if the pool is empty, create a new one, else, push the new created node to the pool
      if (!toStudy[value]) toStudy[value] = [newNode];
      else toStudy[value].push(newNode);

      allCurrentNodes += 1;
    });
  }
  throw new Error('this puzzle cannot be solved');
};

const getGetter = {
  normal: (node: sNode) => node.total,
  greedy: (node: sNode) => node.heuristic,
  uniform: (node: sNode) => node.level
};

export const idastar = ({ puzzle, heuristic, search }: Props): Return => {
  const createNode = getCreateNode(heuristic);

  const [x, y] = findEmptyBlock(puzzle);
  let parentNode = createNode(puzzle, x, y, [], -1);
	const getValue = getGetter[search];

let maxDepth = getValue(parentNode);

  // data
  let createdNodes = 1;
  let numNodes = 0;
  let allCurrentNodes = 1;
  let maxNumNodes = 1;

  while (true) {
    // when we are going back to this loop, the maxDepth will have the value of nextMaxDepth
    let nextMaxDepth: number = Infinity;
    const toStudy: sNode[] = [parentNode];
    const studied: { [id: string]: number } = {};

    while (toStudy.length) {
      // get the last node created and go as deep as we can
      const currentNode = toStudy.pop() as sNode;

      // data stuff
      allCurrentNodes -= 1;
      numNodes += 1;
      maxNumNodes = Math.max(allCurrentNodes, maxNumNodes);

      // if my heuristic is 0 then we are done
      if (!currentNode.heuristic) {
        return {
          node: currentNode,
          createdNodes,
          numNodes,
          maxNumNodes
        };
      }

      // we put the current node inside the studied pool
      studied[currentNode.id] = getValue(currentNode);


      const {
        path: prevPath,
        level: prevLevel,
        x: prevX,
        y: prevY,
        puzzle: prevPuzzle
      } = currentNode;

      const lastMove: Move = prevPath[prevPath.length - 1];

      const newNodes = ((['up', 'left', 'right', 'down'] as Move[])
        .map(move => {
          // do not create useless nodes
          const badMove = badMoves.has(`${lastMove}|${move}`);
          const shouldNotMove = wrongMove[move](prevX, prevY, config.size);
          if (badMove || shouldNotMove) return null;

          // create the new node
          const newPuzzle = prevPuzzle.map(l => l.slice());
          const [newX, newY] = switcher[move](newPuzzle, prevX, prevY);
          const newNode = createNode(
            newPuzzle,
            newX,
            newY,
            prevPath,
            prevLevel,
            move
          );

          // TODO: renaming ?
          createdNodes += 1;

          // we should study this node if its f(x) is less than the depth we are exploring
					const value = getValue(newNode);
          if (value <= maxDepth) {
            // if i already have studied this node and my new node has a f(x) higher than the previous one, we should not study this node
            if (studied[newNode.id] && studied[newNode.id] < value)
              return null;
            return newNode;
          }
          // if we should not study this node, the next max depth should be the one with the smallest f(x)
          nextMaxDepth = Math.min(nextMaxDepth, value);
          return null;
        })
        .filter(Boolean) as sNode[]).sort((a, b) => getValue(b) - getValue(a));

      toStudy.push(...newNodes);
      allCurrentNodes += newNodes.length;
    }
    maxDepth = nextMaxDepth;
  }
};
