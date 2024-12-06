import * as fs from "fs";
import * as path from "path";

type Direction = "^" | ">" | "v" | "<";
type Position = [number, number];

function parseInput(map: string[]): {
  grid: string[][];
  start: Position;
  direction: Direction;
} {
  let start: Position = [-1, -1];
  let direction: Direction = "^";
  const grid = map.map((line, rowIndex) => {
    return line.split("").map((char, colIndex) => {
      if (["^", ">", "v", "<"].includes(char)) {
        start = [rowIndex, colIndex];
        direction = char as Direction;
        return ".";
      }
      return char;
    });
  });
  return { grid, start, direction };
}

function simulatePatrol(
  grid: string[][],
  start: Position,
  initialDirection: Direction
): number {
  const visited = new Set<string>();
  let [x, y] = start;
  let direction = initialDirection;

  // Directional movement: [dx, dy] for '^', '>', 'v', '<'
  const moves: Record<Direction, [number, number]> = {
    "^": [-1, 0],
    ">": [0, 1],
    v: [1, 0],
    "<": [0, -1],
  };

  // Function to turn right 90 degrees
  const turnRight: Record<Direction, Direction> = {
    "^": ">",
    ">": "v",
    v: "<",
    "<": "^",
  };

  while (true) {
    visited.add(`${x},${y}`);
    const [dx, dy] = moves[direction];
    const [nextX, nextY] = [x + dx, y + dy];

    // Check if the guard is moving out of bounds
    if (
      nextX < 0 ||
      nextX >= grid.length ||
      nextY < 0 ||
      nextY >= grid[0].length
    ) {
      break;
    }

    // Check if there's an obstacle
    if (grid[nextX][nextY] === "#") {
      direction = turnRight[direction]; // Turn right
    } else {
      // Move forward
      x = nextX;
      y = nextY;
    }
  }

  return visited.size;
}

// Main Function
function main() {
  const inputPath = path.resolve(__dirname, "input1.txt");
  const input = fs.readFileSync(inputPath, "utf-8").trim().split("\n");

  const { grid, start, direction } = parseInput(input);
  const result = simulatePatrol(grid, start, direction);

  console.log("Distinct positions visited:", result);
}

main();
