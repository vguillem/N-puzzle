import { parentPort, workerData, Worker, isMainThread } from 'worker_threads';
import { computeOnce } from './compute';

interface Params {
  solved: Puzzle;
  puzzle: Puzzle;
  type: heuristics;
  algorithm: algorithms;
  search: searchStyle;
  size: number;
}

export const useWorker = (
  workerData: Params
): Promise<AlgorithmData> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, { workerData });

    worker.once('online', () =>
      console.log('Launching puzzle solving in separate thread')
    );

    worker.once('error', error =>
      console.log(`error worker: ${error.message}`)
    );

    worker.once('exit', reject);

    worker.once('message', (data: AlgorithmData) => {
      resolve(data);
    });
  });
};

if (!isMainThread) {
  const data: AlgorithmData = computeOnce(workerData);
  if (parentPort) parentPort.postMessage(data);
}
