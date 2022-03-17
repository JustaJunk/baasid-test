import { expect } from "chai";
import { setupBasic } from "./fixture/setup-erc721";

describe("ER721Admin - General Test", function () {
  let tx;

  it("Mint to", async function () {
    const { contract, admins, users, baseURI, adminCode } = await setupBasic();
    const tokenId = 0;
    const idx = 0;
    await expect(contract.connect(users[idx]).adminMint(users[idx].address, tokenId))
    .to.be.revertedWith(`AccessControl: account ${users[idx].address.toLowerCase()} is missing role ${adminCode}`);
    tx = await contract.connect(admins[idx]).adminMint(users[idx].address, tokenId);
    await tx.wait();
    expect(await contract.tokenURI(0)).equal(`${baseURI}${tokenId}.json`);
    expect(await contract.balanceOf(users[idx].address)).equal(1);
    expect(await contract.ownerOf(tokenId)).equal(users[idx].address);
  });

  it("Admin Transfer", async function () {
    const { contract, admins, users, adminCode } = await setupBasic();
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
    const { contract, admins, users, adminCode } = await setupBasic();
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
    const { contract, admins } = await setupBasic();
    tx = await contract.connect(admins[0]).selfDestruct();
    await tx.wait();
    await expect(contract.balanceOf(admins[1].address))
    .to.be.revertedWith("");
  });
});
