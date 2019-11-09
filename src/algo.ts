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
  nbStudiedNodes: number;
  maxNumNodes: number;
}

export const astar = ({ puzzle, heuristic, search }: Props): Return => {
  const createNode = getCreateNode(heuristic);

  const getValue = getGetter[search];
  const [x, y] = findEmptyBlock(puzzle);
  const firstNode = createNode(puzzle, x, y, [], -1);

  const value = getValue(firstNode);
  const toStudy = { [value]: [firstNode] };
  const studied: Set<string> = new Set();

  let createdNodes = 1;
  let allCurrentNodes = 1;
  let nbStudiedNodes = 0;
  let maxNumNodes = 1;

	// its true here because we know the puzzle we got from above is solvable
  while (true) {

    const minValue = getMinFromPool(toStudy);
    const currentNode = toStudy[minValue].shift() as sNode;

    allCurrentNodes--;
    maxNumNodes = Math.max(allCurrentNodes, maxNumNodes);

    // if my heuristic is 0, i am done
    if (!currentNode.heuristic) {
      return {
        node: currentNode,
        createdNodes,
        nbStudiedNodes,
        maxNumNodes
      };
    }

    if (studied.has(currentNode.id)) continue;

    studied.add(currentNode.id);
    nbStudiedNodes++;

    const {
      path: prevPath,
      level: prevLevel,
      x: prevX,
      y: prevY,
      puzzle: prevPuzzle
    } = currentNode;

    const lastMove: Move = prevPath[prevPath.length - 1];

    (['up', 'left', 'right', 'down'] as Move[]).forEach(move => {
      const badMove = badMoves.has(`${lastMove}|${move}`);
      const shouldNotMove = wrongMove[move](prevX, prevY, config.size);
      if (badMove || shouldNotMove) return;

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

      createdNodes++;
      allCurrentNodes++;

      // value is either f(x), g(x) or h(x) depending on the search style (normal, uniform or greedy)
      const value = getValue(newNode);

      // if the pool is empty, create a new one, else, push the new created node to the pool
      if (!toStudy[value]) toStudy[value] = [newNode];
      else toStudy[value].push(newNode);

    });
  }
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
  let nbStudiedNodes = 0;
  let maxNumNodes = 1;

  while (true) {
    // when we are going back to this loop, the maxDepth will have the value of nextMaxDepth
    let nextMaxDepth: number = Infinity;
    const toStudy: sNode[] = [parentNode];
    const studied: { [id: string]: number } = {};

    while (toStudy.length) {
      // get the last node created and go as deep as we can
      const currentNode = toStudy.pop() as sNode;

      maxNumNodes = Math.max(toStudy.length, maxNumNodes);

      nbStudiedNodes += 1;

      // if my heuristic is 0 then we are done
      if (!currentNode.heuristic) {
        return {
          node: currentNode,
          createdNodes,
          nbStudiedNodes,
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

          createdNodes += 1;

          // we should study this node if its f(x) is less than the depth we are exploring
          const value = getValue(newNode);
          if (value <= maxDepth) {
            // if i already have studied this node and my new node has a f(x) higher than the previous one, we should not study this node
            if (studied[newNode.id] && studied[newNode.id] <= value)
              return null;
            return newNode;
          }
          // if we should not study this node, the next max depth should be the one with the smallest f(x)
          nextMaxDepth = Math.min(nextMaxDepth, value);
          return null;
        })
        .filter(Boolean) as sNode[]).sort((a, b) => getValue(b) - getValue(a));

      toStudy.push(...newNodes);
    }
    maxDepth = nextMaxDepth;
  }
};
