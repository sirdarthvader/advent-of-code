import * as fs from "fs";
import * as path from "path";

function isValidUpdate(update: number[], rules: [number, number][]): boolean {
  const positionMap: Record<number, number> = {};

  // Map each page number to its position in the update sequence
  update.forEach((page, index) => {
    positionMap[page] = index;
  });

  // Check all applicable rules
  for (const [pageX, pageY] of rules) {
    if (
      pageX in positionMap &&
      pageY in positionMap &&
      positionMap[pageX] >= positionMap[pageY]
    ) {
      return false; // Rule violated
    }
  }
  return true; // All rules satisfied
}

function processInput(filePath: string): void {
  const data = fs.readFileSync(filePath, "utf-8").trim().split("\n\n"); // Split into rules and updates sections

  const rules = data[0]
    .split("\n")
    .map((line) => line.split("|").map(Number) as [number, number]);
  const updates = data[1]
    .split("\n")
    .map((line) => line.split(",").map(Number));

  let validMiddleSum = 0;

  for (const update of updates) {
    if (isValidUpdate(update, rules)) {
      const middleIndex = Math.floor(update.length / 2);
      validMiddleSum += update[middleIndex];
    }
  }

  console.log("Sum of middle pages in valid updates:", validMiddleSum);
}

// Read the input file
const filePath = path.join(__dirname, "input1.txt");
processInput(filePath);
