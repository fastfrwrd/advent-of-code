const fs = require('fs');
const path = require('path');

let state = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8').split("\n").map(row => row.split(''));

const cartRegex = /^[\>\<\^v]{1}$/;
const verticalRegex = /^[\+\|\\\/]{1}$/;
const horizontalRegex = /^[\+-\\\/]{1}$/;
const intersectionTurnOrder = ['L', 'F', 'R'];

let i = 0;
let cartCount = 0;

function printState() {
  console.log(state.map(row => row.join('')).join("\n"));
}

function printNearbyGrid(x, y) {
  console.log([
    [getAt(x - 1, y - 1).toString(), getAt(x, y - 1).toString(), getAt(x + 1, y - 1).toString()].join(''),
    [getAt(x - 1, y).toString(), getAt(x, y).toString(), getAt(x + 1, y).toString()].join(''),
    [getAt(x - 1, y + 1).toString(), getAt(x, y + 1).toString(), getAt(x + 1, y + 1).toString()].join(''),
  ].join("\n"));
}

class Cart {
  constructor(cart, x, y) {
    this.cart = cart;
    this.id = ++cartCount;
    this.turns = 0;
    this.lastMove = -1;
    this.on = inferTrackPiece(x, y);
  }

  toString() {
    return this.cart;
  }
}

function getAt(x, y) {
  try {
    return state[y][x] || ' ';
  } catch (err) {
    return ' ';
  }
}

const isVerticalPiece = cell => verticalRegex.test(cell) || cartRegex.test(cell);
const isHorizontalPiece = cell => horizontalRegex.test(cell) || cartRegex.test(cell);

function inferTrackPiece(x, y) {
  const above = (getAt(x, y - 1).toString()).trim();
  const below = (getAt(x, y + 1).toString()).trim();
  const left = (getAt(x - 1, y).toString()).trim();
  const right = (getAt(x + 1, y).toString()).trim();

  if (
    isVerticalPiece(above) &&
    isVerticalPiece(below) &&
    isHorizontalPiece(left) &&
    isHorizontalPiece(right)
  ) return '+';
  if (
    isVerticalPiece(above) &&
    isVerticalPiece(below)
  ) return '|';
  if (
    isHorizontalPiece(left) &&
    isHorizontalPiece(right)
  ) return '-';
  if (
    isVerticalPiece(above) &&
    isHorizontalPiece(left)
  ) return '/';
  if (
    isVerticalPiece(below) &&
    isHorizontalPiece(right)
  ) return '/';
  if (
    isVerticalPiece(above) &&
    isHorizontalPiece(right)
  ) return '\\';
  if (
    isVerticalPiece(below) &&
    isHorizontalPiece(left)
  ) return '\\';

  printNearbyGrid(x, y);
  throw new Error('could not figure out the underyling track');
}

function getNextCoords(x, y) {
  switch (getAt(x, y).cart) {
    case '^':
      return [x, y - 1];
    case 'v':
      return [x, y + 1];
    case '<':
      return [x - 1, y];
    case '>':
      return [x + 1, y]
    default:
      throw new Error(`getNextCoords was called on a non-cart. coords ${x} ${y}`);
  }
}

function handleIntersection(cart) {
  const dir = intersectionTurnOrder[cart.turns % intersectionTurnOrder.length];
  cart.turns++;
  switch (dir) {
    case 'L':
      switch (cart.cart) {
        case '^': return '<';
        case '<': return 'v';
        case 'v': return '>';
        case '>': return '^';
        default: throw new Error('invalid cart found at intersection');
      }
    case 'R':
      switch (cart.cart) {
        case '^': return '>';
        case '>': return 'v';
        case 'v': return '<';
        case '<': return '^';
        default: throw new Error('invalid cart found at intersection');
      }
    case 'F': return cart.cart;
    default:
      throw new Error('we did it bad');
  }
}

function turnCart(cart, nextLength) {
  switch (cart.cart) {
    case '<': return nextLength === '/' ? 'v' : '^';
    case '^': return nextLength === '/' ? '>' : '<';
    case '>': return nextLength === '/' ? '^' : 'v';
    case 'v': return nextLength === '/' ? '<' : '>';
  }
}

function moveCart(x, y) {
  const cart = getAt(x, y);
  const [nextX, nextY] = getNextCoords(x, y);
  const nextLength = getAt(nextX, nextY);

  if (nextLength instanceof Cart) {
    crashIntersection = [nextX, nextY];
    return;
  }

  switch (nextLength) {
    // cart is entering intersection
    case '+':
      cart.cart = handleIntersection(cart);
      break;
    // cart hit a bend
    case '/':
    case '\\':
      cart.cart = turnCart(cart, nextLength);
      break;
    // cart is moving straight ahead
    case '-':
    case '|':
      break;
    default:
      printNearbyGrid(x, y);
      throw new Error(`cart has derailed ${nextX} ${nextY} - id: ${cart.id}`);
  }

  // update the cart
  const prevLength = cart.on;
  cart.on = nextLength;
  cart.lastMove = turn;

  // update the state
  state[y][x] = prevLength;
  state[nextY][nextX] = cart;
}

let crashIntersection;
let turn = 0;
while (!crashIntersection) {
  // console.log(state.map(row => row.join('')));
  // console.log('turn', turn);

  for (let y = 0; y < state.length; y++) {
    const row = state[y];
    for (let x = 0; x < row.length; x++) {
      if (crashIntersection) continue;
      let cell = getAt(x, y);
      if (typeof cell === 'string' && cartRegex.test(cell)) {
        cell = row[x] = new Cart(cell, x, y);
      }
      if (cell instanceof Cart && cell.lastMove < turn) {
        moveCart(x, y);
      }
    }
  }

  turn++;
}

console.log(crashIntersection);
