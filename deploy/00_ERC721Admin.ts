import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as dotenv from "dotenv";

dotenv.config();

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (!process.env.MNEMONIC) {
      console.error("[ERROR] mnemonic not set");
      return;
  }
  const { deploy } = hre.deployments;
  const admins = await hre.getUnnamedAccounts();
  console.log("Admin:", admins[0]);
  const contract = await deploy("ERC721Admin", {
    args: [admins.slice(0, 499)],
    from: admins[0],
  });
  console.log("ERC721Admin deployed to:", contract.address);
};
export default func;
func.tags = ["ERC721Admin"];