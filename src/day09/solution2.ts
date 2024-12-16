import { readFileSync } from "fs";
import { join } from "path";

interface FileInfo {
  id: number;
  length: number;
  positions: number[]; // all the indexes where this file is located
}

function compactDiskWholeFiles(input: string): number {
  // Parse into disk array
  const disk: string[] = parseInput(input);

  // Identify files and their positions
  const files = identifyFiles(disk);

  // Sort files by decreasing file ID
  files.sort((a, b) => b.id - a.id);

  // Attempt to move each file
  for (const file of files) {
    attemptToMoveFile(file, disk);
  }

  // Compute checksum
  return computeChecksum(disk);
}

function parseInput(input: string): string[] {
  let expectFile = true;
  let fileID = 0;
  const disk: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const length = Number(input[i]);
    if (expectFile) {
      for (let j = 0; j < length; j++) {
        disk.push(fileID.toString());
      }
      if (length > 0) {
        fileID++;
      }
    } else {
      for (let j = 0; j < length; j++) {
        disk.push(".");
      }
    }
    expectFile = !expectFile;
  }
  return disk;
}

function identifyFiles(disk: string[]): FileInfo[] {
  const fileMap: Map<number, FileInfo> = new Map();
  for (let i = 0; i < disk.length; i++) {
    const ch = disk[i];
    if (ch !== ".") {
      const fid = Number(ch);
      if (!fileMap.has(fid)) {
        fileMap.set(fid, { id: fid, length: 0, positions: [] });
      }
      const f = fileMap.get(fid)!;
      f.positions.push(i);
      f.length++;
    }
  }
  return Array.from(fileMap.values());
}

function attemptToMoveFile(file: FileInfo, disk: string[]) {
  if (file.positions.length === 0) return; // no blocks, no move

  const fileLength = file.length;
  const fileStart = Math.min(...file.positions);

  // We need to find a contiguous run of '.' of length = fileLength
  // that ends before fileStart (i.e., is strictly to the left of the file’s leftmost block).
  // We'll scan from left to right for runs of '.'.
  let startIndex = 0;
  while (startIndex < fileStart) {
    if (disk[startIndex] === ".") {
      // found a run of '.' starting at startIndex
      let endIndex = startIndex;
      while (
        endIndex < fileStart &&
        endIndex < disk.length &&
        disk[endIndex] === "."
      ) {
        endIndex++;
      }
      // Now we have a run of '.' from startIndex to endIndex-1 inclusive
      const runLength = endIndex - startIndex;
      if (runLength >= fileLength) {
        // We can fit the file here
        moveFile(file, disk, startIndex);
        return; // only move once
      }
      startIndex = endIndex;
    } else {
      startIndex++;
    }
  }
  // If no run found, do nothing
}

function moveFile(file: FileInfo, disk: string[], newStart: number) {
  // file.positions gives current positions of the file
  // Sort positions so we know the order of blocks
  file.positions.sort((a, b) => a - b);

  // Clear old positions
  for (const pos of file.positions) {
    disk[pos] = ".";
  }

  // Place file starting at newStart
  for (let i = 0; i < file.length; i++) {
    disk[newStart + i] = file.id.toString();
  }

  // Update file positions
  file.positions = [];
  for (let i = 0; i < file.length; i++) {
    file.positions.push(newStart + i);
  }
}

function computeChecksum(disk: string[]): number {
  let checksum = 0;
  for (let i = 0; i < disk.length; i++) {
    const ch = disk[i];
    if (ch !== ".") {
      const id = Number(ch);
      checksum += i * id;
    }
  }
  return checksum;
}

// Read input from input1.txt
const inputPath = join(__dirname, "input2.txt");
const inputData = readFileSync(inputPath, "utf8").trim();

// Compute and log the checksum for Part Two
const result = compactDiskWholeFiles(inputData);
console.log(result);
