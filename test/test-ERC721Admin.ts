import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { ethers, deployments } from "hardhat";
import { ERC721Admin, ERC721Admin__factory } from "../typechain";
import { MAX_ADMIN_COUNT, MAX_SIGNER_COUNT, BASE_URI } from "../misc/constants";

const tokenURI = "ipfs://QmQu2oEk2ZmeDFcoaJsCPSnFGPkoDUPWEyVhT6VRZSuxbz/0"

type TestTarget = {
  contract: ERC721Admin,
  admins: SignerWithAddress[],
  users: SignerWithAddress[],
  adminCode: string,
}

describe("ER721Admin", function () {
  let tx;
  const getTargets = async (): Promise<TestTarget> => {
    const signers = await ethers.getSigners();
    const admins = signers.slice(0, MAX_ADMIN_COUNT);
    const users = signers.slice(MAX_ADMIN_COUNT, MAX_SIGNER_COUNT);
    await deployments.fixture(["ERC721Admin"]);
    const deployment = await deployments.get("ERC721Admin");
    const contract = ERC721Admin__factory.connect(deployment.address, admins[0]);
    const adminCode = await contract.ADMIN();
    return {
      contract,
      admins,
      users,
      adminCode,
    };
  }

  it("Mint to", async function () {
    const { contract, admins, users, adminCode } = await getTargets();
    const tokenId = 0;
    const idx = 0;
    await expect(contract.connect(users[idx]).adminMint(users[idx].address, tokenId))
    .to.be.revertedWith(`AccessControl: account ${users[idx].address.toLowerCase()} is missing role ${adminCode}`);
    tx = await contract.connect(admins[idx]).adminMint(users[idx].address, tokenId);
    await tx.wait();
    expect(await contract.tokenURI(0)).equal(`${BASE_URI}${tokenId}.json`);
    expect(await contract.balanceOf(users[idx].address)).equal(1);
    expect(await contract.ownerOf(tokenId)).equal(users[idx].address);
  });

  it("Admin Transfer", async function () {
    const { contract, admins, users, adminCode } = await getTargets();
    const tokenId = 0;
    const idx = 1;
    tx = await contract.connect(admins[idx]).adminMint(users[idx].address, tokenId);
    await tx.wait();
    await expect(contract.connect(users[idx]).adminTransfer(users[idx].address, tokenId))
    .to.be.revertedWith(`AccessControl: account ${users[idx].address.toLowerCase()} is missing role ${adminCode}`);
    tx = await contract.connect(admins[idx]).adminTransfer(users[idx].address, tokenId);
    await tx.wait();
    expect(await contract.balanceOf(users[idx-1].address)).equal(0);
    expect(await contract.balanceOf(users[idx].address)).equal(1);
    expect(await contract.ownerOf(tokenId)).equal(users[idx].address);
  });

  it("Admin Burn", async function () {
    const { contract, admins, users, adminCode } = await getTargets();
    const tokenId = 0;
    const idx = 2;
    tx = await contract.connect(admins[idx]).adminMint(users[idx].address, tokenId);
    await tx.wait();
    await expect(contract.connect(users[idx]).adminBurn(tokenId))
    .to.be.revertedWith(`AccessControl: account ${users[idx].address.toLowerCase()} is missing role ${adminCode}`);
    tx = await contract.connect(admins[idx]).adminBurn(tokenId);
    await tx.wait();
    expect(await contract.balanceOf(users[idx].address)).equal(0);
    await expect(contract.ownerOf(0))
    .to.be.revertedWith("ERC721: owner query for nonexistent token" );
  });

  it("Admin destruct", async function () {
    const { contract, admins } = await getTargets();
    tx = await contract.connect(admins[0]).selfDestruct();
    await tx.wait();
    await expect(contract.balanceOf(admins[1].address))
    .to.be.revertedWith("");
  });
});
