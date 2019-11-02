const getFinalState = (length) => {
    const finalState = [];
    const finalStates = [];
    let finalStateName = [];
    let direction = 'r';
    let c = 0;
    let l = 0;
    let maxL = length -1;
    let minL = 0;
    let maxC = length -1;
    let minC = 0;

    for (let i = 1; i < length * length; i++) {
        finalState.push({c, l});
        finalStates.push(l * length + c);
        finalStateName[l * length + c] = i;
        switch (direction) {
            case "r": {
                c += 1;
                if (c > maxC) {
                    c = maxC;
                    l += 1;
                    minL += 1;
                    direction = 'b';
                }
                break;
            }
            case 'l': {
                c -= 1;
                if (c < minC) {
                    c = minC;
                    l -= 1;
                    maxL -= 1;
                    direction = 't';
                }
                break;
            }
            case 't': {
                l -= 1;
                if (l < minL) {
                    l = minL;
                    c += 1;
                    minC += 1;
                    direction = 'r';
                }
                break;
            }
            case 'b': {
                l += 1;
                if (l > maxL) {
                    l = maxL;
                    c -= 1;
                    maxC -=1;
                    direction = 'l';
                }
                break;
            }
        }
    }
    finalState.unshift({l, c});
    finalStates.unshift(l * length + c);
    finalStateName[l * length + c] = 0;
    //console.log(finalState);
    //console.log(finalStateName);
    console.log(finalStates)
    return {finalState, name: finalStateName.join(','), finalStates};
};

const getDistance = (goal, l, c) => {
    return (Math.abs(l - goal.l) + Math.abs(c - goal.c)) % 2
};

const getList = (p) => {
    return p.reduce((acc, line) => {
        acc = [...acc, ...line];
        return acc;
    }, [])
};

const isSolvable = (grid, length) => {
    const list = getList(grid);

    const inversion = list.reduce((acc, e, index) => {
        for (let i = index + 1; i < list.length; i++) {
            if (list[i] && e > list[i]) {
                acc += 1;
            }
        }
        return acc;
    }, 0);
console.log('inversion', inversion)

    // solvable if grid length is odd and inversion is odd  // even with 0 a end goal
    if (length % 2 === 1) {
        return inversion % 2 === 1;
    }

    // solvable if grid length is even and
    // inversion is even and 0 line is even
    // or inversion is odd and 0 line is odd
    const zeroPosition = Math.floor(list.indexOf(0) / length) + 1;
console.log('zpos : ', zeroPosition)
    return inversion % 2 === zeroPosition % 2;

};

const isAtGoalPosition = (e, list, goalList) => {
    return list.indexOf(e) === goalList.indexOf(e);
};

module.exports = {
    getFinalState: getFinalState,
    isSolvable: isSolvable,
    getList: getList,
    isAtGoalPosition: isAtGoalPosition,
};