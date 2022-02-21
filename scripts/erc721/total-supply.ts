import { getERC721Admin } from "../../misc/contract-hooks";

async function main() {

  // Get ERC721Admin contract
  const contract = await getERC721Admin();
  if (!contract) return;

  // Destruct
  console.log("total supply:", (await contract.totalSupply()).toNumber(), "tokens");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
