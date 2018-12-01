const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');
const numberStrings = fileContents.split(/\s/);
const numberArray = numberStrings.map(str => Number(str));

const result = numberArray.reduce((sum, item) => sum += item, 0);

console.log(result);
