const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');
const arr = fileContents.split(/\s/);

for (let arrIdx = 0; arrIdx < arr.length; arrIdx++) {
  for (let searchIdx = arrIdx + 1; searchIdx < arr.length; searchIdx++) {
    let diffCharIdx;
    let differences = 0;
    const str1 = arr[arrIdx];
    const str2 = arr[searchIdx];

    for (let charIdx = 0; charIdx < str1.length; charIdx++) {
      if (str1[charIdx] !== str2[charIdx]) {
        diffCharIdx = charIdx;
        differences++;
      }
      if (differences > 1) break;
    }
    
    // found the match
    if (differences === 1) {
      console.log(`${str1.slice(0, diffCharIdx)}${str1.slice(diffCharIdx + 1, str1.length)}`);
      return;
    }
  }
}