'use strict';

import * as algorithms from './algo';

console.log('init');
const { logOnce } = require('../dist/logger');

const { initializeHeuristics } = require('./heuristics');
const { computeOnce } = require('./runtime');

const { parentPort, workerData, Worker, isMainThread  } = require('worker_threads');

export const useWorker = (
  solved: Puzzle,
  puzzle: Puzzle,
  type: heuristics,
  algorithm: algorithms,
  search: searchStyle,
  config:any
) => {
  return new Promise((resolve, reject) => {

    const worker = new Worker(__filename, {workerData: {config, solved, puzzle, algorithm, type, search}});
    worker.once('online', () => { console.log('Launching intensive CPU task') });

    worker.once('error', (error: any) => {
      console.log('error worker', error)
    });

    worker.once('exit', reject);

    worker.once('message', (data:any) => {
      console.log('end worker', data);
      // @ts-ignore
      //logOnce(...data);
      if (data.end) {
        resolve(true);
      }
    });
  })

};

if (!isMainThread) {
  const {config, solved, puzzle,type,algorithm,search} = workerData ;

  const heuristics = initializeHeuristics(solved, config.size);
  const heuristic = heuristics[type];
  computeOnce(
    puzzle,
    heuristic,
    type,
    algorithm,
    search
  );

  parentPort.postMessage({end: true});

}
