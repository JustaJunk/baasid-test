import { ethers, getNamedAccounts, getUnnamedAccounts } from "hardhat";
import { ERC721Admin, ERC721Admin__factory } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { existsSync } from "fs";

const { provider } = ethers;
const LOCAL_DEPLOYMENT = "./deployments/localhost/ERC721Admin.json";
const BAASID_DEPLOYMENT = "./deployments/baasid/ERC721Admin.json";

const getContract = async (chainId: number, signer: SignerWithAddress) => {
  if (chainId === 1337) {
    if (existsSync(LOCAL_DEPLOYMENT)) {
      const deployment = await import("."+LOCAL_DEPLOYMENT).then((module) => module.default);
      console.log("contract address:", deployment.address);
      return ERC721Admin__factory.connect(deployment.address, signer);
    } else {
      console.error("[ERROR] localhost deployment not exists");
    }
  } else if (chainId === 7414) {
    if (existsSync(BAASID_DEPLOYMENT)) {
      const deployment = await import("."+BAASID_DEPLOYMENT).then((module) => module.default);
      console.log("contract address:", deployment.address);
      return ERC721Admin__factory.connect(deployment.address, signer);
    } else {
      console.error("[ERROR] baasid deployment not exists");
    }
  } else {
    console.error("[ERROR] invalid network");
  }
}

async function main() {
  const signers = await ethers.getSigners();
  const admins = signers.slice(0, 500);
  const users = signers.slice(500, 1000);
  console.log("admin count:", admins.length);
  console.log("user count:", users.length);
  const network = await provider.getNetwork();
  const contract = await getContract(network.chainId, admins[0]);
  if (!contract) return;
  
  // Mint
  const tokenIds = [...Array(10).keys()];
  const baseURI = "ipfs://QmWRRiM8YvhCjQN4g9ooBqKXubAWuWD5NG9FuLHYnzoHPh/";
  const startBlockNumber = await provider.getBlockNumber();
  const startTime = Date.now();
  await Promise.all(tokenIds.map(async (tid) => {
    try {
      const tx = await contract.connect(admins[tid]).mintTo(users[tid].address, tid, baseURI + tid);
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
