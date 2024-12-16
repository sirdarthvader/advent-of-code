import { readFileSync } from "fs";
import { join } from "path";

// Read and parse the input
const inputPath = join(__dirname, "input2.txt");
const lines = readFileSync(inputPath, "utf8").trim().split("\n");

const grid = lines.map((line) => line.split("").map(Number));

const rows = grid.length;
const cols = grid[0].length;

// Directions: up, down, left, right
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

// ways[r][c]: number of distinct hiking trails from cell (r,c) to any cell of height 9.
const ways: number[][] = Array.from({ length: rows }, () =>
  Array(cols).fill(0)
);

// Initialize for height=9 cells:
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] === 9) {
      ways[r][c] = 1;
    }
  }
}

// Compute ways for each height from 8 down to 0
for (let h = 8; h >= 0; h--) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === h) {
        let count = 0;
        // Sum ways of neighbors with height h+1
        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;
          if (inBounds(nr, nc) && grid[nr][nc] === h + 1) {
            count += ways[nr][nc];
          }
        }
        ways[r][c] = count;
      }
    }
  }
}

// Now sum the ratings of all trailheads (height=0)
let totalRating = 0;
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] === 0) {
      totalRating += ways[r][c];
    }
  }
}

// Print the sum of ratings
console.log(totalRating);
