/**
 * --- Part Two ---
  The Elf looks quizzically at you. Did you misunderstand the assignment?

  Looking for the instructions, you flip over the word search to find that this isn't actually an XMAS puzzle; it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X. One way to achieve that is like this:

  M.S
  .A.
  M.S
  Irrelevant characters have again been replaced with . in the above diagram. Within the X, each MAS can be written forwards or backwards.

  Here's the same example from before, but this time all of the X-MASes have been kept instead:

  .M.S......
  ..A..MSMS.
  .M.S.MAA..
  ..A.ASMSM.
  .M.S.M....
  ..........
  S.S.S.S.S.
  .A.A.A.A..
  M.M.M.M.M.
  ..........
  In this example, an X-MAS appears 9 times.

  Flip the word search from the instructions back over to the word search side and try again. How many times does an X-MAS appear?

 */
import * as fs from "fs";
import * as path from "path";

const patterns = ["MAS", "SAM"];

function countXMAS(grid: string[]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    { dx1: -1, dy1: -1, dx2: 1, dy2: 1 }, // Top-Left to Bottom-Right
    { dx1: -1, dy1: 1, dx2: 1, dy2: -1 }, // Top-Right to Bottom-Left
  ];

  let count = 0;

  function isMAS(
    x: number,
    y: number,
    dx1: number,
    dy1: number,
    dx2: number,
    dy2: number
  ): boolean {
    const str =
      (grid[x + dx1]?.[y + dy1] || "") +
      grid[x][y] +
      (grid[x + dx2]?.[y + dy2] || "");
    return patterns.includes(str);
  }

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (grid[x][y] === "A") {
        // 'A' is the center of the X-MAS
        let isXMAS = true;
        for (const { dx1, dy1, dx2, dy2 } of directions) {
          isXMAS = isXMAS && isMAS(x, y, dx1, dy1, dx2, dy2);
        }
        if (isXMAS) {
          count++;
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
