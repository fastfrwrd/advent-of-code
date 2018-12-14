const fs = require('fs');
const path = require('path');

let numRecipes = Number(fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8'));

const outputLength = 10;
let recipeBoard = new Uint8Array(numRecipes + outputLength);

recipeBoard[0] = 3;
recipeBoard[1] = 7;
let writeIdx = 2;

let idxA = 0;
let idxB = 1;

function getOutput() {
  return recipeBoard.slice(numRecipes, numRecipes + outputLength).join('');
}

while (writeIdx < numRecipes + outputLength) {
  const recipeA = recipeBoard[idxA];
  const recipeB = recipeBoard[idxB];

  const nextValue = recipeA + recipeB;
  const newValues = nextValue.toString().split('').map(Number);
  for (let i = 0; i < newValues.length; i++) {
    recipeBoard[writeIdx++] = newValues[i];
  }

  idxA = (idxA + recipeA + 1) % writeIdx;
  idxB = (idxB + recipeB + 1) % writeIdx;
}

console.log(getOutput());