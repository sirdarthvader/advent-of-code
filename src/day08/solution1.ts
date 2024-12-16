import * as fs from "fs";
import * as path from "path";

type Point = {
  x: number;
  y: number;
};

function parseInput(input: string): Map<string, Point[]> {
  const antennas = new Map<string, Point[]>();

  input.split("\n").forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char !== ".") {
        if (!antennas.has(char)) {
          antennas.set(char, []);
        }
        antennas.get(char)!.push({ x, y });
      }
    });
  });

  return antennas;
}

function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function findAntinodes(antennas: Map<string, Point[]>): Set<string> {
  const antinodes = new Set<string>();

  for (const [freq, points] of antennas) {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const dist = calculateDistance(a, b);

        // Calculate the unit vector between the points
        const dx = (b.x - a.x) / dist;
        const dy = (b.y - a.y) / dist;

        // Find antinodes on both sides
        const antinode1 = {
          x: Math.round(a.x + dx * dist * 1.5),
          y: Math.round(a.y + dy * dist * 1.5),
        };

        const antinode2 = {
          x: Math.round(a.x - dx * dist * 0.5),
          y: Math.round(a.y - dy * dist * 0.5),
        };

        antinodes.add(`${antinode1.x},${antinode1.y}`);
        antinodes.add(`${antinode2.x},${antinode2.y}`);
      }
    }
  }

  return antinodes;
}

function solveResonantCollinearity(input: string): number {
  const antennas = parseInput(input);
  const antinodes = findAntinodes(antennas);

  return antinodes.size;
}

// Read input from file
function readInputFile(): string {
  try {
    const inputPath = path.join(__dirname, "input1.txt");
    return fs.readFileSync(inputPath, "utf-8");
  } catch (error) {
    console.error("Error reading input file:", error);
    process.exit(1);
  }
}

// Main execution
function main() {
  const input = readInputFile();
  const result = solveResonantCollinearity(input);
  console.log("Number of unique antinode locations:", result);
}

// Run the solution
main();
