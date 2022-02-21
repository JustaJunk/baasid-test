import { ethers } from "hardhat";
import { getERC20Mojo } from "../../misc/contract-hooks";

async function main() {

  // Get ERC721Admin contract
  const contract = await getERC20Mojo();
  if (!contract) return;

  // Destruct
  console.log("total supply:", ethers.utils.formatEther(await contract.totalSupply()), "MOJO");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
