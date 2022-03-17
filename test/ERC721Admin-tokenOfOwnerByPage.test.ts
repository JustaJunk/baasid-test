import { expect } from "chai";
import { BigNumber } from "ethers";
import { setupMinted } from "./fixture/setup-erc721";

describe("ER721Admin - tokenOfOwnerByPage", function () {

  it("Page index is 0", async function () {
    const { contract, user } = await setupMinted();
    const amountPerPage = Math.round(Math.random() * 50);
    const tokenIds = await contract.tokenOfOwnerByPage(user.address, 0, amountPerPage);
    expect(tokenIds.length).equal(0);
  });

  it("Amount per page is 0", async function () {
    const { contract, user } = await setupMinted();
    const pageIdx = Math.round(Math.random() * 3);
    const tokenIds = await contract.tokenOfOwnerByPage(user.address, pageIdx, 0);
    expect(tokenIds.length).equal(0);
  });

  it("User has certain tokens", async function () {
    const tokenAmount = Math.round(Math.random() * 200);
    const amountPerPage = Math.round(Math.random() * 50);
    console.log("tokenAmount", tokenAmount);
    console.log("amountPerPage", amountPerPage);
    const { contract, user } = await setupMinted(tokenAmount);
    const tokenIds = [...Array(tokenAmount).keys()];
    const pageCount = Math.ceil(tokenIds.length/amountPerPage);
    const pageIndices = [...Array(pageCount).keys()].map(pid => pid + 1);
    pageIndices.map(async (pageIdx) => {
      expect(await contract.tokenOfOwnerByPage(user.address, pageIdx, amountPerPage))
      .equal(
        tokenIds.slice((pageIdx - 1) * amountPerPage, pageIdx * amountPerPage)
        .map(tid => BigNumber.from(tid))
      );
    });
  });

});
