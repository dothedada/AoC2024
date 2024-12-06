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

    prevPages.forEach((page) => {
      if (pageRules.after.has(page)) {
        aproved = false;
      }
    });

    if (!aproved) {
      break;
    }
  }

  if (aproved) {
    printableUpdates.push(update);
  }
}

const printableMiddleSum = printableUpdates.reduce((sum, current) => {
  return sum + +current[Math.floor(current.length / 2)];
}, 0);

console.log("part1:", printableMiddleSum);
