import { spawn } from "node:child_process";

const args = process.argv.slice(2);

function run(command: string, commandArgs: string[]): Promise<number> {
  return new Promise((resolve) => {
    const proc = spawn(command, commandArgs, { stdio: "inherit" });

    proc.on("close", (code) => {
      resolve(typeof code === "number" ? code : 1);
    });
  });
}

async function main() {
  const autoResult = await run("npm", ["run", "e2e:verify-expired:auto", "--", ...args]);
  if (autoResult !== 0) {
    process.exit(autoResult);
  }

  const cleanResult = await run("npm", ["run", "e2e:clean-test-reports"]);
  process.exit(cleanResult);
}

main().catch((error: unknown) => {
  console.error("E2E_SMOKE_ERROR", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
