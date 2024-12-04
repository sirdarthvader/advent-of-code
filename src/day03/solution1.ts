import { readFileSync } from "fs";
import { join } from "path";

// Function to extract and process valid mul(X,Y) instructions
function calculateValidMultiplications(input: string): number {
  const pattern = /mul\(\d{1,3},\d{1,3}\)/g; // Regex to match 'mul(X,Y)'
  const matches = input.match(pattern) || []; // Find all matches or empty array

  // Calculate sum of all valid multiplications
  const totalSum = matches.reduce((sum, match) => {
    const [x, y] = match
      .slice(4, -1) // Remove 'mul(' and ')'
      .split(",")
      .map(Number); // Convert to numbers

    return sum + x * y; // Add product to sum
  }, 0);

  return totalSum;
}

// Read input from 'input3.txt'
const inputPath = join(__dirname, "input1.txt");
const input = readFileSync(inputPath, "utf8");

// Process and output result
const result = calculateValidMultiplications(input);
console.log("Total Sum of Valid Multiplications:", result);
