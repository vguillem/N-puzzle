import {
  wrongMove,
  switcher,
  getMinFromPool,
  badMoves,
  getCreateNode,
  findEmptyBlock
} from './utils';

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

  const getKey = getGetter[search];
  const [x, y] = findEmptyBlock(puzzle);
  const firstNode = createNode(puzzle, x, y, [], -1);

  let createdNodes = 1;
  const pool = { [getKey(firstNode)]: [firstNode] };
  const visited: { [id in string]: number } = { [firstNode.id]: 1 };

  let numNodes = 1;
  let maxNumNodes = 1;

  while (Object.keys(pool).length) {
    const minValue = getMinFromPool(pool);
    const currentNode = pool[minValue].pop() as sNode;

    if (!pool[minValue].length) delete pool[minValue];
    numNodes -= 1;
    maxNumNodes = Math.max(numNodes, maxNumNodes);

    if (currentNode.heuristic === 0) {
      return {
        node: currentNode,
        createdNodes,
        numNodes,
        maxNumNodes
      };
    }

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
      const shouldNotMove = wrongMove[move](prevX, prevY, puzzle.length);
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

      if (visited[newNode.id]) return;

      const key = getKey(newNode);
      if (!pool[key]) pool[key] = [newNode];
      else pool[key].push(newNode);

      numNodes += 1;
      visited[newNode.id] = 1;
    });
  }

  throw new Error('this puzzle cannot be solved');
};

const getGetter = {
  greedy: (node: sNode) => node.heuristic,
  uniform: (node: sNode) => node.total
};

export const idastar = ({ puzzle, heuristic }: Props): Return => {
  const createNode = getCreateNode(heuristic);

  const [x, y] = findEmptyBlock(puzzle);
  let parentNode = createNode(puzzle, x, y, [], -1);
  let maxDepth = parentNode.heuristic + 1;
  let createdNodes = 1;
  let numNodes = 1;
  let maxNumNodes = 1;
  while (true) {
    let nextMaxDepth: number = Infinity;
    const nodes: sNode[] = [parentNode];
    const visited: { [id in string]: number } = { [parentNode.id]: 1 };
    while (nodes.length) {
      const currentNode = nodes.pop() as sNode;
      numNodes -= 1;
      maxNumNodes = Math.max(numNodes, maxNumNodes);

      if (currentNode.heuristic === 0) {
        return {
          node: currentNode,
          createdNodes,
          numNodes,
          maxNumNodes
        };
      }

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
        const shouldNotMove = wrongMove[move](prevX, prevY, puzzle.length);
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
        createdNodes += 1;
        if (visited[newNode.id]) return;
        if (newNode.total < maxDepth) {
          nodes.push(newNode);
          visited[newNode.id] = 1;
          numNodes += 1;
        } else nextMaxDepth = Math.min(nextMaxDepth, newNode.total);
      });
    }
    maxDepth = nextMaxDepth + 1;
  }
};
