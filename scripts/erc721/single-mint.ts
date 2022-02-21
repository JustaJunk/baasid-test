import { ethers } from "hardhat";
import { getERC721Admin } from "../../misc/contract-hooks";
import { MAX_ADMIN_COUNT, MAX_SIGNER_COUNT } from "../../misc/constants";

const { provider } = ethers;

async function main() {

  // Get ERC721Admin
  const contract = await getERC721Admin();
  if (!contract) return;
  
  // Get admin and users
  const signers = await ethers.getSigners();
  const admins = signers.slice(0, MAX_ADMIN_COUNT);
  const users = signers.slice(MAX_ADMIN_COUNT, MAX_SIGNER_COUNT);
  console.log("admin count:", admins.length);
  console.log("user count:", users.length);
  
  // Mint tokens
  const offsetIdx = [...Array(MAX_ADMIN_COUNT).keys()];
  const totalSupply = await contract.totalSupply();
  console.log("current token supply:", totalSupply.toNumber(), "tokens");
  const baseURI = "ipfs://QmWRRiM8YvhCjQN4g9ooBqKXubAWuWD5NG9FuLHYnzoHPh/";
  const startBlockNumber = await provider.getBlockNumber();
  const startTime = Date.now();
  let previousBlockNumber = 0;
  await Promise.all(offsetIdx.map(async (idx) => {
    try {
      const tokenId = totalSupply.add(idx);
      const tx = await contract.connect(admins[idx]).adminMint(users[0].address, tokenId, baseURI + tokenId.toString());
      const receipt = await tx.wait();
      if (receipt.blockNumber > previousBlockNumber) {
        console.log("\nBlockNumber:", receipt.blockNumber);
        console.log("BlockHash:", receipt.blockHash);
        previousBlockNumber = receipt.blockNumber;
      }
      // console.log("TxHash:", receipt.transactionHash); // print tx hash
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