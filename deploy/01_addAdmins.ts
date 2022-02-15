import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MAX_ADMIN_ONCE } from "../misc/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { get, execute } = hre.deployments;
  const signers = await hre.getUnnamedAccounts();
  const deployer = signers[0];
  const newAdmins = signers.slice(MAX_ADMIN_ONCE, MAX_ADMIN_ONCE * 2);
  const contract = await get("ERC721Admin");
  if (contract.address) {
    await execute("ERC721Admin", {from: deployer}, "addAdmins", newAdmins);
    console.log("ERC721Admin add", newAdmins.length, "admins");
  }
};
export default func;
func.tags = ["ERC721Admin"];