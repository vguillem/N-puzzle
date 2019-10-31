import {
  wrongMove,
  switcher,
  badMoves,
  getCreateNode,
  findEmptyBlock
} from "./utils";

interface Props {
  puzzle: Puzzle;
  heuristic: Heuristic;
}

export const solve = ({ puzzle, heuristic }: Props) => {
  const createNode = getCreateNode(heuristic);

  const [x, y] = findEmptyBlock(puzzle);
  const firstNode = createNode(puzzle, x, y, [], -1);

  let nodes: sNode[] = [firstNode];
  const ids: { [id in string]: number } = { [firstNode.id]: 1 };

  while (nodes.length) {
    // sorting by heuristic does a greedy search, its usually more efficient
    // but the path is not guaranteed to be the shortest
    // do b.total - a.total to search for the smallest path
    nodes = nodes.sort((a, b) => b.total - a.total);

    // get the node with the smallest heuristic
    const currentNode = nodes.pop() as sNode;

    // we are done in this case if the heuristic is 'admissible'
    if (currentNode.heuristic === 0) return currentNode;

    const {
      path: prevPath,
      level: prevLevel,
      x: prevX,
      y: prevY,
      puzzle: prevPuzzle
    } = currentNode;

    const lastMove: Move = prevPath[prevPath.length - 1];

    (["up", "left", "right", "down"] as Move[]).forEach(move => {
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

      if (ids[newNode.id]) return;

      nodes.push(newNode);
      ids[newNode.id] = 1;
    });
  }

  throw new Error("this puzzle cannot be solved");
};
