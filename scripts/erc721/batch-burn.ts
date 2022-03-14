import { ethers } from "hardhat";
import { getERC721Admin } from "../../misc/contract-hooks";
import { BATCH_ADMIN_COUNT, BATCH_SIZE } from "../../misc/constants";

const { provider } = ethers;

async function main() {
  
  // Get ERC721Admin contract  
  const contract = await getERC721Admin();
  if (!contract) return;
  
  // Get admins
  const signers = await ethers.getSigners();
  const admins = signers.slice(0, BATCH_ADMIN_COUNT);
  console.log("admin count:", admins.length);
  
  // Burn tokens
  const offsetIdx = [...Array(BATCH_SIZE * BATCH_ADMIN_COUNT).keys()];
  const offsetIdxSlices = [...Array(BATCH_ADMIN_COUNT).keys()].map((adminId) => offsetIdx.slice(BATCH_SIZE*adminId, BATCH_SIZE*(adminId+1)));
  const totalSupply = await contract.totalSupply();
  console.log("current token supply:", totalSupply.toNumber(), "tokens");
  const startBlockNumber = await provider.getBlockNumber();
  const startTime = Date.now();
  let previousBlockNumber = -1;
  await Promise.all(offsetIdxSlices.map(async (slice, adminId) => {
    try {
      const tokenIds = slice.map((offset) => totalSupply.sub(offset+1));
      const tx = await contract.connect(admins[adminId]).adminBatchBurn(tokenIds);
      const receipt = await tx.wait();
      if (receipt.blockNumber > previousBlockNumber) {
        console.log("\nBlockNumber:", receipt.blockNumber);
        console.log("BlockHash:", receipt.blockHash);
        console.log("GasUsed:", receipt.cumulativeGasUsed.toNumber());
        previousBlockNumber = receipt.blockNumber;
      }
      // console.log("TxHash:", receipt.transactionHash); // print tx hash
    } catch (err: any) {
      console.error("[ERROR]", adminId, err.message);
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
