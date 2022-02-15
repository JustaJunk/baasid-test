import { ethers } from "hardhat";
import { getContract } from "../misc/contract-hooks";

async function main() {
  const contract = await getContract();
  const user0 = (await ethers.getSigners())[500];
  if (!contract) return;

  // Destruct
  console.log((await contract.balanceOf(user0.address)).toNumber());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
