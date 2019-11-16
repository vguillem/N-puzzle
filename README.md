# N-Puzzle solver

### dev / build

- `yarn && yarn dev`
- `yarn dev -h` for the help

To build, you will need to have `yarn` installed and run `make` \
the code will be compiled with nexe. Run the binary with `./N-puzzle -h`

### code

- argument parsing in `index.ts`
- input parsing in `handleInput.ts`
- algorithms (astar, idastar) in `algo.ts`
- the runtime in `runtime.ts`
- heuristics in `heuristics.ts`
- display / logging in `logging.ts`
- code utils and type infos in `utils.ts`, `types.d.ts`, `config.ts`

### infos

- the `puzzles` folder contains maps for puzzles, files are `p0,p1,p2...`

