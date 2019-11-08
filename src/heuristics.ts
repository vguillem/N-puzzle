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
    solvedCol: number,
    solvedRow: number,
    index: number;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (puzzle[row][col] === 0) continue;
      index = solved[puzzle[row][col]];
      solvedCol = index % size;
      solvedRow = Math.floor(index / size);
      heuristic += Math.abs(solvedCol - col) + Math.abs(solvedRow - row);
    }
  }
  return heuristic;
};

const hamming = (solved: Puzzle, size: number) => (puzzle: Puzzle) => {
  let heuristic = 0;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (puzzle[row][col] === 0) continue;
      if (puzzle[row][col] !== solved[row][col]) heuristic++;
    }
  }
  return heuristic;
};

const linearConflict = (solved: PerNum, size: number) => (puzzle: Puzzle) => {
  let manhattanValue = 0;
  let allConflicts = 0;
  let rows: number[][] = [];
  let lines: number[][] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const tile = puzzle[row][col];
      if (!tile) continue;

      const sCol = solved[tile] % 3;
      const sRow = Math.floor(solved[tile] / 3);
      manhattanValue += Math.abs(sCol - col) + Math.abs(sRow - row);

      if (sRow === row) {
        if (!lines[sRow]) {
          lines[sRow] = [];

        }
        lines[row].push(sCol);
      }
      if (sCol === col) {
        if (!rows[sCol]) {
          rows[sCol] = [];

        }
        rows[sCol].push(sRow);
      }
    }
  }

  [...rows, ...lines].forEach((testArray) => {
    if (!testArray) {
      return;
    }
    let cf: Array<Set<number>> = [];
    testArray.forEach((test, index) => {
      if (!cf[test]) {
        cf[test] = new Set();
      }

      for (let i = index + 1; i < testArray.length; i++) {
        if (test > testArray[i]) {
          cf[test].add(testArray[i])
          if (!cf[testArray[i]]) {
            cf[testArray[i]] = new Set();
          }
          cf[testArray[i]].add(test);
        }
      }
    });

    let biggerConflictIndex = 0;

    const haveConflict = () => {

      return cf.reduce((acc, test, index) => {
        if (test && test.size > acc) {
          acc = test.size;
          biggerConflictIndex = index;
        }
        return acc;
      }, 0)
    };

    while (haveConflict()) {
      allConflicts += 1;

      cf[biggerConflictIndex].forEach(test => {
        cf[test].delete(biggerConflictIndex)
      });
      cf[biggerConflictIndex] = null as any;
    }

  });

  return manhattanValue + 2 * allConflicts;
};

const getMax = (conflicts: Array<[number, number]>) => {
  const conflictsByValue = conflicts.reduce(
    (a, conflict) => {
      if (!a[conflict[0]]) a[conflict[0]] = 1;
      else a[conflict[0]] += 1;
      return a;
    },
    {} as { [key: string]: number }
  );
  let maxConflicts = 0;
  let tile = 0;
  for (const key in conflictsByValue) {
    if (conflictsByValue[key] > maxConflicts) {
      maxConflicts = conflictsByValue[key];
      tile = +key;
    }
  }
  return tile;
};
