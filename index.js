const Solver = require('./Solver');
const {generate} = require('./generate');

const args = process.argv;

let f = null;
// const f = [
//     [7, 1, 2],
//     [5, 0, 4],
//     [8, 3, 6],
// ];
// const f = [
//     [1, 2, 3],
//     [8, 0, 4],
//     [7, 6, 5],
// ];
// const f = [
//     [1, 3, 4],
//     [0, 2, 5],
//     [8, 7, 6],
// ];
// const f = [
//     [1, 2, 3, 4],
//     [5, 6, 7, 8],
//     [9, 10, 11, 12],
//     [13, 14, 15, 0],
// ];

// const f = [
//     [1, 2, 3, 4],
//     [13, 0, 14, 5],
//     [12, 9, 6, 7],
//     [11, 10, 8, 15],
// ];
//
// const f = [
//     [1, 2, 3, 4],
//     [12, 13, 14, 5],
//     [11, 0, 15, 6],
//     [10, 9, 8, 7],
// ];
// const f = [
//     [ 9, 12, 15, 2 ],
//     [ 13, 10, 3, 6 ],
//     [ 4, 8, 11, 14 ],
//     [ 1, 7, 5, 0 ]
// ];
f = [
    [ 0, 14, 5, 1 ],
    [ 10, 8, 15, 12 ],
    [ 11, 9, 6, 13 ],
    [ 4, 7, 2, 3 ]
]

// const f = [
//     [ 4, 9, 14, 15 ],
//     [ 5, 10, 13, 0 ],
//     [ 12, 2, 6, 8 ],
//     [ 11, 1, 7, 3 ]
// ]

// f = [
//     [ 5, 4, 11, 3 ],
//     [ 8, 12, 6, 13 ],
//     [ 14, 15, 9, 1 ],
//     [ 0, 7, 2, 10 ],
// ];



let solver;
let isSolvable = false;
while(!isSolvable) {
    //f = generate(4);
    console.log(f)
    solver = new Solver(f);
    isSolvable = solver.checkIsSolvable();
}

// solver = new Solver(f);
// isSolvable = solver.checkIsSolvable();
if (isSolvable) {
    const solve = solver.solve();
}

//console.log(isSolvable);


// console.log('Total number of states ');
// console.log('Maximum number of states in memory ');
// console.log('Number of moves ');
// console.log('the ordered sequence of states ');

// const solvable = isSolvable();
// console.log('solvable : ', solvable);


// args.forEach(arg => {
//     console.log(arg)
// });
