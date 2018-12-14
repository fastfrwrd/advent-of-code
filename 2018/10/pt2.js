const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');
const rowRegex = /^position=<[\s]*([-\d]+),[\s]*([-\d]+)> velocity=<[\s]*([-\d]+),[\s]*([-\d]+)>$/;

class Point {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  tick() {
    _boundsCache = null;
    this.x += this.vx;
    this.y += this.vy;
  }

  reverse() {
    _boundsCache = null;
    this.x -= this.vx;
    this.y -= this.vy;
  }
}

const points = fileContents.split("\n").map(row => {
  const parsedRow = rowRegex.exec(row);
  parsedRow.shift();
  return new Point(...parsedRow.map(Number));
});

let _boundsCache;
function getBounds() {
  if (_boundsCache) return _boundsCache;

  let yMin = Infinity;
  let yMax = -Infinity;
  let xMin = Infinity;
  let xMax = -Infinity;

  points.forEach(point => {
    // adjust the mins and maxes
    xMin = Math.min(xMin, point.x);
    yMin = Math.min(yMin, point.y);
    xMax = Math.max(xMax, point.x);
    yMax = Math.max(yMax, point.y);
  });

  _boundsCache = { xMin, xMax, yMin, yMax }

  return _boundsCache;
}

function getXEdge() {
  const { xMin, xMax } = getBounds();
  return Math.abs(xMax) - Math.abs(xMin);
}

function getYEdge() {
  const { yMin, yMax } = getBounds();
  return Math.abs(yMax) - Math.abs(yMin);
}

function getArea() {
  return getXEdge() * getYEdge();
}

function printSky() {
  const rows = {};
  points.forEach(point => {
    // write the y value to a row
    rows[point.x] = rows[point.x] || new Set();
    rows[point.x].add(point.y);
  });

  const { xMin, xMax, yMin, yMax } = getBounds();

  let result = '';
  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      if (rows[x] && rows[x].has(y)) result += '*';
      else result += ' ';
    }
    result += "\n";
  }

  return result;
}

// wait for the stars to condense all the way, then begin expanding.
let prevXEdge = Infinity;
let prevYEdge = Infinity;
let second = 0;
while (getXEdge() <= prevXEdge || getYEdge() <= prevYEdge) {
  prevXEdge = getXEdge();
  prevYEdge = getYEdge();
  points.forEach(p => p.tick());
  second++;
  // process.stdout.write("\r" + second + " " + getXEdge() + " x " + getYEdge());
}

// back it up to one second before
points.forEach(p => p.reverse())

// print it out
console.log(second);
