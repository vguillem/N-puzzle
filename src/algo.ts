import { wrongMove, switcher } from "./utils";

interface Props {
  puzzle: Puzzle;
  heuristic: Heuristic;
}

export const solve = ({ puzzle, heuristic }: Props) => {
  const createNode = getCreateNode(heuristic);

  const [x, y] = findEmptyBlock(puzzle);
  const firstNode = createNode(puzzle, x, y, [], -1);

	console.log('start heuristic: ', firstNode.heuristic);

  let nodes: sNode[] = [firstNode];
	const ids: Set<string> = new Set([firstNode.id]);

  while (nodes.length) {
    // sort the array by heuristic
    nodes = nodes.sort(
      (a, b) => (b.heuristic + b.level) - (a.heuristic + a.level)
    );

    // get the node with smallest heuristic
    const currentNode = nodes.pop() as sNode;

    // we are done
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
      const badMove = BAD_MOVE.has(`${lastMove}|${move}`);
      const shouldNotMove = wrongMove[move](prevX, prevY, puzzle.length);
      if (badMove || shouldNotMove) return;

      const newPuzzle = prevPuzzle.map(l => l.slice());
      const { newX, newY } = switcher[move](newPuzzle, prevX, prevY);
      const newNode = createNode(
        newPuzzle,
        newX,
        newY,
        prevPath,
        prevLevel,
        move
      );

      if (ids.has(newNode.id)) return;

      nodes.push(newNode);
			ids.add(newNode.id);
    });
  }

  throw new Error("this puzzle cannot be solved");
};

const BAD_MOVE = new Set([
  "left|right",
  "right|left",
  "up|down",
  "down|up"
]);

const getCreateNode = (heuristic: Heuristic) => (
  puzzle: Puzzle,
  x: number,
  y: number,
  prevPath: Move[],
  prevLevel: number,
  move?: Move
): sNode => {
  const h = heuristic(puzzle);
  const newPath = prevPath.slice();
  const newLevel = prevLevel + 1;
  if (move) newPath.push(move);
  return {
    id: puzzle.map(d => d.join('')).join(''),
    heuristic: h,
    path: newPath,
    level: newLevel,
    puzzle,
    x,
    y
  };
};

const findEmptyBlock = (puzzle: Puzzle) => {
  for (let y = 0; y < puzzle.length; y++) {
    const x = puzzle[y].indexOf(0);
    if (x !== -1) {
      return [x, y];
    }
  }
  return [];
};
