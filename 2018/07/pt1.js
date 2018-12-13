const fs = require('fs');
const path = require('path');

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

let result = '';
const possibilities = new Set(
  Object.keys(dependents).filter(key => dependents[key].length === 0)
);

while (result.length < Object.keys(dependencies).length) {
  // append the first alphabetical possibility, and also remove it 
  // as a possibility
  const sortedPossibilities = Array.from(possibilities).sort();
  const next = sortedPossibilities.shift();
  result += next;
  possibilities.delete(next);

  // determine what the possibilities array should contain
  const mostRecent = result.charAt(result.length - 1);
  dependencies[mostRecent].forEach(char => {
    // if all the requirements are met, add it to the possibilities set
    if (dependents[char].filter(i => result.indexOf(i) < 0).length === 0) {
      possibilities.add(char);
    }
  });
}

console.log(time, result);
