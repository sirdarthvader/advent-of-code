import { execSync } from "child_process";

const day = process.argv[2];
if (!day) {
  console.log("Usage: npm run day src/dayXX/solution.ts");
  process.exit(1);
}

execSync(`ts-node ${day}`, { stdio: "inherit" });
