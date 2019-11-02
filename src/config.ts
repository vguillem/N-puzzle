interface Config {
  heuristics: Array<'manhattan' | 'inversion' | 'linearConflict'>;
  algorithms: Array<'astar' | 'idastar'>;
  search: Array<'greedy' | 'uniform'>;
  timeout: number;
  size: number;
}

export const config: Config = {
  heuristics: ['manhattan', 'inversion', 'linearConflict'],
  algorithms: ['astar'],
  search: ['uniform'],
  timeout: 100,
  size: 3
};
