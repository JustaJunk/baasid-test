import { ethers } from "hardhat";
import { getERC721Admin } from "../../misc/contract-hooks";
import { MAX_ADMIN_COUNT } from "../../misc/constants";
import { TxHandler } from "../helper/handler";

const { provider } = ethers;

async function main() {

  // Get ERC721Admin
  const contract = await getERC721Admin();
  if (!contract) return;

  // Get admins
  const signers = await ethers.getSigners();
  const admins = signers.slice(0, MAX_ADMIN_COUNT);
  console.log("admin count:", admins.length);
  
  // Burn tokens
  const offsetIdx = [...Array(MAX_ADMIN_COUNT).keys()];
  const totalSupply = await contract.totalSupply();
  console.log("current token supply:", totalSupply.toNumber(), "tokens");
  const txHandler = new TxHandler();
  txHandler.start();
  Promise.all(offsetIdx.map(async (idx) => {
      const tokenId = totalSupply.sub(idx+1);
      return txHandler.handle(
        await contract.connect(admins[idx]).adminBurn(tokenId)
        .then((tx) => {return tx})
        .catch((err) => {throw err})
      );
  }))
  .then(async () => {
    console.log("\ncurrent total supply:", (await contract.totalSupply()).toNumber(), "tokens\n");
    txHandler.benchmark(`./test-logs/erc721_singe_burn_${offsetIdx.length}`);
  })
  .catch((err) => {throw err});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});