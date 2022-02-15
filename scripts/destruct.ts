import { getContract } from "../misc/contract-hooks";
import fs from "fs";

async function main() {
  const contract = await getContract();
  if (!contract) return;

  // Destruct
  await contract.selfDestruct();
  /// @ts-ignore
  fs.rmdirSync("./deployments/baasid", { recursive: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
