import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MAX_ADMIN_COUNT } from "../misc/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const admins = await hre.getUnnamedAccounts();
  console.log("Deployer:", admins[0]);
  const contract = await deploy("ERC721Admin", {
    args: [admins.slice(0, MAX_ADMIN_COUNT)],
    from: admins[0],
  });
  console.log("ERC721Admin deployed to:", contract.address);
};
export default func;
func.tags = ["all", "ERC721Admin"];