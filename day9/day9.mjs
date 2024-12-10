import { readFileSync } from "fs";

const path = "./test.txt";
const data = readFileSync(path, "utf-8");

const diskMap = data.split("").map((str) => +str);
const diskData = (diskMap) => {
  const diskData = [];
  let id = 0;
  for (let diskIndex = 0; diskIndex < diskMap.length; diskIndex++) {
    if (diskIndex % 2 === 0) {
      diskData.push(...Array(diskMap[diskIndex]).fill(id));
      id++;
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

const getDataSize = (endIndex, value, disk) => {
  let currentIndex = endIndex;
  while (disk[currentIndex] === value) {
    currentIndex--;
  }
  return endIndex - currentIndex;
};

const allocateSpace = (chunkSize, disk, limit) => {
  let startIndex = -1;
  let currentSize = 0;

  for (let i = 0; i < limit; i++) {
    if (disk[i] === ".") {
      if (startIndex === -1) {
        startIndex = i;
      }
      if (++currentSize === chunkSize) {
        return startIndex;
      }
    } else {
      startIndex = -1;
      currentSize = 0;
    }
  }

  return null;
};

const orderDiskUnfragmented = (disk) => {
  const newDisk = [...disk];

  let currenSector = newDisk.length - 1;
  let curretnSwap = 0;
  let availableSpaceIndex = null;

  while (currenSector >= 0) {
    if (/[0-9]/.test(newDisk[currenSector])) {
      if (!curretnSwap) {
        curretnSwap = getDataSize(currenSector, newDisk[currenSector], newDisk);
        availableSpaceIndex = allocateSpace(curretnSwap, newDisk, currenSector);
      }
      if (availableSpaceIndex === null) {
        currenSector = currenSector - curretnSwap;
        curretnSwap = 0;
        continue;
      }

      curretnSwap--;
      swapMemory(currenSector, availableSpaceIndex + curretnSwap, newDisk);
    } else {
      curretnSwap = 0;
    }
    currenSector--;
  }

  return newDisk;
};

const checksum = (disk) => {
  return disk.reduce((sum, id, index) => {
    if (id === ".") {
      return sum;
    }
    const dataValue = id * index;
    const checkSum = dataValue + sum;
    return checkSum;
  }, 0);
};

const disk = diskData(diskMap);
const orderedDisk = orderDisk(disk);
const dataValue = checksum(orderedDisk);

const orderedUnfragmented = orderDiskUnfragmented(disk);
const unfragmentedValue = checksum(orderedUnfragmented);

console.log(dataValue, unfragmentedValue);
