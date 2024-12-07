// --- Part Two ---
// The engineers seem concerned; the total calibration result you gave them is nowhere close to being within safety tolerances. Just then, you spot your mistake: some well-hidden elephants are holding a third type of operator.

// The concatenation operator (||) combines the digits from its left and right inputs into a single number. For example, 12 || 345 would become 12345. All operators are still evaluated left-to-right.

// Now, apart from the three equations that could be made true using only addition and multiplication, the above example has three more equations that can be made true by inserting operators:

// 156: 15 6 can be made true through a single concatenation: 15 || 6 = 156.
// 7290: 6 8 6 15 can be made true using 6 * 8 || 6 * 15.
// 192: 17 8 14 can be made true using 17 || 8 + 14.
// Adding up all six test values (the three that could be made before using only + and * plus the new three that can now be made by also using ||) produces the new total calibration result of 11387.

// Using your new knowledge of elephant hiding spots, determine which equations could possibly be true. What is their total calibration result?

import * as fs from "fs";
import * as path from "path";

function calculateTotalCalibrationWithConcat(filePath: string): number {
  // Helper function to compute all combinations of operators
  function computeWithOperators(
    numbers: number[],
    operators: string[]
  ): number {
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === "+") {
        result += numbers[i + 1];
      } else if (operators[i] === "*") {
        result *= numbers[i + 1];
      } else if (operators[i] === "||") {
        result = parseInt(`${result}${numbers[i + 1]}`, 10);
      }
    }
    return result;
  }

  // Generate all combinations of operators for a given number of slots
  function generateOperatorsCombinations(slots: number): string[][] {
    if (slots === 0) return [[]];
    const smallerCombinations = generateOperatorsCombinations(slots - 1);
    return smallerCombinations.flatMap((combination) => [
      [...combination, "+"],
      [...combination, "*"],
      [...combination, "||"],
    ]);
  }

  let totalCalibration = 0;

  // Read the input file
  const input = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
  const equations = input
    .trim()
    .split("\n")
    .map((line) => {
      const [testValueStr, numbersStr] = line.split(": ");
      const testValue = parseInt(testValueStr, 10);
      const numbers = numbersStr.split(" ").map(Number);
      return { testValue, numbers };
    });

  // Process each equation
  for (const { testValue, numbers } of equations) {
    const operatorSlots = numbers.length - 1;
    const operatorCombinations = generateOperatorsCombinations(operatorSlots);
    let isValid = false;

    for (const operators of operatorCombinations) {
      const result = computeWithOperators(numbers, operators);
      if (result === testValue) {
        isValid = true;
        break;
      }
    }

    if (isValid) {
      totalCalibration += testValue;
    }
  }

  return totalCalibration;
}

// Example usage
const filePath = "input2.txt"; // Ensure this file is at the same level as the script
console.log(
  `Total Calibration Result with Concatenation: ${calculateTotalCalibrationWithConcat(
    filePath
  )}`
);
