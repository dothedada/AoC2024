import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");

const map = data
  .split("\n")
  .filter((e) => e.trim())
  .map((rows) => rows.split(""));

const getTowerLoactions = (towerType) => {
  const locations = [];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (map[row][col] === towerType) {
        locations.push([row, col]);
      }
    }
  }
  return locations;
};

const towers = {};
const towerTypes = new Set([...map.flat().filter((e) => /[^.]/.test(e))]);
for (const towerType of towerTypes) {
  towers[towerType] = getTowerLoactions(towerType);
}

function* iterateLocations(locations) {
  for (let i = 0; i < locations.length - 1; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      yield [locations[i], locations[j]];
    }
  }
}

const setAntinode = (startRow, startCol, difRow, difCol, harmonics, map) => {
  const mapHeight = map.length;
  const mapWidth = map[0].length;
  let current = [startRow, startCol];

  while (true) {
    if (
      current[0] + difRow < 0 ||
      current[0] + difRow >= mapHeight ||
      current[1] + difCol < 0 ||
      current[1] + difCol >= mapWidth
    ) {
      break;
    }
    map[current[0] + difRow][current[1] + difCol] = "#";
    current = [current[0] + difRow, current[1] + difCol];

    if (!harmonics) {
      break;
    }
  }
};

const setAntinodes = (towerA, towerB, map, harmonics) => {
  const [rowA, colA] = towerA;
  const [rowB, colB] = towerB;
  const beforeDifRow = rowA - rowB;
  const beforeDifCol = colA - colB;
  const afterDifRow = rowB - rowA;
  const afterDifCol = colB - colA;

  setAntinode(rowA, colA, beforeDifRow, beforeDifCol, harmonics, map);
  setAntinode(rowB, colB, afterDifRow, afterDifCol, harmonics, map);
};

const processAntinodes = (map, harmonics) => {
  const antinodesMap = [...map];
  for (const towerType in towers) {
    const towerTypeRelations = iterateLocations(towers[towerType]);

    for (const towersPosition of towerTypeRelations) {
      const [towerA, towerB] = towersPosition;
      setAntinodes(towerA, towerB, antinodesMap, harmonics);
    }
  }
  return antinodesMap;
};

const mapPart1 = processAntinodes(map, false)
  .map((row) => row.join(""))
  .join("")
  .replace(/[^#]/g, "").length;

const mapPart2 = processAntinodes(map, true)
  .map((row) => row.join(""))
  .join("")
  .replace(/[.]/g, "").length;

console.log("part1:", mapPart1, "part2:", mapPart2);
