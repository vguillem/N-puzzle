import {
	wrongMove,
	switcher,
	getMinFromPool,
	badMoves,
	getCreateNode,
	findEmptyBlock
} from "./utils";

interface Props {
	puzzle: Puzzle;
	heuristic: Heuristic;
	search: 'greedy' | 'shortest';
}

export const solve = ({puzzle, heuristic, search}: Props) => {
	const createNode = getCreateNode(heuristic);

	const getKey = getGetter[search];
	const [x, y] = findEmptyBlock(puzzle);
	const firstNode = createNode(puzzle, x, y, [], -1);

	const pool = {[getKey(firstNode)]: [firstNode]};
	const ids: {[id in string]: number} = {[firstNode.id]: 1};

	while (Object.keys(pool).length) {
		// get the node with the smallest heuristic
		const minValue = getMinFromPool(pool);
		const currentNode = pool[minValue].pop() as sNode;

		// delete the array in the pool when there are no more elements in it
		if (!pool[minValue].length) delete pool[minValue];

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

			// if there are no arrays at this level, create a new array with the new node
			// else add the node to the array
			const key = getKey(newNode);
			if (!pool[key]) pool[key] = [newNode];
			else pool[key].push(newNode);

			ids[newNode.id] = 1;
		});
	}

	throw new Error("this puzzle cannot be solved");
};

const getGetter = {
	greedy: (node: sNode) => node.heuristic,
	shortest: (node: sNode) => node.total
};

