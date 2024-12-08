import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");

const operations = data
  .split("\n")
  .filter((e) => e.trim())
  .map((operation) => {
    const [result, operands] = operation.split(":");

    return [
      +result,
      operands
        .split(" ")
        .filter((e) => e.trim())
        .map((operand) => +operand.trim()),
    ];
  });

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const concat = (a, b) => +`${a}${b}`;
const arithmetics = [add, multiply, concat];

function* testSecuence(numbers, arithmetics) {
  const operationsSecuence = Array(numbers.length - 1).fill(0);
  const operationsLength = arithmetics.length;

  while (true) {
    yield operationsSecuence;

    if (operationsSecuence.every((e) => e === operationsLength - 1)) {
      break;
    }

    let carry = 0;
    for (let i = 0; i < operationsSecuence.length; i++) {
      operationsSecuence[i] += i === 0 ? 1 : carry;
      carry = 0;

      if (operationsSecuence[i] % operationsLength === 0) {
        carry++;
        operationsSecuence[i] = 0;
      }

      if (carry === 0) {
        break;
      }
    }
  }
}

const operationResults = (operation) => {
  const [result, numbers] = operation;
  const arithmeticsSecuence = testSecuence(numbers, arithmetics);

  const posibleOperations = [];

  while (true) {
    const { value: currrentSecuence, done } = arithmeticsSecuence.next();
    if (done) {
      break;
    }

    let accummulator = 0;
    for (let i = 0; i < numbers.length - 1; i++) {
      const firstOperand = i === 0 ? numbers[i] : accummulator;
      const secondOperand = numbers[i + 1];
      accummulator = arithmetics[currrentSecuence[i]](
        firstOperand,
        secondOperand,
      );
    }

    if (accummulator === result) {
      posibleOperations.push(true);
    }
  }

  return posibleOperations.length;
};

const result = operations
  .map((operation) => {
    if (operationResults(operation)) {
      const [expect] = operation;
      return expect;
    }
  })
  .filter((e) => e)
  .reduce((acc, cur) => acc + cur, 0);

console.log(result);
