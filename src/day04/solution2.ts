import * as fs from "fs";
import * as path from "path";

function countXMAS(grid: string[]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    { dx1: -1, dy1: -1, dx2: 1, dy2: 1 }, // Top-Left to Bottom-Right
    { dx1: -1, dy1: 1, dx2: 1, dy2: -1 }, // Top-Right to Bottom-Left
  ];

  let count = 0;

  function isXMAS(
    x: number,
    y: number,
    dx1: number,
    dy1: number,
    dx2: number,
    dy2: number
  ): boolean {
    return (
      isMAS(x + dx1, y + dy1, dx1, dy1) && isMAS(x + dx2, y + dy2, dx2, dy2)
    );
  }

  function isMAS(x: number, y: number, dx: number, dy: number): boolean {
    const pattern = "MAS";
    for (let i = 0; i < pattern.length; i++) {
      const newX = x + i * dx;
      const newY = y + i * dy;
      if (
        newX < 0 ||
        newX >= rows ||
        newY < 0 ||
        newY >= cols ||
        grid[newX][newY] !== pattern[i]
      ) {
        return false;
      }
    }
    return true;
  }

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (grid[x][y] === "A") {
        // 'A' is the center of the X-MAS
        for (const { dx1, dy1, dx2, dy2 } of directions) {
          if (isXMAS(x, y, dx1, dy1, dx2, dy2)) {
            count++;
          }
        }
      }
    }
  }

  return count;
}

// Read the input file
const filePath = path.join(__dirname, "input2.txt");
const grid = fs
  .readFileSync(filePath, "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.trim());

console.log("Total occurrences of X-MAS:", countXMAS(grid));
