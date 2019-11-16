import {
  wrongMove,
  switcher,
  badMoves,
  getCreateNode,
  getGetter,
  findEmptyBlock,
  Queue,
  initNode
} from './utils';

interface Props {
  puzzle: Puzzle;
  heuristic: Heuristic;
  search: searchStyle;
  solvedId: string;
  size: number;
}

interface Return {
  node: sNode;
  createdNodes: number;
  nbStudiedNodes: number;
  maxNumNodes: number;
}

export const astar = ({
  puzzle,
  heuristic,
  search,
  solvedId,
  size
}: Props): Return => {
  const createNode = getCreateNode[search](heuristic);

  const [x, y] = findEmptyBlock(puzzle);
  const startHeuristic = heuristic(puzzle);
  const firstNode = initNode(startHeuristic, puzzle, x, y);

  const toStudy = new Queue(firstNode, search);
  const studied: Set<string> = new Set();

  let createdNodes = 1;
  let allCurrentNodes = 1;
  let nbStudiedNodes = 0;
  let maxNumNodes = 1;

  // its true here because we know the puzzle we got from above is solvable
  while (true) {
    maxNumNodes = Math.max(allCurrentNodes, maxNumNodes);

    const currentNode = toStudy.pop();
    allCurrentNodes--;

    if (currentNode.id === solvedId) {
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
      const shouldNotMove = wrongMove[move](prevX, prevY, size);
      if (badMove || shouldNotMove) return;

      const newPuzzle = prevPuzzle.map(l => l.slice());
      const [newX, newY] = switcher[move](newPuzzle, prevX, prevY);
      const newNode = createNode(
        newPuzzle,
        newX,
        newY,
        prevPath,
        move,
        prevLevel
      );

      createdNodes++;
      allCurrentNodes++;

      toStudy.insert(newNode);
    });
  }
};

export const idastar = ({
  puzzle,
  heuristic,
  search,
  solvedId,
  size
}: Props): Return => {
  const getValue = getGetter[search];
  const createNode = getCreateNode[search](heuristic);
  const createNewNodes = getCreateNewNodes(createNode);

  const [x, y] = findEmptyBlock(puzzle);
  const startHeuristic = heuristic(puzzle);
  let parentNode = initNode(startHeuristic, puzzle, x, y);

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

      if (currentNode.id === solvedId) {
        return {
          node: currentNode,
          createdNodes,
          nbStudiedNodes,
          maxNumNodes
        };
      }

      studied[currentNode.id] = getValue(currentNode);

      const mapper = createNewNodes(currentNode);
      const { path, y, x } = currentNode;
      const lastMove: Move = path[path.length - 1];

      const filteredMoves = (['up', 'left', 'right', 'down'] as Move[]).filter(
        move => {
          const badMove = badMoves.has(`${lastMove}|${move}`);
          const shouldNotMove = wrongMove[move](x, y, size);
          return !(badMove || shouldNotMove);
        }
      );

      const threadedNodes = filteredMoves.map(mapper);

      createdNodes += threadedNodes.length;

      const newNodes = threadedNodes
        .map(newNode => {
          const value = getValue(newNode);

          if (value <= maxDepth) {
            return studied[newNode.id] && studied[newNode.id] <= value
              ? null
              : newNode;
          }

          nextMaxDepth = Math.min(nextMaxDepth, value);
          return null;
        })
        .filter(Boolean)
        .sort((a, b) => getValue(b) - getValue(a));

      toStudy.push(...newNodes);
    }
    maxDepth = nextMaxDepth;
  }
};

const getCreateNewNodes = (createNode: any) => (prevNode: sNode) => {
  const {
    path: prevPath,
    level: prevLevel,
    x: prevX,
    y: prevY,
    puzzle: prevPuzzle
  } = prevNode;
  return (move: Move) => {
    const newPuzzle = prevPuzzle.map(l => l.slice());
    const [newX, newY] = switcher[move](newPuzzle, prevX, prevY);
    return createNode(newPuzzle, newX, newY, prevPath, move, prevLevel);
  };
};
