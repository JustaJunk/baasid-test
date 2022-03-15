import { ethers } from "hardhat";
import { getERC721Admin } from "../../misc/contract-hooks";
import { BATCH_ADMIN_COUNT, BATCH_SIZE } from "../../misc/constants";
import { TxHandler } from "../helper/handler";

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
  const txHandler = new TxHandler();
  const startTime = Date.now();
  const status = await Promise.all(offsetIdxSlices.map(async (slice, adminId) => {
    try {
      const tokenIds = slice.map((offset) => totalSupply.sub(offset+1));
      return txHandler.handle(await contract.connect(admins[adminId]).adminBatchBurn(tokenIds));
    } catch (err: any) {
      console.error("[ERROR]", adminId, err.message);
    }
  }));
  const endTime = Date.now();
  const invalidCount = status.filter((s) => s !== 1).length;
  if (invalidCount == 0) {
    console.log("\ncurrent total supply:", (await contract.totalSupply()).toNumber(), "tokens\n");
    txHandler.showHistory();
    txHandler.saveHistory(`./test-history/erc721_batch_burn_${offsetIdx.length}`);
    console.log("Time cost:", (endTime - startTime)/1000, "sec");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
