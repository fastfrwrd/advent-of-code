const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');
const numberStrings = fileContents.split(/\s/);
const numberArray = numberStrings.map(str => Number(str));

const answerMap = {};
let sum = 0;
let found = false;
let i = 0;
while (!found) {
  sum += numberArray[i++ % numberArray.length];
  if (answerMap[sum]) {
    found = true;
  }
  answerMap[sum] = true;
}

console.log(sum);
