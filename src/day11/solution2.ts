import { readFileSync } from "fs";
import { join } from "path";

// Read the input from input1.txt file
const inputFilePath = join(__dirname, "input2.txt");
const inputContent = readFileSync(inputFilePath, "utf-8");

// Parse the input into an array of numbers and convert it to a Map
const stonesMap = new Map<number, number>();
inputContent
  .trim()
  .split(/\s+/)
  .map(Number)
  .forEach((stone) => {
    stonesMap.set(stone, (stonesMap.get(stone) || 0) + 1);
  });

// Function to simulate one blink
function blink(stonesMap: Map<number, number>): Map<number, number> {
  const newStonesMap = new Map<number, number>();

  for (const [stone, count] of stonesMap) {
    if (stone === 0) {
      // Rule 1: Replace 0 with a stone engraved with 1
      newStonesMap.set(1, (newStonesMap.get(1) || 0) + count);
    } else if (stone.toString().length % 2 === 0) {
      // Rule 2: Split the stone into two stones with left and right halves of digits
      const stoneStr = stone.toString();
      const mid = Math.floor(stoneStr.length / 2);
      const left = parseInt(stoneStr.slice(0, mid), 10);
      const right = parseInt(stoneStr.slice(mid), 10);

      newStonesMap.set(left, (newStonesMap.get(left) || 0) + count);
      newStonesMap.set(right, (newStonesMap.get(right) || 0) + count);
    } else {
      // Rule 3: Multiply the number by 2024
      const transformed = stone * 2024;
      newStonesMap.set(
        transformed,
        (newStonesMap.get(transformed) || 0) + count
      );
    }
  }

  return newStonesMap;
}

// Simulate 75 blinks
const blinks = 75;
let currentStonesMap = stonesMap;

for (let i = 0; i < blinks; i++) {
  currentStonesMap = blink(currentStonesMap);
}

// Calculate the total number of stones
const totalStones = Array.from(currentStonesMap.values()).reduce(
  (sum, count) => sum + count,
  0
);

console.log(`After ${blinks} blinks, there are ${totalStones} stones.`);
