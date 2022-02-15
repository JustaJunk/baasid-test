import { ethers } from "hardhat";
import { getContract } from "../misc/contract-hooks";

async function main() {
  const contract = await getContract();
  const user0 = (await ethers.getSigners())[100];
  if (!contract) return;

  // Destruct
  console.log("total supply:", (await contract.totalSupply()).toNumber(), "tokens");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
