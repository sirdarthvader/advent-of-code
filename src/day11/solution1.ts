import { readFileSync } from "fs";
import { join } from "path";

const inputPath = join(__dirname, "input1.txt");
const inputString = readFileSync(inputPath, "utf-8");

let stones = inputString.trim().split(/\s+/).map(Number);

// Function to simulate one blink
function blink(stones: number[]): number[] {
  const newStones: number[] = [];

  for (const stone of stones) {
    if (stone === 0) {
      // Rule 1: Replace 0 with a stone engraved with 1
      newStones.push(1);
    } else if (stone.toString().length % 2 === 0) {
      // Rule 2: Split the stone into two stones with left and right halves of digits
      const stoneStr = stone.toString();
      const mid = Math.floor(stoneStr.length / 2);
      const left = parseInt(stoneStr.slice(0, mid), 10);
      const right = parseInt(stoneStr.slice(mid), 10);
      newStones.push(left, right);
    } else {
      // Rule 3: Multiply the number by 2024
      newStones.push(stone * 2024);
    }
  }

  return newStones;
}

// Simulate 25 blinks
const blinks = 25;
for (let i = 0; i < blinks; i++) {
  stones = blink(stones);
}

console.log(`After ${blinks} blinks, there are ${stones.length} stones.`);
