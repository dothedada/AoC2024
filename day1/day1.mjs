import { readFileSync } from "fs";

const path = "./input.txt";
const rawData = readFileSync(path, "utf-8");

const listA = [];
const listB = [];
const segmentedFile = rawData.split("\n").filter((line) => line.trim() !== "");

for (const line of segmentedFile) {
  const [, left, right] = line.match(/(\d+) +(\d+)/);
  listA.push(+left);
  listB.push(+right);
}
listA.sort();
listB.sort();

let difference = 0;
let similarity = 0;

for (let i = 0; i < listA.length; i++) {
  difference += Math.abs(listA[i] - listB[i]);
  const appearances = listB.filter((element) => element === listA[i]).length;
  similarity += listA[i] * appearances;
}

console.log("dif:", difference, " sim:", similarity);
