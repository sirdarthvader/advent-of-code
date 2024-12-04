import { readFileSync } from "fs";
import { join } from "path";

function calculateConditionalMultiplications(input: string): number {
  const pattern = /(do\(\)|don't\(\)|mul\(\d{1,3},\d{1,3}\))/g; // Match all relevant instructions
  const instructions = input.match(pattern) || []; // Extract all valid instructions

  let isEnabled = true; // Start with multiplications enabled
  let totalSum = 0;

  for (const instr of instructions) {
    if (instr === "do()") {
      isEnabled = true; // Enable future multiplications
    } else if (instr === "don't()") {
      isEnabled = false; // Disable future multiplications
    } else if (isEnabled && instr.startsWith("mul(")) {
      // Process enabled mul instructions
      const [x, y] = instr.slice(4, -1).split(",").map(Number);
      totalSum += x * y;
    }
  }

  return totalSum;
}

// Read input from 'input3.txt'
const inputPath = join(__dirname, "input2.txt");
const input = readFileSync(inputPath, "utf8");

// Process and output result
const result = calculateConditionalMultiplications(input);
console.log("Total Sum of Enabled Multiplications:", result);
