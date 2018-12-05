const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');
function reducePolymer(polymer) {
  let result = '';
  for (let i = 0; i < polymer.length; i++) {
    const nextChar = polymer[i];
    const lastChar = result[result.length - 1];
    if (lastChar) {
      // if the next character matches the end character,
      // drop the end character and ignore this character
      const caseMismatch = (
        (nextChar.match(/[A-Z]/) && lastChar.match(/[a-z]/)) ||
        (nextChar.match(/[a-z]/) && lastChar.match(/[A-Z]/))
      );
      const sameLetter = nextChar.toLowerCase() === lastChar.toLowerCase();
      if (caseMismatch && sameLetter) {
        result = result.slice(0, result.length - 1);
        continue;
      }
    }
    result += nextChar;
  }
  return result;
}

console.log(reducePolymer(fileContents).length);