const fs = require('fs');
const path = require('path');

class Marble {
  constructor(id) {
    this.id = id;
    this.next = this;
    this.prev = this;
  }

  setNext(marble) {
    this.next = marble;
  }

  setPrev(marble) {
    this.prev = marble;
  }
}

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');
const inputRegex = /^([\d]+) players; last marble is worth ([\d]+) points$/;
const [, playerCountStr, marbleCountStr] = inputRegex.exec(fileContents);
const playerCount = Number(playerCountStr);
const marbleCount = Number(marbleCountStr) * 100;

const scoreboard = new Array(playerCount).fill(0);
let currentMarble = new Marble(0);
for (let id = 1; id <= marbleCount; id++) {
  if (id % 23 === 0) {
    const currentPlayer = (id - 1) % playerCount;
    const scoringMarble = Array(7).fill(null).reduce(m => m.next, currentMarble);
    scoringMarble.prev.setNext(scoringMarble.next);
    scoringMarble.next.setPrev(scoringMarble.prev);
    const pointsToAdd = scoringMarble.id + id;
    scoreboard[currentPlayer] += pointsToAdd;
    currentMarble = scoringMarble.prev;
  } else {
    const newMarble = new Marble(id);
    const rightMarble = currentMarble.prev;
    const leftMarble = rightMarble.prev;

    leftMarble.setNext(newMarble);
    rightMarble.setPrev(newMarble);
    newMarble.setPrev(leftMarble);
    newMarble.setNext(rightMarble);

    currentMarble = newMarble;
  }
}

console.log(scoreboard.sort()[scoreboard.length - 1]);