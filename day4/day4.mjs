import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");

const searchFor = ["X", "M", "A", "S"];
const dataLines = data.split("\n").map((line) => {
  // return `${line}`;
  return `---${line}---`;
});
const lineLength = dataLines[0].length;
const dataStream = dataLines.join("").split("");

const up = (current) => current - lineLength;
const upRight = (current) => current - lineLength + 1;
const right = (current) => current + 1;
const downRight = (current) => current + lineLength + 1;
const down = (current) => current + lineLength;
const downLeft = (current) => current + lineLength - 1;
const left = (current) => current - 1;
const upLeft = (current) => current - lineLength - 1;

const checkNeighbors = (current, stream) => {
  const neighbors = [
    stream[upLeft(current)],
    stream[upRight(current)],
    stream[downRight(current)],
    stream[downLeft(current)],
  ];

  if (
    neighbors.filter((char) => char === "M").length === 2 &&
    neighbors.filter((char) => char === "S").length === 2
  ) {
    const firstM = neighbors.indexOf("M");
    const lastM = neighbors.lastIndexOf("M");
    const diffM = Math.abs(firstM - lastM);

    console.log(neighbors, diffM, stream[current]);
    return diffM === 2 ? 0 : 1;
  }
  return 0;
};

const paths = [up, upRight, right, downRight, down, downLeft, left, upLeft];

let timesFound = 0;

const searchPath = (path, baseIndex, stringIndex) => {
  const nextCharToLook = searchFor[stringIndex + 1];
  const nextCell = path(baseIndex);
  const nextCharInPath = dataStream[nextCell];

  if (!nextCharToLook) {
    timesFound++;
    return;
  }

  if (nextCharInPath === nextCharToLook) {
    searchPath(path, nextCell, stringIndex + 1);
  }

  return;
};

dataStream.forEach((char, index) => {
  if (char === searchFor[0]) {
    for (const path of paths) {
      searchPath(path, index, 0);
    }
  }
});

let timesXfound = 0;

dataStream.forEach((char, index) => {
  if (char === "A") {
    timesXfound += checkNeighbors(index, dataStream);
  }
});

console.log(timesFound, timesXfound);
