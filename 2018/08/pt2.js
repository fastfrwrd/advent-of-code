const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');

const entries = fileContents.split(' ').map(Number);

let node = 0;
function nodeValue(offset) {
  const nodeId = ++node;

  let idx = offset;
  let value = 0;

  // header
  let childrenRemaining = entries[idx++];
  let metadataRemaining = entries[idx++];

  // iterate through the children
  const childValues = [];
  while (--childrenRemaining >= 0) {
    const update = nodeValue(idx);
    idx = update[0];
    childValues.push(update[1]);
  }

  console.log(childValues);

  while (--metadataRemaining >= 0) {
    if (childValues.length === 0) {
      value += entries[idx++];
    } else {
      value += childValues[entries[idx++] - 1] || 0;
    }
  }

  return [idx, value];
}

const [, value] = nodeValue(0);

console.log(value);