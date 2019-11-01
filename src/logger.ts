const blue = "\x1b[1;36m";
const yellow = "\x1b[1;33m";
const reset = "\x1b[0m";
const white = "\x1b[0;3;33m";
const green = "\x1b[32m";
const greenReset = "\x1b[0;32m";
const violet = "\x1b[1;35m";

export function logger(state: State) {
  console.clear();

  console.log("\x1b[32;1m-------- linearConflict --------\x1b[0m");
  logs(state.linearConflict);

  console.log("\x1b[32;1m-------- inversion --------\x1b[0m");
  logs(state.inversion);

  console.log("\x1b[32;1m-------- manhattan --------\x1b[0m");
  logs(state.manhattan);
}

function logs(state: HeuristicState) {
  console.log();
  console.log(formatSolveTime(state.solveTime));
  console.log();
  console.log(
    `${blue}average: ${reset}           `,
    formatMsValue(getAvg(state.allSolvedTimes).toFixed(2))
  );
  console.log(
    `${blue}standard deviation: ${reset}`,
    formatMsValue(getStandardDeviation(state.allSolvedTimes).toFixed(4))
  );
  console.log(
    `${blue}min: ${reset}               `,
    formatMsValue(getMin(state.allSolvedTimes).toString())
  );
  console.log(
    `${blue}max: ${reset}               `,
    formatMsValue(getMax(state.allSolvedTimes).toString())
  );
  console.log();
  console.log(formatVisitedNodes(state.visitedNodes));
  console.log(formatAvgVisitedNodes(getAvg(state.allVisitedNodes).toFixed()));
  console.log(formatDeviationVisitedNodes(getStandardDeviation(state.allVisitedNodes).toFixed()));
  console.log();
}

function getAvg(allValues: number[]) {
  return allValues.reduce((a, b) => a + b, 0) / allValues.length;
}

function getMax(allValues: number[]) {
  return allValues.reduce((a, b) => Math.max(a, b), -Infinity);
}

function getMin(allValues: number[]) {
  return allValues.reduce((a, b) => Math.min(a, b), Infinity);
}

function getStandardDeviation(allValues: number[]) {
  const average = getAvg(allValues);
  const sumOfSquared = allValues.reduce((a, b) => a + (b - average) ** 2, 0);
  return Math.sqrt(sumOfSquared / allValues.length);
}

function formatMsValue(str: string | number) {
  return `${yellow}${str}${white}ms${reset}`;
}

function formatSolveTime(solveTime: number | string) {
  return `${blue}solved in            ${green}${solveTime}${greenReset}ms${reset}`;
}

function formatVisitedNodes(visitedNodes: number | string) {
  return `${blue}visitedNodes:        ${violet}${visitedNodes}${reset}`;
}

function formatAvgVisitedNodes(visitedNodes: number | string) {
  return `${blue}average:             ${violet}${visitedNodes}${reset}`;
}

function formatDeviationVisitedNodes(visitedNodes: number | string) {
  return `${blue}standard deviation:  ${violet}${visitedNodes}${reset}`;
}
