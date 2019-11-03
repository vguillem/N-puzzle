const blue = '\x1b[1;36m';
const yellow = '\x1b[1;33m';
const yellowSmooth = '\x1b[0;3;33m';
const reset = '\x1b[0m';
const white = '\x1b[1;37m';
const green = '\x1b[32m';
const greenBold = '\x1b[32;1m';
const greenReset = '\x1b[0;32m';
const violet = '\x1b[35;1m';

export function logBench(state: State) {
  console.clear();

  console.log(`
${greenBold}-------- linearConflict --------${reset}

${logs(state.linearConflict)}

${greenBold}-------- inversion --------${reset}

${logs(state.inversion)}

${greenBold}-------- manhattan --------${reset}

${logs(state.manhattan)}
`);
}

function logs(state: HeuristicState) {
  return `	${violet} TIMES ${reset}
${blue}average: ${reset}           ${formatMsValue(
    getAvg(state.allSolvedTimes)
  )}
${blue}standard deviation: ${reset}${formatMsValue(
    getStandardDeviation(state.allSolvedTimes)
  )}
${blue}min: ${reset}               ${formatMsValue(
    getMin(state.allSolvedTimes)
  )}
${blue}max: ${reset}               ${formatMsValue(
    getMax(state.allSolvedTimes)
  )}
   ${formatNodesNumber(state)}`;
}

function formatNodesNumber(state: HeuristicState) {
return `${violet}MAX NODES IN MEMORY ${reset}
${blue}average:             ${reset}${formatNode(getAvg(state.allMaxNumNodes))}
${blue}standard deviation:  ${reset}${formatNode(
    getStandardDeviation(state.allMaxNumNodes)
  )}
${blue}min:                 ${reset}${formatNode(getMin(state.allMaxNumNodes))}
${blue}max:                 ${reset}${formatNode(getMax(state.allMaxNumNodes))}

   ${violet} ALL CREATED NODES ${reset}
${blue}average:             ${reset}${formatNode(getAvg(state.allCreatedNodes))}
${blue}standard deviation:  ${reset}${formatNode(
    getStandardDeviation(state.allCreatedNodes)
  )}
${blue}min:                 ${reset}${formatNode(getMin(state.allCreatedNodes))}
${blue}max:                 ${reset}${formatNode(getMax(state.allCreatedNodes))}

   ${violet} ALL EXPLORED NODES ${reset}
${blue}average:             ${reset}${formatNode(getAvg(state.allNumNodes))}
${blue}standard deviation:  ${reset}${formatNode(
    getStandardDeviation(state.allNumNodes)
  )}
${blue}min:                 ${reset}${formatNode(getMin(state.allNumNodes))}
${blue}max:                 ${reset}${formatNode(getMax(state.allNumNodes))}`.trim();
}

function formatNode(numNodes: number | string) {
  return `${reset}${white}${numNodes}${reset}`;
}

function getAvg(allValues: number[]) {
  return (allValues.reduce((a, b) => a + b, 0) / allValues.length).toFixed(2);
}

function getMax(allValues: number[]) {
  return allValues.reduce((a, b) => Math.max(a, b), -Infinity);
}

function getMin(allValues: number[]) {
  return allValues.reduce((a, b) => Math.min(a, b), Infinity);
}

function getStandardDeviation(allValues: number[]) {
  const average = getAvg(allValues);
  const sumOfSquared = allValues.reduce((a, b) => a + (b - +average) ** 2, 0);
  return Math.sqrt(sumOfSquared / allValues.length).toFixed(4);
}

function formatMsValue(str: string | number) {
  return `${yellow}${str}${yellowSmooth}ms${reset}`;
}
