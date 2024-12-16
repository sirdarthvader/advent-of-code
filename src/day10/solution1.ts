import { readFileSync } from "fs";
import { join } from "path";

// Read and parse the input
const inputPath = join(__dirname, "input1.txt");
const lines = readFileSync(inputPath, "utf8").trim().split("\n");

const grid = lines.map((line) => line.split("").map(Number));

const rows = grid.length;
const cols = grid[0].length;

// Directions for up, down, left, right
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

interface Cell {
  r: number;
  c: number;
  height: number;
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

// Find all trailheads (cells with height 0)
const trailheads: Cell[] = [];
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] === 0) {
      trailheads.push({ r, c, height: 0 });
    }
  }
}

// For performance optimization (optional):
// We can use memoization to remember reachable '9's from a certain cell height pattern.
// The key could be cell coordinates and current height. When we discover reachable 9's from a certain start, we store it.
// If the map is large, memoization helps. Otherwise, we can skip for simplicity.

interface MemoKey {
  r: number;
  c: number;
  height: number;
}
const memo = new Map<string, Set<string>>();
// This maps from "r,c,height" to a set of "r,c" strings representing positions of reachable '9's.

// Convert coordinates to string keys
function posKey(r: number, c: number): string {
  return `${r},${c}`;
}
function memoKeyStr(r: number, c: number, h: number): string {
  return `${r},${c},${h}`;
}

function findReachableNines(startR: number, startC: number): Set<string> {
  // BFS or DFS starting from a 0 cell, looking for ascending paths.
  // We know start is height 0 here.
  const startHeight = grid[startR][startC];
  if (startHeight !== 0) {
    // Not a trailhead, return empty
    return new Set();
  }

  // We'll do a BFS that only moves from height h to h+1
  const visited = new Set<string>();
  const reachableNines = new Set<string>();

  const queue: [number, number, number][] = [];
  // Queue holds (r, c, height) - though height can be derived from grid[r][c].
  // We'll rely on grid for current height, so it's sufficient to store coordinates.
  queue.push([startR, startC, grid[startR][startC]]);
  visited.add(posKey(startR, startC));

  while (queue.length > 0) {
    const [cr, cc, ch] = queue.shift()!;
    if (ch === 9) {
      // Found a 9, record it
      reachableNines.add(posKey(cr, cc));
      // No need to continue from a 9, as you can't go higher.
      continue;
    }

    // Move to neighbors that are exactly ch+1
    for (const [dr, dc] of directions) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (inBounds(nr, nc)) {
        const nh = grid[nr][nc];
        if (nh === ch + 1) {
          const nKey = posKey(nr, nc);
          if (!visited.has(nKey)) {
            visited.add(nKey);
            queue.push([nr, nc, nh]);
          }
        }
      }
    }
  }

  return reachableNines;
}

// Calculate scores for all trailheads
let totalScore = 0;
for (const th of trailheads) {
  const score = findReachableNines(th.r, th.c).size;
  totalScore += score;
}

// Output the result
console.log(totalScore);
