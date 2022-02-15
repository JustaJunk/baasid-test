import { getUnnamedAccounts } from "hardhat";

async function main() {
  if (!process.env.MNEMONI) {
    console.error("[ERROR] mnemonic not set");
    return;
  }
  const signers = await getUnnamedAccounts();
  console.log(signers.slice(0, 100));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
