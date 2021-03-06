import { runBench, runOnce } from './runtime';
import { config, printConfig } from './config';
import { getPuzzle } from './handleInput';

const args = process.argv.slice(2);

const white = '\x1b[37;1m';
const green = '\x1b[32;1m';
const reset = '\x1b[0m';
const red = '\x1b[31;1m';

const USAGE = `

${white}usage: ./run [OPTIONS] [FILE?]

OPTIONS:
${green}--size       ${reset}   specify the size of the puzzle (3-5)
${green}--algorithms ${reset}   list of coma (',') separated algorithms (astar,idastar)
${green}--search     ${reset}   list of coma (',') separated search (normal,greedy,uniform)
${green}--heuristics ${reset}   list of coma (',') separated heuristics (manhattan,hamming,linearConflict,cornerTile,combined)
${green}--showSteps  ${reset}   shows all steps from the resolved path
${green}--enableWorkers${reset} enable workers to run multiple runtimes in parallel

${green}--bench      ${reset}   run the app in a loop and display benchmark:
${reset}             ${reset}   this will run with the astar algorithm on a 3x3 puzzle

${green}-h, --help   ${reset}   show this help
`.trim();

if (args.includes('-h') || args.includes('--help')) {
  console.log(USAGE);
  process.exit(0);
}

let index;
if ((index = args.indexOf('--size')) !== -1) {
  config.size = Number(args[index + 1]);
}
if (isNaN(config.size)) {
  console.error(`${red}Error: ${reset}--size requires a number`);
  process.exit(1);
}
if (config.size < 3 || config.size > 5) {
  console.error(`${red}Error: ${reset}--size must be between 3 and 5`);
  process.exit(1);
}

if ((index = args.indexOf('--heuristics')) !== -1) {
  const regexp = /^linearConflict$|^manhattan$|^hamming$|^cornerTile$|^combined$/;
  if (!args[index + 1]) {
    console.error(
      `${red}Error: ${reset}--heuristics requires a , separated list of heuristics (manhattan,hamming,linearConflict,cornerTile,combined)`
    );
    process.exit(1);
  }
  const heuristics = args[index + 1].split(',') as heuristics[];
  if (heuristics.some(h => !regexp.test(h))) {
    console.error(
      `${red}Error: ${reset}--heuristics requires a , separated list of heuristics (manhattan,hamming,linearConflict,cornerTile,combined)`
    );
    process.exit(1);
  }
  config.heuristics = heuristics;
}

if ((index = args.indexOf('--algorithms')) !== -1) {
  const regexp = /^astar$|^idastar$/;
  if (!args[index + 1]) {
    console.error(
      `${red}Error: ${reset}--algorithms requires a coma separated list of algorithms (astar,idastar)`
    );
    process.exit(1);
  }
  const algorithms = args[index + 1].split(',') as algorithms[];
  if (algorithms.some(h => !regexp.test(h))) {
    console.error(
      `${red}Error: ${reset}--algorithms requires a coma separated list of algorithms (astar,idastar)`
    );
    process.exit(1);
  }
  config.algorithms = algorithms;
}

if ((index = args.indexOf('--search')) !== -1) {
  const regexp = /^greedy$|^uniform$|^normal$/;
  if (!args[index + 1]) {
    console.error(
      `${red}Error: ${reset}--search requires a coma separated list of searches (normal,greedy,uniform)
it will only work with the astar algorithm`
    );
    process.exit(1);
  }
  const searches = args[index + 1].split(',') as searchStyle[];
  if (searches.some(h => !regexp.test(h))) {
    console.error(
      `${red}Error: ${reset}--search requires a coma separated list of searches (normal,greedy,uniform)
it will only work with the astar algorithm`
    );
    process.exit(1);
  }
  config.search = searches;
}

if ((index = args.indexOf('--showSteps')) !== -1) {
  config.showSteps = true;
}

if ((index = args.indexOf('--enableWorkers')) !== -1) {
  config.enableWorkers = true;
}

if (args.includes('--bench')) {
  runBench();
} else {
  let puzzle;
  try {
    puzzle = getPuzzle(args);
  } catch (e) {
    if (e.message === 'unsolvable')
      console.error(`${red}Error: ${reset}the puzzle is not solvable`);
    else if (e.message === 'file')
      console.error(`${red}Error: ${reset}file is not valid`);
    process.exit(1);
  }
  printConfig();
  runOnce(puzzle as Puzzle);
}
