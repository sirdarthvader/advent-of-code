import * as fs from "fs";
import * as path from "path";

/**
 * Computes the number of unique antinode locations within the map.
 * @param input A list of strings, each representing a row of the map.
 */
function solve(input: string[]): number {
  const height = input.length;
  const width = input[0].length;

  // Parse the grid, record antenna positions by frequency
  const antennasByFreq: Map<string, { x: number; y: number }[]> = new Map();

  for (let y = 0; y < height; y++) {
    const line = input[y];
    for (let x = 0; x < width; x++) {
      const ch = line[x];
      if (ch !== ".") {
        if (!antennasByFreq.has(ch)) {
          antennasByFreq.set(ch, []);
        }
        antennasByFreq.get(ch)!.push({ x, y });
      }
    }
  }

  // A set to collect unique antinodes ("x,y" format)
  const antinodes: Set<string> = new Set();

  // For each frequency group, consider all pairs of antennas
  for (const [freq, positions] of antennasByFreq.entries()) {
    if (positions.length < 2) continue;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const A = positions[i];
        const B = positions[j];

        // Compute the two antinodes for this pair
        // M1 = 2A - B, M2 = 2B - A
        const M1 = { x: 2 * A.x - B.x, y: 2 * A.y - B.y };
        const M2 = { x: 2 * B.x - A.x, y: 2 * B.y - A.y };

        // Add them to the set if they are in bounds
        if (M1.x >= 0 && M1.x < width && M1.y >= 0 && M1.y < height) {
          antinodes.add(`${M1.x},${M1.y}`);
        }
        if (M2.x >= 0 && M2.x < width && M2.y >= 0 && M2.y < height) {
          antinodes.add(`${M2.x},${M2.y}`);
        }
      }
    }
  }

  return antinodes.size;
}

// Construct the full path to the input file at the same level as this file
const inputFile = path.join(__dirname, "input1.txt");
const input = fs
  .readFileSync(inputFile, "utf-8")
  .split("\n")
  .filter((line) => line.length > 0);

// Compute and print the result
console.log(solve(input));
