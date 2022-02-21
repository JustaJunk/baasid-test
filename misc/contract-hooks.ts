import { ERC721Admin__factory, ERC20Mojo__factory } from "../typechain";
import { existsSync } from "fs";
import { ethers } from "hardhat";
const { provider } = ethers;

type ArtifactMap = { [chainId: number]: string };

export const artifactMap: ArtifactMap = {
  1337: "./deployments/localhost/",
  7414: "./deployments/baasid/",
}

export const getERC721Admin = async () => {
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  const [signer] = await ethers.getSigners();
  const prefix = artifactMap[chainId];
  if (!prefix) {
    console.error("[ERROR] invalid network");
    return
  }
  const artifactJson = prefix + 'ERC721Admin.json';
  if (existsSync(artifactJson)) {
    const deployment = await import("." + artifactJson).then((module) => module.default);
    console.log("contract address:", deployment.address);
    return ERC721Admin__factory.connect(deployment.address, signer);
  } else {
    console.error(`[ERROR] deployment not exists (${chainId})`);
  }
}

export const getERC20Mojo = async () => {
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  const [signer] = await ethers.getSigners();
  const prefix = artifactMap[chainId];
  if (!prefix) {
    console.error("[ERROR] invalid network");
    return
  }
  const artifactJson = prefix + 'ERC20Mojo.json';
  if (existsSync(artifactJson)) {
    const deployment = await import("." + artifactJson).then((module) => module.default);
    console.log("contract address:", deployment.address);
    return ERC20Mojo__factory.connect(deployment.address, signer);
  } else {
    console.error(`[ERROR] deployment not exists (${chainId})`);
  }
}