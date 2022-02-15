import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { ethers, deployments } from "hardhat";
import { ERC721Admin, ERC721Admin__factory } from "../typechain";

const tokenURI = "ipfs://QmQu2oEk2ZmeDFcoaJsCPSnFGPkoDUPWEyVhT6VRZSuxbz/0"

type TestTarget = {
  contract: ERC721Admin,
  admins: SignerWithAddress[],
  users: SignerWithAddress[],
}

const ADMIN_CODE = ethers.utils.formatBytes32String("admin");

describe("ER721Admin", function () {
  let tx;
  const getTargets = async (): Promise<TestTarget> => {
    const signers = await ethers.getSigners();
    const admins = signers.slice(0, 500);
    const users = signers.slice(500, 1000);
    await deployments.fixture(["ERC721Admin"]);
    const deployment = await deployments.get("ERC721Admin");
    return {
      contract: ERC721Admin__factory.connect(deployment.address, admins[0]),
      admins,
      users,
    };
  }

  it("Mint to", async function () {
    const { contract, admins, users } = await getTargets();
    const tokenId = 0;
    const idx = 0;
    await expect(contract.connect(users[idx]).mintTo(users[idx].address, tokenId, tokenURI))
    .to.be.revertedWith(`AccessControl: account ${users[idx].address.toLowerCase()} is missing role ${ADMIN_CODE}`);
    tx = await contract.connect(admins[idx]).mintTo(users[idx].address, tokenId, tokenURI);
    await tx.wait();
    assert( (await contract.balanceOf(users[idx].address)).eq(1), "balance error" );
    assert( (await contract.ownerOf(tokenId)) === users[idx].address, "owner error" );
  });

  it("Admin Transfer", async function () {
    const { contract, admins, users } = await getTargets();
    const tokenId = 0;
    const idx = 1;
    tx = await contract.connect(admins[idx]).mintTo(users[idx].address, tokenId, tokenURI);
    await tx.wait();
    await expect(contract.connect(users[idx]).adminTransfer(users[idx].address, tokenId))
    .to.be.revertedWith(`AccessControl: account ${users[idx].address.toLowerCase()} is missing role ${ADMIN_CODE}`);
    tx = await contract.connect(admins[idx]).adminTransfer(users[idx].address, tokenId);
    await tx.wait();
    assert( (await contract.balanceOf(users[idx-1].address)).eq(0), "user0 balance error" );
    assert( (await contract.balanceOf(users[idx].address)).eq(1), "user1 balance error" );
    assert( (await contract.ownerOf(tokenId)) === users[idx].address, "owner error" );
  });

  it("Admin Burn", async function () {
    const { contract, admins, users } = await getTargets();
    const tokenId = 0;
    const idx = 2;
    tx = await contract.connect(admins[idx]).mintTo(users[idx].address, tokenId, tokenURI);
    await tx.wait();
    await expect(contract.connect(users[idx]).adminBurn(tokenId))
    .to.be.revertedWith(`AccessControl: account ${users[idx].address.toLowerCase()} is missing role ${ADMIN_CODE}`);
    tx = await contract.connect(admins[idx]).adminBurn(tokenId);
    await tx.wait();
    assert( (await contract.balanceOf(users[idx].address)).eq(0), "user2 balance error" );
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
