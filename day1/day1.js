const fs = require("fs");

const path = "./input.txt";
let file = "";

try {
  file = fs.readFileSync(path, "utf-8");
} catch (err) {
  console.error("No pudo cargar el archivo", err);
}

const listA = [];
const listB = [];

const lists = file.split("\n");
for (let i = 0; i < lists.length - 1; i++) {
  const [left, right] = lists[i].replace(/ +/, " ").split(" ");
  listA.push(left);
  listB.push(right);
}

listA.sort((a, b) => a - b);
listB.sort((a, b) => a - b);

let difference = 0;

for (let i = 0; i < listA.length; i++) {
  difference += Math.abs(listB[i] - listA[i]);
}

let similaridad = 0;

for (let i = 0; i < listA.length; i++) {
  const ammount = listB.filter((e) => e === listA[i]).length;
  similaridad += listA[i] * ammount;
}

console.log("diferencia:", difference, "similaridad:", similaridad);
