export const wrongMove: any = {
  left: (x: number) => x === 0,
  right: (x: number, _: number, length: number) => x === length - 1,
  up: (_: number, y: number) => y === 0,
  down: (_: number, y: number, length: number) => y === length - 1
};

export const switcher: any = {
  left: (puzzle: Puzzle, prevX: number, prevY: number) => {
    const newX = prevX - 1;
    puzzle[prevY][prevX] = puzzle[prevY][newX];
    puzzle[prevY][newX] = 0;
    return { newX, newY: prevY };
  },
  right: (puzzle: Puzzle, prevX: number, prevY: number) => {
    const newX = prevX + 1;
    puzzle[prevY][prevX] = puzzle[prevY][newX];
    puzzle[prevY][newX] = 0;
    return { newX, newY: prevY };
  },
  up: (puzzle: Puzzle, prevX: number, prevY: number) => {
    const newY = prevY - 1;
    puzzle[prevY][prevX] = puzzle[newY][prevX];
    puzzle[newY][prevX] = 0;
    return { newX: prevX, newY };
  },
  down: (puzzle: Puzzle, prevX: number, prevY: number) => {
    const newY = prevY + 1;
    puzzle[prevY][prevX] = puzzle[newY][prevX];
    puzzle[newY][prevX] = 0;
    return { newX: prevX, newY };
  }
};

