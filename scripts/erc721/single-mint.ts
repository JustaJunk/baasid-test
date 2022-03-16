import { ethers } from "hardhat";
import { getERC721Admin } from "../../misc/contract-hooks";
import { MAX_ADMIN_COUNT } from "../../misc/constants";
import { TxHandler } from "../helper/handler";

async function main() {

  // Get ERC721Admin
  const contract = await getERC721Admin();
  if (!contract) return;
  
  // Get admin and users
  const signers = await ethers.getSigners();
  const admins = signers.slice(0, MAX_ADMIN_COUNT);
  const user = signers[MAX_ADMIN_COUNT];
  console.log("admin count:", admins.length);
  
  // Mint tokens
  const offsetIdx = [...Array(MAX_ADMIN_COUNT).keys()];
  const totalSupply = await contract.totalSupply();
  console.log("current token supply:", totalSupply.toNumber(), "tokens");
  const txHandler = new TxHandler();
  Promise.all(offsetIdx.map(async (idx) => {
      const tokenId = totalSupply.add(idx);
      return txHandler.handle(
        await contract.connect(admins[idx]).adminMint(user.address, tokenId)
        .catch(() => undefined)
        )
  }))
  .then(async () => {
    console.log("\ncurrent total supply:", (await contract.totalSupply()).toNumber(), "tokens\n");
    txHandler.benchmark(`erc721_singe_mint_${offsetIdx.length}`);
  })
  .catch((err) => {throw err})
  ;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});