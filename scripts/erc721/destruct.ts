import { getERC721Admin } from "../../misc/contract-hooks";
import { artifactMap } from "../../misc/contract-hooks";
import fs from "fs";
import { ethers } from "hardhat";

async function main() {

  // Get contracts
  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;
  const erc721Admin = await getERC721Admin();

  // Destruct
  if (erc721Admin) {
    // Destruct
    await (await erc721Admin.selfDestruct()).wait();
    console.log("destruct ERC721Amdin");
    /// @ts-ignore
    fs.rmSync(`${artifactMap[chainId].slice(1)}/ERC721Amdin.json`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
