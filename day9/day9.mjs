import { readFileSync } from "fs";

const path = "./input.txt";
const data = readFileSync(path, "utf-8");

// iniciar variables
const diskMap = data.split("").map((str) => +str);
const diskData = (diskMap) => {
  const diskData = [];
  let id = 0;
  for (let diskIndex = 0; diskIndex < diskMap.length; diskIndex++) {
    if (diskIndex % 2 === 0) {
      diskData.push(...Array(diskMap[diskIndex]).fill(id));
      id++;
      // id %= 10;
    } else {
      diskData.push(...Array(diskMap[diskIndex]).fill("."));
    }
  }
  return diskData;
};

const swapMemory = (dataInd, spaceInd, disk) => {
  [disk[dataInd], disk[spaceInd]] = [disk[spaceInd], disk[dataInd]];
};

const orderDisk = (disk) => {
  const newDisk = [...disk];
  let firstSpaceIndex = newDisk.findIndex((space) => /[.]/.test(space));
  let lastDataIndex = newDisk.findLastIndex((space) => /[0-9]/.test(space));
  while (firstSpaceIndex < lastDataIndex) {
    swapMemory(lastDataIndex, firstSpaceIndex, newDisk);
    firstSpaceIndex = newDisk.findIndex((space) => /[.]/.test(space));
    lastDataIndex = newDisk.findLastIndex((space) => /[0-9]/.test(space));
  }
  return newDisk;
};

const cleanSpace = (disk) => disk.filter((data) => /[^.]/.test(data));

const checksum = (disk) => {
  return disk.reduce((sum, id, index) => {
    const dataValue = id * index;
    const checkSum = dataValue + sum;
    return checkSum;
  }, 0);
};

const disk = diskData(diskMap);
const orderedDisk = orderDisk(disk);
const cleanedDisk = cleanSpace(orderedDisk);
const dataValue = checksum(cleanedDisk);

console.log(cleanedDisk, dataValue);
