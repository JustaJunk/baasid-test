import { getERC721Admin } from "../../misc/contract-hooks";
import fs from "fs";

async function main() {
  const contract = await getERC721Admin();
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
