import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");

// part 1

const room = data
  .split("\n")
  .filter((row) => row.length)
  .map((row) => row.split(""));
const roomRows = room.length;
const roomCols = room[0].length;

const watchTile = ([row, col]) => room[row]?.[col] ?? false;
const nextTile = ([row, col]) => {
  return watchTile([row + currentPos.row, col + currentPos.col]);
};

const setTile = ([row, col], mark) => {
  room[row][col] = mark;
};
const moveTo = ([row, col]) => {
  setTile([currentPos.row, currentPos.col], "X");
  currentPos.col += col;
  currentPos.row += row;
  setTile([currentPos.row, currentPos.col], "^");
};

const currentPos = { col: 0, row: 0 };
outerLoop: for (let row = 0; row < roomRows; row++) {
  for (let col = 0; col < roomCols; col++) {
    if (watchTile([row, col]) !== "^") {
      continue;
    }
    currentPos.col = col;
    currentPos.row = row;
    break outerLoop;
  }
}

const moves = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};
const direction = ["up", "right", "down", "left"];

let current = 0;
while (nextTile(moves[direction[current]])) {
  if (nextTile(moves[direction[current]]) === "#") {
    current = (current + 1) % 4;
    continue;
  }
  moveTo(moves[direction[current]]);
}

let checkedTiles = 0;

for (let row = 0; row < roomRows; row++) {
  for (let col = 0; col < roomCols; col++) {
    if (/\^|X/.test(watchTile([row, col]))) {
      checkedTiles++;
    }
  }
}
console.log(checkedTiles);
