import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { ethers, deployments } from "hardhat";
import { ERC721Admin, ERC721Admin__factory } from "../typechain";

const tokenURI = "ipfs://QmQu2oEk2ZmeDFcoaJsCPSnFGPkoDUPWEyVhT6VRZSuxbz/0"

type TestTarget = {
  contract: ERC721Admin,
  admin: SignerWithAddress,
  user1: SignerWithAddress,
  user2: SignerWithAddress,
}

describe("ER721Admin", function () {
  let tx;
  const getTargets = async (): Promise<TestTarget> => {
    const [ admin, user1, user2 ] = await ethers.getSigners();
    await deployments.fixture(["ERC721Admin"]);
    const deployment = await deployments.get("ERC721Admin");
    return {
      contract: ERC721Admin__factory.connect(deployment.address, admin),
      admin,
      user1,
      user2,
    };
  }

  it("Mint to", async function () {
    const { contract, user1 } = await getTargets();
    await expect(contract.connect(user1).mintTo(user1.address, 0, tokenURI))
    .to.be.revertedWith("Ownable: caller is not the owner");
    tx = await contract.mintTo(user1.address, 0, tokenURI);
    await tx.wait();
    assert( (await contract.balanceOf(user1.address)).eq(1), "balance error");
    assert( (await contract.ownerOf(0)) === user1.address, "owner error");
  });

  it("Admin Transfer", async function () {
    const { contract, user1, user2 } = await getTargets();
    tx = await contract.mintTo(user1.address, 0, tokenURI);
    await tx.wait();
    await expect(contract.connect(user2).adminTransfer(user2.address, 0))
    .to.be.revertedWith("Ownable: caller is not the owner");
    tx = await contract.adminTransfer(user2.address, 0);
    await tx.wait();
    assert( (await contract.balanceOf(user1.address)).eq(0), "user1 balance error");
    assert( (await contract.balanceOf(user2.address)).eq(1), "user2 balance error");
    assert( (await contract.ownerOf(0)) === user2.address, "owner error");
  });

  it("Admin Burn", async function () {
    const { contract, user2 } = await getTargets();
    tx = await contract.mintTo(user2.address, 0, tokenURI);
    await tx.wait();
    await expect(contract.connect(user2).adminBurn(0))
    .to.be.revertedWith("Ownable: caller is not the owner");
    tx = await contract.adminBurn(0);
    await tx.wait();
    assert( (await contract.balanceOf(user2.address)).eq(0), "user2 balance error");
    await expect(contract.ownerOf(0))
    .to.be.revertedWith("ERC721: owner query for nonexistent token");
  });
});
