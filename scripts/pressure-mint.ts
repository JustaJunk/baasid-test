import { ethers } from "hardhat";
import { getContract } from "../misc/contract-hooks";

const { provider } = ethers;

async function main() {
  const signers = await ethers.getSigners();
  const admins = signers.slice(0, 100);
  const users = signers.slice(100, 200);
  console.log("admin count:", admins.length);
  console.log("user count:", users.length);
  const contract = await getContract();
  if (!contract) return;
  
  // Mint 100 tokens
  const offsetIdx = [...Array(100).keys()];
  const totalSupply = await contract.totalSupply();
  console.log("current token supply:", totalSupply.toNumber(), "tokens");
  const baseURI = "ipfs://QmWRRiM8YvhCjQN4g9ooBqKXubAWuWD5NG9FuLHYnzoHPh/";
  const startBlockNumber = await provider.getBlockNumber();
  const startTime = Date.now();
  await Promise.all(offsetIdx.map(async (idx) => {
    try {
      const tokenId = totalSupply.add(idx);
      const tx = await contract.connect(admins[idx]).mintTo(users[0].address, tokenId, baseURI + tokenId.toString());
      const receipt = await tx.wait();
      console.log(receipt.blockNumber);
    } catch (err: any) {
      console.error("[ERROR]", idx, err.message);
    }
  }));
  const endBlockNumber = await provider.getBlockNumber();
  const endTime = Date.now();
  console.log("current total supply:", (await contract.totalSupply()).toNumber(), "tokens\n");
  console.log("Block cost:", endBlockNumber - startBlockNumber);
  console.log("Time cost:", (endTime - startTime)/1000, "sec");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
