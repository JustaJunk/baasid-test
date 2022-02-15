import { ethers } from "hardhat";
import { getContract } from "../misc/contract-hooks";
import { MAX_ADMIN_COUNT, MAX_SIGNER_COUNT } from "../misc/constants";

const { provider } = ethers;

async function main() {
  const signers = await ethers.getSigners();
  const admins = signers.slice(0, MAX_ADMIN_COUNT);
  const users = signers.slice(MAX_ADMIN_COUNT, MAX_SIGNER_COUNT);
  console.log("admin count:", admins.length);
  console.log("user count:", users.length);
  const contract = await getContract();
  if (!contract) return;
  
  // Burn all tokens
  const offsetIdx = [...Array(MAX_ADMIN_COUNT).keys()];
  const totalSupply = await contract.totalSupply();
  console.log("current token supply:", totalSupply.toNumber(), "tokens");
  const startBlockNumber = await provider.getBlockNumber();
  const startTime = Date.now();
  let previousBlockNumber = 0;
  await Promise.all(offsetIdx.map(async (idx) => {
    try {
      const tokenId = totalSupply.sub(idx).sub(1);
      const tx = await contract.connect(admins[idx]).adminBurn(tokenId);
      const receipt = await tx.wait();
      if (receipt.blockNumber > previousBlockNumber) {
        console.log("\nBlockNumber:", receipt.blockNumber);
        console.log("BlockHash:", receipt.blockHash);
        previousBlockNumber = receipt.blockNumber;
      }
    } catch (err: any) {
      console.error("[ERROR]", idx, err.message);
    }
  }));
  const endBlockNumber = await provider.getBlockNumber();
  const endTime = Date.now();
  console.log("\ncurrent total supply:", (await contract.totalSupply()).toNumber(), "tokens\n");
  console.log("Block cost:", endBlockNumber - startBlockNumber);
  console.log("Time cost:", (endTime - startTime)/1000, "sec");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
