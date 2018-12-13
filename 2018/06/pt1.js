const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');

const matrix = [];
const candidates = fileContents.split(/\n/).reduce((candidates, str, idx) => {
  const [ x, y ] = str.split(', ').map(Number);
  candidates[idx] = {
    id: idx,
    origin: [x, y],
    score: 0,
  };
  return candidates;
}, [[], {}]);

const width = Object.values(candidates).reduce((val, coordinate) => Math.max(coordinate.origin[0], val), -Infinity);
const height = Object.values(candidates).reduce((val, coordinate) => Math.max(coordinate.origin[1], val), -Infinity);
