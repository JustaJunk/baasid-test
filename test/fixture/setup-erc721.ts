import { deployments } from "hardhat";
import { ERC721Admin__factory } from "../../typechain";
import { MAX_ADMIN_COUNT, MAX_SIGNER_COUNT, BASE_URI } from "../../misc/constants";

export const setupBasic = deployments.createFixture(
  async ({deployments, ethers}, options) => {
    await deployments.fixture(["ERC721Admin"]);
    const artifact = await deployments.get("ERC721Admin");
    const signers = await ethers.getSigners();
    const admins = signers.slice(0, MAX_ADMIN_COUNT);
    const owner = admins[0];
    const users = signers.slice(MAX_ADMIN_COUNT, MAX_SIGNER_COUNT);
    const contract = ERC721Admin__factory.connect(artifact.address, owner);
    const provider = owner.provider;
    const baseURI = BASE_URI;
    const adminCode = await contract.ADMIN();
    return {
      owner,
      admins,
      users,
      contract,
      provider,
      baseURI,
      adminCode,
    }
  }
)

export const setupMinted = deployments.createFixture(
    async ({deployments, ethers}, mintAmount: number | undefined) => {
      await deployments.fixture(["ERC721Admin"]);
      const artifact = await deployments.get("ERC721Admin");
      const [owner, user] = await ethers.getSigners();
      const contract = ERC721Admin__factory.connect(artifact.address, owner);
      const tokenIndices = [...Array(mintAmount?mintAmount:32).keys()];
      await (await contract.adminBatchMint(
        tokenIndices.map(() => user.address),
        tokenIndices
      )).wait();
      const provider = owner.provider;
      const baseURI = BASE_URI;
      return {
        owner,
        user,
        contract,
        provider,
        baseURI,
      }
    },
  )