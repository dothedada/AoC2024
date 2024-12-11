import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");

const map = data
  .split("\n")
  .filter((e) => e.trim())
  .map((row) => row.split("").map(Number));

const moves = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
];

const posiblePaths = ([row, col], noRepeat) => {
  if (map[row][col] !== 0) {
    return 0;
  }

  let visitedTiles;
  if (noRepeat) {
    visitedTiles = new Set();
  }
  return pathFinder([row, col], 0, visitedTiles);
};

const getTileValue = ([row, col]) => {
  if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
    return null;
  }
  return map[row][col];
};

const pathFinder = ([row, col], height, visitedTiles) => {
  let pathCount = 0;
  if (visitedTiles) {
    visitedTiles.add(`${row}_${col}`);
  }

  if (getTileValue([row, col]) === 9) {
    return 1;
  }

  for (const [rowAdd, colAdd] of moves) {
    const nexTile = [row + rowAdd, col + colAdd];
    if (
      getTileValue(nexTile) !== height + 1 ||
      (visitedTiles && visitedTiles.has(nexTile.join("_")))
    ) {
      pathCount += 0;
      continue;
    }
    pathCount += pathFinder(nexTile, height + 1, visitedTiles);
  }

  return pathCount;
};

const routesCount = (map, noRepeat) => {
  let totalPaths = 0;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      totalPaths += posiblePaths([row, col], noRepeat);
    }
  }
  return totalPaths;
};

console.log("Part 1: ", routesCount(map, true));
console.log("Part 2:", routesCount(map));
