import { getERC721Admin, getERC20Mojo } from "../misc/contract-hooks";
import { artifactMap } from "../misc/contract-hooks";
import fs from "fs";
import { ethers } from "hardhat";


async function main() {

  // Get contracts
  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;
  const erc721Admin = await getERC721Admin();
  const erc20Mojo = await getERC20Mojo();

  // Destruct
  if (erc721Admin && erc20Mojo) {
    // Destruct
    await (await erc721Admin.selfDestruct()).wait();
    console.log("destruct ERC721Amdin");
    await (await erc20Mojo.selfDestruct()).wait();
    console.log("destruct ERC20Mojo");
    /// @ts-ignore
    fs.rmSync(artifactMap[chainId].slice(1), { recursive: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
