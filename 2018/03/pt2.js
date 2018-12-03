const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');
const arr = fileContents.split(/\n/);

const regex = /^#([\d]+) @ ([\d]+),([\d]+): ([\d]+)x([\d]+)$/;

const grid = [];
const possibilities = {};

arr.forEach(item => {
  const [, id, offsetX, offsetY, width, height] = regex.exec(item).map(Number);

  possibilities[id] = true;
  for (let yIdx = offsetY; yIdx < height + offsetY; yIdx++) {
    grid[yIdx] = grid[yIdx] || [];
    grid[yIdx].push([offsetX, offsetX + width, id]);
  }
});

const overlap = grid.forEach(row => {
  row.reduce((rowAccum, [start, end, id]) => {
    for (let i = start; i < end; i++) {
      rowAccum[i] = rowAccum[i] || [0, new Set([id])];
      rowAccum[i][0]++;
      rowAccum[i][1].add(id);
    }
    return rowAccum;
  }, [])
  .forEach(([columnVal, ids]) => {
    if (columnVal && columnVal > 1) {
      Array.from(ids).forEach(id => delete possibilities[id]);
    }
  });
});

console.log(Object.keys(possibilities)[0]);
