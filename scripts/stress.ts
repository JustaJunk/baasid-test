import { ethers } from "hardhat";
import { getContract } from "../misc/contract-hooks";

const { provider } = ethers;

async function main() {
  const signers = await ethers.getSigners();
  const admins = signers.slice(0, 500);
  const users = signers.slice(500, 1000);
  console.log("admin count:", admins.length);
  console.log("user count:", users.length);
  const contract = await getContract();
  if (!contract) return;
  
  // Mint 500 tokens
  const tokenIds = [...Array(500).keys()];
  const baseURI = "ipfs://QmWRRiM8YvhCjQN4g9ooBqKXubAWuWD5NG9FuLHYnzoHPh/";
  const startBlockNumber = await provider.getBlockNumber();
  const startTime = Date.now();
  await Promise.all(tokenIds.map(async (tid) => {
    try {
      const tx = await contract.connect(admins[tid]).mintTo(users[0].address, tid, baseURI + tid);
      const receipt = await tx.wait();
      console.log(receipt.blockNumber);
    } catch (err: any) {
      console.error("[ERROR]", tid, err.message);
    }
  }));
  const endBlockNumber = await provider.getBlockNumber();
  const endTime = Date.now();
  console.log("Block cost:", endBlockNumber - startBlockNumber);
  console.log("Time cost:", (endTime - startTime)/1000, "sec");
  console.log(users[0].address, "balance:", (await contract.balanceOf(users[0].address)).toNumber());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
