/**
* --- Part Two ---
Your analysis only confirmed what everyone feared: the two lists of location IDs are indeed very different.

Or are they?

The Historians can't agree on which group made the mistakes or how to read most of the Chief's handwriting, but in the commotion you notice an interesting detail: a lot of location IDs appear in both lists! Maybe the other numbers aren't location IDs at all but rather misinterpreted handwriting.

This time, you'll need to figure out exactly how often each number from the left list appears in the right list. Calculate a total similarity score by adding up each number in the left list after multiplying it by the number of times that number appears in the right list.

Here are the same example lists again:

3   4
4   3
2   5
1   3
3   9
3   3
For these example lists, here is the process of finding the similarity score:

The first number in the left list is 3. It appears in the right list three times, so the similarity score increases by 3 * 3 = 9.
The second number in the left list is 4. It appears in the right list once, so the similarity score increases by 4 * 1 = 4.
The third number in the left list is 2. It does not appear in the right list, so the similarity score does not increase (2 * 0 = 0).
The fourth number, 1, also does not appear in the right list.
The fifth number, 3, appears in the right list three times; the similarity score increases by 9.
The last number, 3, appears in the right list three times; the similarity score again increases by 9.
So, for these example lists, the similarity score at the end of this process is 31 (9 + 4 + 0 + 0 + 9 + 9).

Once again consider your left and right lists. What is their similarity score?

*/

/**
 * Solution 2:
 * 1. Parse the input from input.txt file
 * 2. Pair up the numbers from the two lists
 * 3. Calculate the similarity score between each pair
 * 4. Sum the similarity scores
 * 5. Return the total similarity score
 */

import { readFileSync } from "fs";
import { join } from "path";

function parseInput(input: string): { left: number[]; right: number[] } {
  const left: number[] = [];
  const right: number[] = [];

  // Split the input into lines and process each line
  const lines = input.trim().split("\n");
  for (const line of lines) {
    const [leftVal, rightVal] = line.trim().split(/\s+/).map(Number);
    left.push(leftVal);
    right.push(rightVal);
  }
  return { left, right };
}

function findTotalSimilarityScore(left: number[], right: number[]): number {
  let similarityScore = 0;
  for (let i = 0; i < left.length; i++) {
    const count = right.filter((val) => val === left[i]).length;
    similarityScore += left[i] * count;
  }
  return similarityScore;
}

// Read input from file
const inputPath = join(__dirname, "input2.txt");
const input = readFileSync(inputPath, "utf8");

// Parse and process input
const { left, right } = parseInput(input);

// Result
const result = findTotalSimilarityScore(left, right);
console.log("Total similarity score:", result);
