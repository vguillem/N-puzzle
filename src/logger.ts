const blue = "\x1b[1;36m";
const yellow = "\x1b[1;33m";
const reset = "\x1b[0m";
const white = "\x1b[0;3;33m";

export function logs(allValues: number[]) {
  console.log(
    `${blue}average: ${reset}           `,
    format(getAvg(allValues).toFixed(2))
  );
  console.log(
    `${blue}standard deviation: ${reset}`,
    format(getStandardDeviation(allValues).toFixed(4))
  );
  console.log(
    `${blue}min: ${reset}               `,
    format(getMin(allValues).toString())
  );
  console.log(
    `${blue}max: ${reset}               `,
    format(getMax(allValues).toString())
  );
  console.log("\n");
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

function format(str: string) {
  return `${yellow}${str}${white}ms${reset}`;
}
