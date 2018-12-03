const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');
const arr = fileContents.split(/\n/);

let map = [];
let returnValue = 0;
arr.forEach((item, idx) => {
  const itemResult = [...item].reduce((result, char) => {
    result[char] = !!result[char] ? result[char] += 1 : 1;
    return result;
  }, {});
  
  new Set(Object.values(itemResult)).forEach(value => {
    if (value >= 2) {
      map[value] = map[value] ? map[value] += 1 : 1;
    }
  });
});

console.log(map.reduce((result, v) => result *= (v || 1)));