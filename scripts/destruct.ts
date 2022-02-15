import { getContract } from "../misc/contract-hooks";

async function main() {
  const contract = await getContract();
  if (!contract) return;

  // Destruct
  await contract.selfDestruct();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
