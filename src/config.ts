interface Config {
  heuristics: heuristics[];
  algorithms: algorithms[];
  search: searchStyle[];
  size: number;
  showSteps: boolean;
}

export const config: Config = {
  heuristics: ['manhattan', 'cornerTile', 'linearConflict'],
  algorithms: ['astar'],
  search: ['normal'],
  size: 3,
  showSteps: false
};

const white = '\x1b[37;1m';
const green = '\x1b[32;1m';
const blue = '\x1b[33;1m';
const purple = '\x1b[36;1m';
const yellow = '\x1b[34;1m';
const reset = '\x1b[0m';

export const printConfig = () => {
  console.log(
    `
${blue}heuristics:  ${white}${config.heuristics.join(',')}${reset}
${green}algorithms:  ${white}${config.algorithms.join(',')}${reset}
${yellow}searches:    ${white}${config.search.join(',')}${reset}
${purple}puzzle size: ${white}${config.size}${reset}
`.trim()
  );
};
