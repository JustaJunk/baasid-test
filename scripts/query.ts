import { ethers, getNamedAccounts } from "hardhat";
import { ERC721Admin, ERC721Admin__factory } from "../typechain";
import LOCAL_CONFIG from "../deployments/localhost/ERC721Admin.json";
import BAASID_CONFIG from "../deployments/baasid/ERC721Admin.json";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { provider } = ethers;

const getContract = (chainId: number, signer: SignerWithAddress) => {
  if (chainId === 1337) {
    return ERC721Admin__factory.connect(LOCAL_CONFIG.address, signer);
  } else if (chainId === 7414) {
    return ERC721Admin__factory.connect(BAASID_CONFIG.address, signer);
  } else {
    console.error("[ERROR] invalid network");
  }
}

async function main() {
  const { admin, user1, user2 } = await getNamedAccounts();
  const adminSigner = await ethers.getSigner(admin);
  const signers = await ethers.getSigners();
  const network = await provider.getNetwork();
  const contract = getContract(network.chainId, adminSigner);
  if (!contract) return;

  // Get tokenURI
  console.log(await contract.balanceOf(user1));
  console.log(await contract.tokenURI(0));
  console.log(await contract.tokenURI(1));
  console.log(await contract.tokenURI(2));
  console.log(await contract.tokenURI(3));
  try {
    console.log(await contract.tokenURI(4));
  } catch (err: any) {
    console.log(err.error.message)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
