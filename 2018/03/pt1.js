const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');
const arr = fileContents.split(/\n/);

const regex = /^#([\d]+) @ ([\d]+),([\d]+): ([\d]+)x([\d]+)$/;

const grid = [];

arr.forEach(item => {
  const [, id, offsetX, offsetY, width, height] = regex.exec(item).map(Number);

  for (let yIdx = offsetY; yIdx < height + offsetY; yIdx++) {
    grid[yIdx] = grid[yIdx] || [];
    grid[yIdx].push([offsetX, offsetX + width]);
  }
});

const overlap = grid.reduce((result, row, rowIdx) => {
  return result + row
    .reduce((rowAccum, [start, end]) => {
      for (let i = start; i < end; i++) {
        rowAccum[i] = rowAccum[i] || 0;
        rowAccum[i]++;
      }
      return rowAccum;
    }, [])
    .reduce((totalOverlap, columnVal) => {
      if (columnVal && columnVal > 1) {
        return totalOverlap + 1;
      }
      return totalOverlap;
    }, 0);
}, 0);

console.log(overlap);
