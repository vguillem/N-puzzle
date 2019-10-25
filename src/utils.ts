export const getFinalState = (length: number) => {
  const finalState = [];
  let finalStateName = [];
  let direction = "r";
  let column = 0;
  let line = 0;
  let maxLines = length - 1;
  let minLines = 0;
  let maxColumns = length - 1;
  let minColumns = 0;
  const totalSize = length * length;

  for (let i = 1; i < totalSize; i++) {
    finalState.push({ column, line });
    finalStateName[line * length + column] = i;
    switch (direction) {
      case "r": {
        column += 1;
        if (column > maxColumns) {
          column = maxColumns;
          line += 1;
          minLines += 1;
          direction = "b";
        }
        break;
      }
      case "l": {
        column -= 1;
        if (column < minColumns) {
          column = minColumns;
          line -= 1;
          maxLines -= 1;
          direction = "t";
        }
        break;
      }
      case "t": {
        line -= 1;
        if (line < minLines) {
          line = minLines;
          column += 1;
          minColumns += 1;
          direction = "r";
        }
        break;
      }
      case "b": {
        line += 1;
        if (line > maxLines) {
          line = maxLines;
          column -= 1;
          maxColumns -= 1;
          direction = "l";
        }
        break;
      }
    }
  }
  // unshift pushes at the start of array
  finalState.unshift({ line, column });
  finalStateName[line * length + column] = 0;
  console.log(finalState);
  console.log(finalStateName);
  return { finalState, name: finalStateName.join(",") };
};

