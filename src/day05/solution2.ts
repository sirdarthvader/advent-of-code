import * as fs from "fs";
import * as path from "path";

function topologicalSort(
  update: number[],
  rules: [number, number][]
): number[] {
  const graph: Map<number, number[]> = new Map();
  const inDegree: Map<number, number> = new Map();

  // Initialize graph nodes
  update.forEach((page) => {
    graph.set(page, []);
    inDegree.set(page, 0);
  });

  // Build the graph and calculate in-degrees
  for (const [pageX, pageY] of rules) {
    if (update.includes(pageX) && update.includes(pageY)) {
      graph.get(pageX)!.push(pageY);
      inDegree.set(pageY, (inDegree.get(pageY) || 0) + 1);
    }
  }

  // Perform topological sorting using Kahn's algorithm
  const queue: number[] = [];
  for (const [page, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(page);
    }
  }

  const sorted: number[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    for (const neighbor of graph.get(current)!) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  return sorted;
}

function processInput(filePath: string): void {
  const data = fs.readFileSync(filePath, "utf-8").trim().split("\n\n"); // Split into rules and updates sections

  const rules = data[0]
    .split("\n")
    .map((line) => line.split("|").map(Number) as [number, number]);
  const updates = data[1]
    .split("\n")
    .map((line) => line.split(",").map(Number));

  let correctedMiddleSum = 0;

  for (const update of updates) {
    if (!isValidUpdate(update, rules)) {
      const correctedUpdate = topologicalSort(update, rules);
      const middleIndex = Math.floor(correctedUpdate.length / 2);
      correctedMiddleSum += correctedUpdate[middleIndex];
    }
  }

  console.log("Sum of middle pages in corrected updates:", correctedMiddleSum);
}

function isValidUpdate(update: number[], rules: [number, number][]): boolean {
  const positionMap: Record<number, number> = {};

  // Map each page number to its position in the update sequence
  update.forEach((page, index) => {
    positionMap[page] = index;
  });

  // Check all applicable rules
  for (const [pageX, pageY] of rules) {
    if (
      pageX in positionMap &&
      pageY in positionMap &&
      positionMap[pageX] >= positionMap[pageY]
    ) {
      return false; // Rule violated
    }
  }
  return true; // All rules satisfied
}

// Read the input file
const filePath = path.join(__dirname, "input1.txt");
processInput(filePath);
