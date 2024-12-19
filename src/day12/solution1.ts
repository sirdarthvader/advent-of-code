import * as fs from "fs";
import { join } from "path";

type Point = [number, number];

function calculateTotalFencePrice(grid: string[]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const directions: Point[] = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
    [-1, 0], // up
  ];

  const isInBounds = (x: number, y: number): boolean =>
    x >= 0 && y >= 0 && x < rows && y < cols;

  const dfs = (x: number, y: number, plantType: string): [number, number] => {
    const stack: Point[] = [[x, y]];
    let area = 0;
    let perimeter = 0;

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      if (visited[cx][cy]) continue;
      visited[cx][cy] = true;
      area++;

      for (const [dx, dy] of directions) {
        const nx = cx + dx;
        const ny = cy + dy;

        if (!isInBounds(nx, ny) || grid[nx][ny] !== plantType) {
          perimeter++;
        } else if (!visited[nx][ny]) {
          stack.push([nx, ny]);
        }
      }
    }

    return [area, perimeter];
  };

  let totalPrice = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!visited[i][j]) {
        const plantType = grid[i][j];
        const [area, perimeter] = dfs(i, j, plantType);
        totalPrice += area * perimeter;
      }
    }
  }

  return totalPrice;
}

// Read input from the file input1.txt
function readInputFile(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// Main function
function main() {
  const inputFilePath = join(__dirname, "input1.txt");
  const gardenMap = readInputFile(inputFilePath);
  const totalFencePrice = calculateTotalFencePrice(gardenMap);
  console.log("Total Fence Price:", totalFencePrice);
}

main();
