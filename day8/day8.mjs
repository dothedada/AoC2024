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
  let firstIndex = 0;
  let secondIndex = 1;

  while (true) {
    yield [locations[firstIndex], locations[secondIndex]];

    secondIndex++;
    if (secondIndex === locations.length) {
      firstIndex++;
      secondIndex = firstIndex + 1;
    }

    if (firstIndex >= locations.length - 1) {
      break;
    }
  }
}

const setAntinodes = (towerA, towerB, map) => {
  const mapHeight = map.length;
  const mapWidth = map[0].length;
  const [rowA, colA] = towerA;
  const [rowB, colB] = towerB;
  const antinodeARow = rowA + (rowA - rowB);
  const antinodeACol = colA + (colA - colB);
  const antinodeBRow = rowB + (rowB - rowA);
  const antinodeBCol = colB + (colB - colA);

  if (antinodeARow >= 0 && antinodeACol >= 0 && antinodeACol < mapWidth) {
    map[antinodeARow][antinodeACol] = "#";
  }
  if (
    antinodeBRow < mapHeight &&
    antinodeBCol >= 0 &&
    antinodeBCol < mapWidth
  ) {
    map[antinodeBRow][antinodeBCol] = "#";
  }
};
const setAntinodesHarmonics = (towerA, towerB, map) => {
  const mapHeight = map.length;
  const mapWidth = map[0].length;
  const [rowA, colA] = towerA;
  const [rowB, colB] = towerB;
  const diffARow = rowA - rowB;
  const diffACol = colA - colB;
  const diffBRow = rowB - rowA;
  const diffBCol = colB - colA;

  let currentA = [rowA, colA];
  let currentB = [rowB, colB];

  while (true) {
    if (
      currentA[0] + diffARow < 0 ||
      currentA[0] + diffARow >= mapHeight ||
      currentA[1] + diffACol < 0 ||
      currentA[1] + diffACol >= mapWidth
    ) {
      break;
    }
    map[currentA[0] + diffARow][currentA[1] + diffACol] = "#";
    currentA = [currentA[0] + diffARow, currentA[1] + diffACol];
  }

  while (true) {
    if (
      currentB[0] + diffBRow < 0 ||
      currentB[0] + diffBRow >= mapHeight ||
      currentB[1] + diffBCol < 0 ||
      currentB[1] + diffBCol >= mapWidth
    ) {
      break;
    }
    map[currentB[0] + diffBRow][currentB[1] + diffBCol] = "#";
    currentB = [currentB[0] + diffBRow, currentB[1] + diffBCol];
  }
};

const setAllAntinodes = (map) => {
  const antinodesMap = [...map];
  for (const towerType in towers) {
    const towerTypeRelations = iterateLocations(towers[towerType]);

    for (const towersPosition of towerTypeRelations) {
      const [towerA, towerB] = towersPosition;
      setAntinodes(towerA, towerB, antinodesMap);
    }
  }
  return antinodesMap;
};
const setAllAntinodesHarmonics = (map) => {
  const antinodesMap = [...map];
  for (const towerType in towers) {
    const towerTypeRelations = iterateLocations(towers[towerType]);

    for (const towersPosition of towerTypeRelations) {
      const [towerA, towerB] = towersPosition;
      setAntinodesHarmonics(towerA, towerB, antinodesMap);
    }
  }
  return antinodesMap;
};

const mapPart1 = setAllAntinodes(map)
  .map((row) => row.join(""))
  .join("")
  .replace(/[^#]/g, "").length;

const mapPart2 = setAllAntinodesHarmonics(map)
  .map((row) => row.join(""))
  .join("")
  .replace(/[.]/g, "").length;

console.log(mapPart1, mapPart2);
