// --- Day 6: Guard Gallivant ---
// --- Part Two ---
// While The Historians begin working around the guard's patrol route, you borrow their fancy device and step outside the lab. From the safety of a supply closet, you time travel through the last few months and record the nightly status of the lab's guard post on the walls of the closet.

// Returning after what seems like only a few seconds to The Historians, they explain that the guard's patrol area is simply too large for them to safely search the lab without getting caught.

// Fortunately, they are pretty sure that adding a single new obstruction won't cause a time paradox. They'd like to place the new obstruction in such a way that the guard will get stuck in a loop, making the rest of the lab safe to search.

// To have the lowest chance of creating a time paradox, The Historians would like to know all of the possible positions for such an obstruction. The new obstruction can't be placed at the guard's starting position - the guard is there right now and would notice.

// In the above example, there are only 6 different positions where a new obstruction would cause the guard to get stuck in a loop. The diagrams of these six situations use O to mark the new obstruction, | to show a position where the guard moves up/down, - to show a position where the guard moves left/right, and + to show a position where the guard moves both up/down and left/right.

// Option one, put a printing press next to the guard's starting position:

// ....#.....
// ....+---+#
// ....|...|.
// ..#.|...|.
// ....|..#|.
// ....|...|.
// .#.O^---+.
// ........#.
// #.........
// ......#...
// Option two, put a stack of failed suit prototypes in the bottom right quadrant of the mapped area:

// ....#.....
// ....+---+#
// ....|...|.
// ..#.|...|.
// ..+-+-+#|.
// ..|.|.|.|.
// .#+-^-+-+.
// ......O.#.
// #.........
// ......#...
// Option three, put a crate of chimney-squeeze prototype fabric next to the standing desk in the bottom right quadrant:

// ....#.....
// ....+---+#
// ....|...|.
// ..#.|...|.
// ..+-+-+#|.
// ..|.|.|.|.
// .#+-^-+-+.
// .+----+O#.
// #+----+...
// ......#...
// Option four, put an alchemical retroencabulator near the bottom left corner:

// ....#.....
// ....+---+#
// ....|...|.
// ..#.|...|.
// ..+-+-+#|.
// ..|.|.|.|.
// .#+-^-+-+.
// ..|...|.#.
// #O+---+...
// ......#...
// Option five, put the alchemical retroencabulator a bit to the right instead:

// ....#.....
// ....+---+#
// ....|...|.
// ..#.|...|.
// ..+-+-+#|.
// ..|.|.|.|.
// .#+-^-+-+.
// ....|.|.#.
// #..O+-+...
// ......#...
// Option six, put a tank of sovereign glue right next to the tank of universal solvent:

// ....#.....
// ....+---+#
// ....|...|.
// ..#.|...|.
// ..+-+-+#|.
// ..|.|.|.|.
// .#+-^-+-+.
// .+----++#.
// #+----++..
// ......#O..
// It doesn't really matter what you choose to use as an obstacle so long as you and The Historians can put it into position without the guard noticing. The important thing is having enough options that you can find one that minimizes time paradoxes, and in this example, there are 6 different positions you could choose.

// You need to get the guard stuck in a loop by adding a single new obstruction. How many different positions could you choose for this obstruction?

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

const moves: Record<Direction, [number, number]> = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};

const turnRight: Record<Direction, Direction> = {
  "^": ">",
  ">": "v",
  v: "<",
  "<": "^",
};

function simulatePatrol(
  grid: string[][],
  start: Position,
  initialDirection: Direction,
  detectLoop = false
): { visitedCount: number; loopDetected: boolean; leftMap: boolean } {
  const visitedPositions = new Set<string>();
  // For loop detection: (x,y,dir)
  const visitedStates = new Set<string>();

  let [x, y] = start;
  let direction = initialDirection;

  while (true) {
    visitedPositions.add(`${x},${y}`);
    const stateKey = `${x},${y},${direction}`;

    if (detectLoop) {
      if (visitedStates.has(stateKey)) {
        // loop detected
        return {
          visitedCount: visitedPositions.size,
          loopDetected: true,
          leftMap: false,
        };
      }
      visitedStates.add(stateKey);
    }

    const [dx, dy] = moves[direction];
    const [nextX, nextY] = [x + dx, y + dy];

    // Check if out of bounds
    if (
      nextX < 0 ||
      nextX >= grid.length ||
      nextY < 0 ||
      nextY >= grid[0].length
    ) {
      // Guard leaves the map
      return {
        visitedCount: visitedPositions.size,
        loopDetected: false,
        leftMap: true,
      };
    }

    // Check if obstacle ahead
    if (grid[nextX][nextY] === "#") {
      direction = turnRight[direction]; // Turn right
    } else {
      // Move forward
      x = nextX;
      y = nextY;
    }
  }
}

function main() {
  const inputPath = path.resolve(__dirname, "input2.txt");
  const input = fs.readFileSync(inputPath, "utf-8").trim().split("\n");

  const { grid, start, direction } = parseInput(input);
  let loopCount = 0;
  const [startX, startY] = start;

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      // Can't place at the starting position of the guard
      if (x === startX && y === startY) continue;
      // Only place on empty spots
      if (grid[x][y] !== ".") continue;

      // Temporarily place obstruction
      grid[x][y] = "#";
      const result = simulatePatrol(grid, start, direction, true);
      if (result.loopDetected) {
        loopCount++;
      }
      // Remove obstruction
      grid[x][y] = ".";
    }
  }

  console.log("Number of positions that cause a loop (Part 2):", loopCount);
}

main();
