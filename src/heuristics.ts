export const initializeHeuristics = (solved: Puzzle, size: number) => {
  const indexesPerNum = solved.flat().reduce<PerNum>(arrayToSet, {});
  return {
    manhattan: manhattan(indexesPerNum, size),
    hamming: hamming(solved, size),
    linearConflict: linearConflict(indexesPerNum, size)
  };
};

const arrayToSet = (acc: PerNum, cur: number, i: number) => {
  acc[cur] = i;
  return acc;
};

const manhattan = (solved: PerNum, size: number) => (puzzle: Puzzle) => {
  let heuristic = 0,
    x: number,
    y: number;
  for (let line = 0; line < size; line++) {
    for (let col = 0; col < size; col++) {
      if (puzzle[line][col] === 0) continue;
      const index = solved[puzzle[line][col]];
      x = index % size;
      y = Math.floor(index / size);
      heuristic += Math.abs(x - col) + Math.abs(y - line);
    }
  }
  return heuristic;
};

const hamming = (solved: Puzzle, size: number) => (puzzle: Puzzle) => {
	let heuristic = 0;
  for (let line = 0; line < size; line++) {
    for (let col = 0; col < size; col++) {
      if (puzzle[line][col] === 0) continue;
			if (puzzle[line][col] !== solved[line][col]) heuristic++;
    }
  }
  return heuristic;
}

interface Conflict {
  who: number;
  with: number;
}

const linearConflict = (solved: PerNum, size: number) => (puzzle: Puzzle) => {
  let solvedX: number,
    solvedY: number,
    solvedIndex: number,
    nextSolvedIndex: number,
    nextSolvedX: number,
    nextSolvedY: number,
    tile: number,
    manhattanValue: number = 0,
    nextTile: number,
    minConflicts: number = 0;

  for (let row = 0; row < size; row++) {
    let conflicts: Conflict[] = [];

    for (let col = 0; col < size; col++) {
      if (puzzle[row][col] === 0) continue;
      tile = puzzle[row][col];
      solvedIndex = solved[puzzle[row][col]];
      solvedX = solvedIndex % size;
      solvedY = Math.floor(solvedIndex / size);
      manhattanValue += Math.abs(solvedX - col) + Math.abs(solvedY - row);
      for (let nextCol = col + 1; nextCol < size; nextCol++) {
        if (puzzle[row][nextCol] === 0) continue;
        nextTile = puzzle[row][nextCol];
        nextSolvedIndex = solved[puzzle[row][nextCol]];
        nextSolvedX = nextSolvedIndex % size;
        nextSolvedY = Math.floor(nextSolvedIndex / size);
        if (nextSolvedY === solvedY && nextSolvedX < solvedX) {
          conflicts.push(
            { who: tile, with: nextTile },
            { who: nextTile, with: tile }
          );
        }
      }
    }
    while (conflicts.length) {
      const max = getMax(conflicts);
      conflicts = conflicts.filter(d => d.who !== max && d.with !== max);
      minConflicts++;
    }
  }
  for (let col = 0; col < size; col++) {
    let conflicts: Conflict[] = [];

    for (let row = 0; row < size; row++) {
      if (puzzle[row][col] === 0) continue;
      tile = puzzle[row][col];
      solvedIndex = solved[puzzle[row][col]];
      solvedX = solvedIndex % size;
      solvedY = Math.floor(solvedIndex / size);
      for (let nextRow = row + 1; nextRow < size; nextRow++) {
        if (puzzle[nextRow][col] === 0) continue;
        nextTile = puzzle[nextRow][col];
        nextSolvedIndex = solved[nextTile];
        nextSolvedX = nextSolvedIndex % size;
        nextSolvedY = Math.floor(nextSolvedIndex / size);
        if (nextSolvedX === solvedX && nextSolvedY < solvedY) {
          conflicts.push(
            { who: tile, with: nextTile },
            { who: nextTile, with: tile }
          );
        }
      }
    }
    while (conflicts.length) {
      const max = getMax(conflicts);
      conflicts = conflicts.filter(d => d.who !== max && d.with !== max);
      minConflicts++;
    }
  }
  return manhattanValue + 2 * minConflicts;
};

const getMax = (conflicts: Conflict[]) => {
  let maxValue = 0;
  let maxConflict = 0;
  const all = conflicts.reduce(
    (a, cur) => {
      if (a[cur.who]) a[cur.who].push(cur.with);
      else a[cur.who] = [cur.with];
      return a;
    },
    {} as { [id: number]: number[] }
  );
  for (const key in all) {
    if (all[key].length > maxValue) {
      maxConflict = +key;
      maxValue = all[key].length;
    }
  }
  return maxConflict;
};
