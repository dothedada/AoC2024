import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");

const map = data
  .split("\n")
  .filter((line) => line.trim())
  .map((row) => row.split(""));

const fieldsInventory = {};
const exploredFields = new Set();

const idGen = () => {
  const fieldsAmmount = [];
  return (fieldType) => {
    fieldsAmmount.push(fieldType);
    return `${fieldType}${fieldsAmmount.filter((e) => e === fieldType).length}`;
  };
};
const fieldIdGen = idGen();

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const diagonals = [
  [-1, 1],
  [1, 1],
  [1, -1],
  [-1, -1],
];

const findCorners = ([row, col], fieldId) => {
  let corner = 0;

  for (let side = 0; side < 4; side++) {
    const [side1row, side1col] = directions[side];
    const [side2row, side2col] = directions[(side + 1) % 4];
    const [diagonalRow, diagonalCol] = diagonals[side];

    const side1 = map?.[row + side1row]?.[col + side1col];
    const side2 = map?.[row + side2row]?.[col + side2col];
    const diagonal = map?.[row + diagonalRow]?.[col + diagonalCol];

    if (side1 !== fieldId[0] && side2 !== fieldId[0]) {
      corner++;
    }

    if (
      side1 === fieldId[0] &&
      side2 === fieldId[0] &&
      diagonal !== fieldId[0]
    ) {
      corner++;
    }
  }
  return corner;
};

const fieldFinder = ([row, col], fieldId) => {
  exploredFields.add(`${row}_${col}`);
  fieldsInventory[fieldId].area++;
  fieldsInventory[fieldId].sides += findCorners([row, col], fieldId);

  for (const [addRow, addCol] of directions) {
    const [newRow, newCol] = [row + addRow, col + addCol];

    if (exploredFields.has(`${newRow}_${newCol}`)) {
      if (map?.[newRow]?.[newCol] !== fieldId[0]) {
        fieldsInventory[fieldId].perimeter++;
      }
      continue;
    }

    if (map?.[newRow]?.[newCol] !== fieldId[0]) {
      fieldsInventory[fieldId].perimeter++;
    } else {
      fieldFinder([newRow, newCol], fieldId);
    }
  }
};

const fieldStart = ([row, col]) => {
  const fieldType = map[row][col];
  const fieldId = fieldIdGen(fieldType);
  fieldsInventory[fieldId] = { area: 0, perimeter: 0, sides: 0 };
  fieldFinder([row, col], fieldId);
};

const fieldSearch = () => {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (exploredFields.has(`${row}_${col}`)) {
        continue;
      }
      fieldStart([row, col]);
    }
  }
};

fieldSearch();

const getBudget = (inventory, parameter) => {
  let sum = 0;
  for (const field in inventory) {
    sum += inventory[field].area * inventory[field][parameter];
  }
  return sum;
};

console.log(fieldsInventory, "part1:", getBudget(fieldsInventory, "perimeter"));
console.log(fieldsInventory, "part2:", getBudget(fieldsInventory, "sides"));
