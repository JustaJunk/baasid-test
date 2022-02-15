import { ethers } from "hardhat";
import { getContract } from "../misc/contract-hooks";

async function main() {
  const contract = await getContract();
  const user0 = (await ethers.getSigners())[100];
  if (!contract) return;

  // Destruct
  console.log(user0.address, "has", (await contract.balanceOf(user0.address)).toNumber(), "tokens");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
