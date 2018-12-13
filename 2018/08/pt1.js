const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');

const entries = fileContents.split(' ').map(Number);

let node = 0;
function accumulateMetadata(offset, value = 0) {
  const nodeId = ++node;

  let idx = offset;
  let accumulated = value;

  // header
  let childrenRemaining = entries[idx++];
  let metadataRemaining = entries[idx++];

  // iterate through the children
  while (--childrenRemaining >= 0) {
    const update = accumulateMetadata(idx, accumulated);
    idx = update[0];
    accumulated = update[1];
  }

  while (--metadataRemaining >= 0) {
    accumulated += entries[idx++];
  }

  return [idx, accumulated];
}

const [, value] = accumulateMetadata(0, 0);

console.log(value);