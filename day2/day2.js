const fs = require("fs");

let data = "";

try {
  data = fs.readFileSync("./input.txt", "utf-8");
} catch (err) {
  console.error("error al cargar el archivo", err);
}

const dataLines = data.split("\n").slice(0, -1);

const directionEval = (line = "") => {
  const lineNumbers = line.split(" ");
  let current = 1;
  let ascending = 0;
  let descending = 0;
  let neutral = 0;
  while (current < lineNumbers.length) {
    if (lineNumbers[current] - lineNumbers[current + 1] > 0) {
      descending++;
    } else if (lineNumbers[current] - lineNumbers[current + 1] < 0) {
      ascending++;
    } else {
      neutral++;
    }
    current++;
  }

  return ascending > descending;
};

const lineEval = (line = "") => {
  const lineNumbers = line.split(" ");
  let current = 1;
  let isSafe = true;
  let damper = true;

  const isAscending = directionEval(line);

  while (current < lineNumbers.length) {
    const left = +lineNumbers[current - 1];
    const right = +lineNumbers[current];

    const difference = Math.abs(left - right);
    const numberDirection = left - right < 0;

    if (difference > 3 || difference < 1 || numberDirection !== isAscending) {
      isSafe = damper;
      if (!isSafe) {
        break;
      }
      damper = false;
      current++;
    }

    current++;
  }

  return isSafe;
};

const safeReports = dataLines.map(lineEval).filter((line) => line).length;

console.log(safeReports);
