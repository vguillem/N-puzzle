import { run, runOnce } from './runtime';
import { config } from './config';

const args = process.argv.slice(2);

const white = '\x1b[37;1m';
const green = '\x1b[32;1m';
const reset = '\x1b[0m';
const red = '\x1b[31;1m';

const USAGE = `

${white}usage: yarn dev [--size nb] [--bench,--interval nb] [-h|--help]${reset}

${green}--bench${reset}        run the app in a loop and display benchmarks
${green}--interval${reset}      specify the interval between tests if running in benchmark mode
${green}--size${reset}      specify the interval between tests if running in benchmark mode
${green}-h --help${reset}      show the help

`.trim();

if (args.includes('-h') || args.includes('--help')) {
  console.log(USAGE);
  process.exit(0);
}

let index;
if ((index = args.indexOf('--interval')) !== -1) {
  config.timeout = Number(args[index + 1]);
}
if (isNaN(config.timeout)) {
  console.error(`${red}Error: ${reset}--interval requires a number`);
  process.exit(1);
}

if ((index = args.indexOf('--size')) !== -1) {
  config.size = Number(args[index + 1]);
}
if (isNaN(config.size)) {
  console.error(`${red}Error: ${reset}--size requires a number`);
  process.exit(1);
}

if (args.includes('--bench')) {
  run();
} else {
  runOnce();
}
