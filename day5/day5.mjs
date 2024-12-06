import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");

const [rules, cases] = data.split("\n\n");

const ruleSet = {};

for (const rule of rules.split("\n").filter((rule) => rule.trim())) {
  const [before, after] = rule.split("|");

  if (!ruleSet[before]) {
    ruleSet[before] = { before: new Set(), after: new Set() };
  }
  if (!ruleSet[after]) {
    ruleSet[after] = { before: new Set(), after: new Set() };
  }

  ruleSet[before].after.add(after);
  ruleSet[after].before.add(before);
}

const updates = cases
  .split("\n")
  .filter((line) => line.trim())
  .map((line) => line.split(","));

const printableUpdates = [];
const updatesToFix = [];

for (const update of updates) {
  let aproved = true;

  for (let i = 0; i < update.length; i++) {
    const page = update[i];
    const pageRules = ruleSet[page];
    const nextPages = update.slice(i + 1);
    const prevPages = update.slice(0, i);

    nextPages.forEach((page) => {
      if (pageRules.before.has(page)) {
        aproved = false;
      }
    });

    // prevPages.forEach((page) => {
    //   if (pageRules.after.has(page)) {
    //     aproved = false;
    //   }
    // });

    if (!aproved) {
      break;
    }
  }

  if (aproved) {
    printableUpdates.push(update);
  } else {
    updatesToFix.push(update);
  }
}

const printableMiddleSum = printableUpdates.reduce((sum, current) => {
  return sum + +current[Math.floor(current.length / 2)];
}, 0);

// part 2

const fixUpdate = (update) => {
  let updateToFix = [...update];
  let pageIndex = 0;
  let aproved = false;

  while (!aproved) {
    const currentPage = updateToFix[pageIndex];
    const rules = ruleSet[currentPage];
    const nextPages = updateToFix.slice(pageIndex + 1);

    nextPages.forEach((page, index) => {
      if (rules.before.has(page)) {
        updateToFix.splice(pageIndex + 1 + index, 1);
        updateToFix.splice(pageIndex, 0, page);
      }
    });

    prevPages.forEach((page, index) => {
      if (rules.after.has(page)) {
        updateToFix.splice(index, 1);
        updateToFix.splice(pageIndex + 1, 0, page);
      }
    });

    pageIndex++;
  }

  return updateToFix;
};

const fixedMiddleSum = updatesToFix.map(fixUpdate).reduce((sum, current) => {
  return sum + +current[Math.floor(current.length / 2)];
}, 0);

console.log("part1:", printableMiddleSum); // Part 1: 6034;
console.log("part2:", fixedMiddleSum); // Part 1: 6034;
