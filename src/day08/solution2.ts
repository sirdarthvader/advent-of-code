import * as fs from "fs";
import * as path from "path";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

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

  // A set to hold unique antinode coordinates
  const antinodes: Set<string> = new Set();

  for (const [freq, positions] of antennasByFreq.entries()) {
    if (positions.length < 2) {
      // If only one antenna of this frequency, it cannot form a line with others.
      // No antinodes except possibly itself if that was allowed by another line - but no line possible.
      continue;
    }

    // To avoid processing the same line multiple times, use a set of lines
    // A line is represented by (dx', dy', c) as explained above.
    const processedLines = new Set<string>();

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const A = positions[i];
        const B = positions[j];

        const dx = B.x - A.x;
        const dy = B.y - A.y;

        const g = gcd(dx, dy);
        const dxp = dx / g;
        const dyp = dy / g;

        // Normalize direction so it's unique per line
        let ndx = dxp;
        let ndy = dyp;
        if (ndx < 0 || (ndx === 0 && ndy < 0)) {
          ndx = -ndx;
          ndy = -ndy;
        }

        // Compute c = dy'*x1 - dx'*y1
        // For the line going through A: normal vector n = (-ndy, ndx)
        // line eq: n·X + c' = 0, c' = -(n·A)
        // n·A = (-ndy)*A.x + (ndx)*A.y
        // c = dy'*x1 - dx'*y1
        const c = ndy * A.x - ndx * A.y;

        const lineKey = `${ndx},${ndy},${c}`;
        if (processedLines.has(lineKey)) {
          // Already processed this line
          continue;
        }
        processedLines.add(lineKey);

        // Now generate all points on this line within the grid.
        // Parameterization: X = A.x + k*ndx, Y = A.y + k*ndy
        // We must find the range of k that keeps the point in the grid.

        // Because we only know one point A, we can use it to find bounds.
        // But any point on the line would do. Let's just use A.

        // For X-bound:
        // 0 <= A.x + k*ndx < width
        // For Y-bound:
        // 0 <= A.y + k*ndy < height

        function getRangeForAxis(
          pos: number,
          d: number,
          maxVal: number
        ): [number, number] {
          // If direction d = 0, no constraint from this axis except pos must be in range
          if (d === 0) {
            if (pos < 0 || pos >= maxVal) {
              // No valid k at all if the starting point is out of range
              return [1, -1]; // empty interval
            } else {
              // pos fixed, no additional constraints
              return [-Infinity, Infinity];
            }
          }
          // Solve inequalities:
          // If d > 0:
          //   0 <= pos + k*d < maxVal
          //   -pos/d <= k < (maxVal - pos)/d
          // If d < 0:
          //   0 <= pos + k*d < maxVal
          //   When dividing by negative d, inequalities flip:
          //   -pos/d >= k > (maxVal - pos)/d
          let minK: number, maxK: number;
          if (d > 0) {
            minK = Math.ceil(-pos / d);
            maxK = Math.floor((maxVal - 1 - pos) / d);
          } else {
            // d < 0
            //   pos + k*d >= 0 => k <= -pos/d
            //   pos + k*d < maxVal => k > (maxVal - pos - 1)/d
            // But dividing by negative number flips inequalities:
            // Actually let's rewrite carefully:
            // 0 <= pos + k*d
            // k*d >= -pos
            // k <= -pos/d (since d<0)

            // pos + k*d < maxVal
            // k*d < maxVal - pos
            // k > (maxVal - pos - 1)/d (since d<0, flipping inequality)
            const lowerBound = Math.ceil((maxVal - 1 - pos) / d); // careful with sign
            const upperBound = Math.floor(-pos / d);
            // After flipping signs:
            minK = Math.max(-Infinity, lowerBound);
            maxK = Math.min(Infinity, upperBound);
            // Actually let's be more explicit:
            // If d<0, dividing inequality by d flips sign.
            // For 0 <= pos + k*d:
            // pos + k*d >= 0 => k*d >= -pos => k <= -pos/d (since d<0, -pos/d is actually a maximum)
            // For pos + k*d < maxVal:
            // k*d < maxVal - pos => k > (maxVal - pos - 1)/d (since dividing by negative flips '<' to '>')
            // So final constraints:
            // k > (maxVal - pos - 1)/d and k <= -pos/d
            // Since d<0, (maxVal - pos - 1)/d is actually a larger number if we consider negative...
            // We'll just compute numeric values and pick correct integer bounds:
            let lower = (maxVal - 1 - pos) / d; // With d<0, this is a positive or negative fraction
            let upper = -pos / d;
            // k must be > lower and <= upper
            minK = Math.ceil(lower + Number.EPSILON);
            maxK = Math.floor(upper + Number.EPSILON);
          }

          if (d > 0) {
            // k >= -pos/d and k < (maxVal - pos)/d
            // after taking floor/ceil above:
            return [minK, maxK];
          } else {
            // We need to reorder minK, maxK if we made a mistake.
            // Let's just re-derive for d<0 cleanly:
            // 0 <= pos + k*d < maxVal
            // For lower bound: pos + k*d >= 0 => k <= -pos/d
            // For upper bound: pos + k*d < maxVal => k > (maxVal - pos -1)/d
            // If d<0, -pos/d is a lower number than (maxVal - pos -1)/d or not?
            // Actually let's do numeric logic:
            const candidates: number[] = [];
            // We'll just solve numerically:
            // The set of k must satisfy:
            // k <= floor(-pos/d) and k > (maxVal - pos -1)/d
            // Let's define:
            const upBound = Math.floor(-pos / d);
            const lowBound = Math.ceil((maxVal - 1 - pos) / d);
            // The final range of k is: k in (lowBound, upBound]
            return [lowBound, upBound];
          }
        }

        const [minKx, maxKx] = getRangeForAxis(A.x, ndx, width);
        const [minKy, maxKy] = getRangeForAxis(A.y, ndy, height);

        const minK = Math.max(minKx, minKy);
        const maxK = Math.min(maxKx, maxKy);

        if (minK <= maxK) {
          for (let k = minK; k <= maxK; k++) {
            const X = A.x + k * ndx;
            const Y = A.y + k * ndy;
            antinodes.add(`${X},${Y}`);
          }
        }
      }
    }
  }

  return antinodes.size;
}

const inputFile = path.join(__dirname, "input2.txt");
const input = fs
  .readFileSync(inputFile, "utf-8")
  .split("\n")
  .filter((line) => line.length > 0);

console.log(solve(input));
