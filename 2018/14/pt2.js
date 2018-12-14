// run this one with --max-old-space-size=4096 ... just trust me

const fs = require('fs');
const path = require('path');

const inputStr = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');

let recipeBoard = new Uint8Array(1000000000);

recipeBoard[0] = 3;
recipeBoard[1] = 7;
let writeIdx = 2;

let idxA = 0;
let idxB = 1;

const inputAsArr = inputStr.split('').map(Number);

function isDone() {
  return inputAsArr.every((digit, idx) =>
    recipeBoard[writeIdx - (inputAsArr.length - idx)] === digit
  );
}

while (!isDone()) {
  if (recipeBoard.length < writeIdx) throw new Error('out of room - increase the board size');

  const recipeA = recipeBoard[idxA];
  const recipeB = recipeBoard[idxB];

  const nextValue = recipeA + recipeB;
  const newValueStr = nextValue.toString();
  for (let i = 0; i < newValueStr.length; i++) {
    recipeBoard[writeIdx++] = Number(newValueStr.charAt(i));
    if (isDone()) break;
  }

  if (isDone()) break;

  idxA = (idxA + recipeA + 1) % writeIdx;
  idxB = (idxB + recipeB + 1) % writeIdx;

  process.stdout.write("\r" + writeIdx + " ");
}

console.log(writeIdx - inputAsArr.length);
// 20298300