const fs = require('fs');
const path = require('path');

const WORKERS = 5;
const OFFSET = 60;
function getDuration(char) {
  return char.charCodeAt(0) - 'A'.charCodeAt(0) + 1 + OFFSET;
}

if (getDuration('A') !== 1 + OFFSET) throw 'that aint it';
if (getDuration('D') !== 4 + OFFSET) throw 'that aint it';
if (getDuration('Z') !== 26 + OFFSET) throw 'that aint it';

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');

const linkRegex = /^Step ([\w]+) must be finished before step ([\w]+) can begin.$/
const links = fileContents.split("\n").map(str => {
  const [, dependency, step] = linkRegex.exec(str);
  return { step, dependency };
});
const { dependencies, dependents } = links.reduce(({ dependencies, dependents }, { step, dependency }) => {
  dependencies[dependency] = dependencies[dependency] || [];
  dependencies[step] = dependencies[step] || [];
  dependencies[dependency].push(step);

  dependents[dependency] = dependents[dependency] || [];
  dependents[step] = dependents[step] || [];
  dependents[step].push(dependency);

  return { dependencies, dependents };
}, { dependencies: {}, dependents: {} });

let inProgress = Array(WORKERS).fill(null);
let result = '';
const possibilities = new Set(
  Object.keys(dependents).filter(key => dependents[key].length === 0)
);

function rebuildPossibilities(mostRecent) {
  if (inProgress.some(i => !i)) {
    // determine what the possibilities array should contain
    dependencies[mostRecent].forEach(char => {
      const shouldAdd =
        dependents[char].filter(dep => result.indexOf(dep) < 0).length === 0 &&
        !inProgress.some(item => item && item.char === char);

      if (shouldAdd) {
        possibilities.add(char);
      }
    });
  }
}

let time = -1;
while (result.length < Object.keys(dependencies).length) {
  time++;

  for (let idx = 0; idx < inProgress.length; idx++) {
    let item = inProgress[idx];
    if (item && --item.t === 0) {
      result += item.char;
      inProgress[idx] = null;
      rebuildPossibilities(item.char);
      item = null;
    }

    if (!item && possibilities.size > 0) {
      const sortedPossibilities = Array.from(possibilities).sort();
      const next = sortedPossibilities.shift();
      possibilities.delete(next);
      inProgress[idx] = { char: next, t: getDuration(next) };
    }
  }
}

console.log(time, result);
