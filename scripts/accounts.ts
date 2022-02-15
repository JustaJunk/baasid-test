import { getUnnamedAccounts } from "hardhat";

async function main() {
  const signers = await getUnnamedAccounts();
  console.log(signers.slice(0, 100));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
