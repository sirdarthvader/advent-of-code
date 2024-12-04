// Day 4: Ceres Search — counting all instances of the word "XMAS" in the grid.
/**
 * Plan:
- Grid traversal: Iterate through every cell.
- Direction handling: Check for "XMAS" in all 8 directions: horizontal, vertical, diagonal, and reverse.
- Edge checking: Ensure no out-of-bound accesses when verifying letters.
 */

import * as fs from "fs";
import * as path from "path";

function countXMAS(grid: string[]): number {
  const directions = [
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
    [-1, 0], // Up
    [1, 1], // Diagonal Down-Right
    [1, -1], // Diagonal Down-Left
    [-1, 1], // Diagonal Up-Right
    [-1, -1], // Diagonal Up-Left
  ];

  const rows = grid.length;
  const cols = grid[0].length;
  const target = "XMAS";
  let count = 0;

  function isXMAS(x: number, y: number, dx: number, dy: number): boolean {
    for (let i = 0; i < target.length; i++) {
      const newX = x + i * dx;
      const newY = y + i * dy;
      if (
        newX < 0 ||
        newX >= rows ||
        newY < 0 ||
        newY >= cols ||
        grid[newX][newY] !== target[i]
      ) {
        return false;
      }
    }
    return true;
  }

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (grid[x][y] === "X") {
        for (const [dx, dy] of directions) {
          if (isXMAS(x, y, dx, dy)) {
            count++;
          }
        }
      }
    }
  }

  return count;
}

// Read the input file
const filePath = path.join(__dirname, "input1.txt");
const grid = fs
  .readFileSync(filePath, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.trim());

console.log("Total occurrences of XMAS:", countXMAS(grid));
