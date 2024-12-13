import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");
const tokenACost = 3;
const tokenBCost = 1;

const arcadeConfiguration = (data) => {
  const regex = /([ABP])\S*: +X.([0-9]+).+Y.([0-9]+)/;
  const lines = data.split("\n").filter((e) => e.trim());
  return lines.reduce((object, line) => {
    const [, name, x, y] = line.match(regex);
    object[name] = { x: +x, y: +y };
    return object;
  }, {});
};

const dataArcades = data
  .split("\n\n")
  .filter((e) => e.trim())
  .map(arcadeConfiguration);

const intersection = (bX, aX, cX, bY, aY, cY) => {
  const tokensA = (bX * cY - bY * cX) / (bY * aX - bX * aY);
  const tokensB = (aX * tokensA + cX) / bX;
  if ([tokensA, tokensB].every((d) => d > 0 && Number.isInteger(d))) {
    return [tokensA, tokensB];
  }
};

const calcToken = (arcades, d = 0) => {
  return arcades.reduce((acc, { A, B, P }) => {
    const r = intersection(B.x, -1 * A.x, P.x + d, B.y, -1 * A.y, P.y + d);
    return r ? r[0] * tokenACost + r[1] * tokenBCost + acc : acc;
  }, 0);
};

console.log(calcToken(dataArcades));
console.log(calcToken(dataArcades, 10000000000000));
