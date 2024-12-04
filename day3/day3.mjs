import { readFileSync } from "fs";

const path = "./input.txt";
const rawData = readFileSync(path, "utf-8");

const matchers = {
  onOffMul: /do\(\)|don't\(\)|mul\((\d{1,3},\d{1,3})\)/g,
  mul: /mul\((\d{1,3},\d{1,3})\)/g,
};

const dataMarcher = (string, matcher) => string.match(matcher);
const multiplicator = (stringValue) => {
  const [, valueA, valueB] = stringValue.match(/(\d{1,3}),(\d{1,3})/);
  return +valueA * +valueB;
};
const adder = (array) =>
  array.map(multiplicator).reduce((acc, current) => {
    const add = acc + current;
    return add;
  }, 0);

const operationFilter = (array) => {
  let enable = true;
  const operations = [];

  for (const current of array) {
    if (/do\(\)/.test(current)) {
      enable = true;
    } else if (/don't\(\)/.test(current)) {
      enable = false;
    } else if (/^mu/.test(current) && enable) {
      operations.push(current);
    }
  }

  return operations;
};

const part1 = adder(dataMarcher(rawData, matchers.mul));
const part2 = adder(operationFilter(dataMarcher(rawData, matchers.onOffMul)));

console.log(part1, part2);
