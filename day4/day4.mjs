import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");
const dataLines = data.split("\n").map((line) => `${line}_`);
const lineLength = dataLines[0].length;
const dataStream = dataLines.join("").split("");
const searchFor = ["X", "M", "A", "S"];

const paths = {
  up: (current) => current - lineLength,
  upRight: (current) => current - lineLength + 1,
  right: (current) => current + 1,
  downRight: (current) => current + lineLength + 1,
  down: (current) => current + lineLength,
  downLeft: (current) => current + lineLength - 1,
  left: (current) => current - 1,
  upLeft: (current) => current - lineLength - 1,
};

let timesXMASfound = 0;
const searchPath = (path, baseIndex, stringIndex) => {
  const nextCharToLook = searchFor[stringIndex + 1];
  const nextCell = path(baseIndex);
  const nextCharInPath = dataStream[nextCell];

  if (!nextCharToLook) {
    timesXMASfound++;
    return;
  }

  if (nextCharInPath === nextCharToLook) {
    searchPath(path, nextCell, stringIndex + 1);
  }

  return;
};

let timesX_MASfound = 0;
const checkNeighbors = (current, stream) => {
  const neighbors = [
    stream[paths.upLeft(current)],
    stream[paths.upRight(current)],
    stream[paths.downRight(current)],
    stream[paths.downLeft(current)],
  ];

  if (
    neighbors.filter((char) => char === "M").length === 2 &&
    neighbors.filter((char) => char === "S").length === 2
  ) {
    const firstM = neighbors.indexOf("M");
    const lastM = neighbors.lastIndexOf("M");
    const diffM = Math.abs(firstM - lastM);

    return diffM === 2 ? 0 : 1;
  }
  return 0;
};

dataStream.forEach((char, index) => {
  if (char === searchFor[0]) {
    for (const direction in paths) {
      searchPath(paths[direction], index, 0);
    }
  }
  if (char === "A") {
    timesX_MASfound += checkNeighbors(index, dataStream);
  }
});

console.log("xmas:", timesXMASfound, "x-mas:", timesX_MASfound);
