/**
 * --- Part Two ---
The engineers are surprised by the low number of safe reports until they realize they forgot to tell you about the Problem Dampener.

The Problem Dampener is a reactor-mounted module that lets the reactor safety systems tolerate a single bad level in what would otherwise be a safe report. It's like the bad level never happened!

Now, the same rules apply as before, except if removing a single level from an unsafe report would make it safe, the report instead counts as safe.

More of the above example's reports are now safe:

7 6 4 2 1: Safe without removing any level.
1 2 7 8 9: Unsafe regardless of which level is removed.
9 7 6 2 1: Unsafe regardless of which level is removed.
1 3 2 4 5: Safe by removing the second level, 3.
8 6 4 4 1: Safe by removing the third level, 4.
1 3 6 7 9: Safe without removing any level.
Thanks to the Problem Dampener, 4 reports are actually safe!

Update your analysis by handling situations where the Problem Dampener can remove a single level from unsafe reports. How many reports are now safe?

*/

import { readFileSync } from "fs";
import { join } from "path";
// import { isSafeReport } from "./solution1";

function isSafeReport(report: number[]): boolean {
  let increasing = true; // Assume the sequence is increasing
  let decreasing = true; // Assume the sequence is decreasing

  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i + 1] - report[i];

    // Check if the difference is not between 1 and 3
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      return false; // Unsafe due to difference constraint
    }

    // Determine if sequence is strictly increasing or decreasing
    if (diff > 0) decreasing = false; // Not strictly decreasing
    if (diff < 0) increasing = false; // Not strictly increasing
  }

  return increasing || decreasing; // Safe if it's strictly one or the other
}

function countSafeReports(reports: string[]): number {
  let safeCount = 0;

  for (const reportStr of reports) {
    const report = reportStr.trim().split(" ").map(Number);

    // Check if the report is safe without changes
    if (isSafeReport(report)) {
      safeCount++;
      continue;
    }

    // Try removing each level and check if the modified report is safe
    let foundSafeWithDampener = false;
    for (let i = 0; i < report.length; i++) {
      const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
      if (isSafeReport(modifiedReport)) {
        foundSafeWithDampener = true;
        break;
      }
    }

    if (foundSafeWithDampener) {
      safeCount++;
    }
  }

  return safeCount;
}

const inputPath = join(__dirname, "input2.txt");
const input = readFileSync(inputPath, "utf8");
const reports = input.trim().split("\n");

console.log("Safe Reports with Dampener: " + countSafeReports(reports));
