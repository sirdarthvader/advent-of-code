import { readFileSync } from "fs";
import { join } from "path";

function compactDisk(input: string): number {
  // Parse the input into file and free segments
  let expectFile = true;
  let fileID = 0;
  const disk: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const length = Number(input[i]);
    if (expectFile) {
      // File segment
      for (let j = 0; j < length; j++) {
        disk.push(fileID.toString());
      }
      if (length > 0) {
        fileID++;
      }
    } else {
      // Free segment
      for (let j = 0; j < length; j++) {
        disk.push(".");
      }
    }
    expectFile = !expectFile;
  }

  // Compact the disk
  while (true) {
    const leftDotIndex = disk.indexOf(".");
    if (leftDotIndex === -1) {
      // No free spaces at all
      break;
    }

    const rightFileIndex = findRightmostFileBlock(disk);
    if (rightFileIndex === -1 || rightFileIndex <= leftDotIndex) {
      // No file block to the right to move
      break;
    }

    // Move the file block
    disk[leftDotIndex] = disk[rightFileIndex];
    disk[rightFileIndex] = ".";
  }

  // Compute checksum
  let checksum = 0;
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] !== ".") {
      const id = Number(disk[i]);
      checksum += i * id;
    }
  }

  return checksum;
}

function findRightmostFileBlock(disk: string[]): number {
  for (let i = disk.length - 1; i >= 0; i--) {
    if (disk[i] !== ".") return i;
  }
  return -1;
}

// Read input from input1.txt
const inputPath = join(__dirname, "input1.txt");
const inputData = readFileSync(inputPath, "utf8").trim();

// Compute and log the checksum
const result = compactDisk(inputData);
console.log(result);
