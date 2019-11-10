import { parentPort, workerData, Worker, isMainThread } from 'worker_threads';
import { initializeHeuristics } from './heuristics';
import { computeOnce } from './runtime';

interface Params {
  solved: Puzzle;
  solvedId: string;
  puzzle: Puzzle;
  type: heuristics;
  algorithm: algorithms;
  search: searchStyle;
  size: number;
}

export const useWorker = (workerData: Params) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, { workerData });
    worker.once('online', () => {
      console.log('Launching intensive CPU task');
    });

    worker.once('error', (error: any) => {
      console.log('error worker', error);
    });

    worker.once('exit', reject);

    worker.once('message', (data: any) => {
      console.log('end worker', data);
      // @ts-ignore
      //logOnce(...data);
      if (data.end) {
        resolve(true);
      }
    });
  });
};

if (!isMainThread) {
  const {
    size,
    solvedId,
    solved,
    puzzle,
    type,
    algorithm,
    search
  } = workerData as Params;

  const heuristics = initializeHeuristics(solved, size);
  const heuristic = heuristics[type];
  computeOnce(puzzle, heuristic, type, algorithm, search, solvedId);

  if (parentPort) parentPort.postMessage({ end: true });
}
