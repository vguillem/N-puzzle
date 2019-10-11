const getRandom = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
};

const generate = (length) => {
    const result = [];
    const all = [];

    const max = length * length;
    for (let i = 0; i < length; i++) {
        result[i] = []
        for (let j = 0; j < length; j++){
            let r = getRandom(max);
            while(all.indexOf(r) > -1) {
                r = getRandom(max);
            }
            result[i][j] = r;
            all.push(r);
        }
    }
    console.log(result)
    return result;
};

module.exports = {
    generate: generate,
};