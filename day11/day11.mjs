import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");

const stones = data.replace("\n", "").split(" ").map(Number);
let stonesMap = new Map();
for (const stone of stones) {
  stonesMap.set(stone, (stonesMap.get(stone) || 0) + 1);
}

const stoneParser = (stone) => {
  const stoneToken = {};
  if (stone === 0) {
    stoneToken.mutation = "make";
    stoneToken.value = 0;
  } else if (`${stone}`.length % 2 === 0) {
    stoneToken.mutation = "splitStone";
    stoneToken.value = `${stone}`;
  } else {
    stoneToken.mutation = "multiply";
    stoneToken.value = stone;
  }
  return stoneToken;
};

const renderFunction = {
  make: () => 1,
  splitStone: (value = "") => {
    const left = value.slice(0, value.length / 2);
    const right = value.slice(value.length / 2);

    return [+left, +right];
  },
  multiply: (value) => value * 2024,
};

const stoneRender = (stoneToken) => {
  const { mutation, value } = stoneToken;
  return renderFunction[mutation](value);
};

const blinker = (data = new Map(), blinks) => {
  let stones = new Map();
  for (const [stone] of data) {
    if (stones.has(stone)) {
      stones.set(stone, stones.get(stone) + 1);
    } else {
      stones.set(stone, 1);
    }
  }

  for (let blink = 0; blink < blinks; blink++) {
    let newStones = new Map();
    stones.forEach((ammounStones, stone) => {
      let newStonesArray = [];
      const stoneToken = stoneParser(stone);
      newStonesArray.push(stoneRender(stoneToken));

      for (const newStone of newStonesArray.flat()) {
        newStones.set(newStone, (newStones.get(newStone) || 0) + ammounStones);
      }
    });
    stones = newStones;
  }
  return stones;
};

const stonesAmmount = (initialStones, blinkAmmount) => {
  const stonesMap = blinker(initialStones, blinkAmmount);
  let counter = 0;
  stonesMap.forEach((stone) => {
    counter += stone;
  });

  return counter;
};

console.log("Part1:", stonesAmmount(stonesMap, 25));
console.log("Part2:", stonesAmmount(stonesMap, 75));
