import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MAX_ADMIN_COUNT, BASE_URI } from "../misc/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const admins = await hre.getUnnamedAccounts();
  await deploy("ERC721Admin", {
    args: [admins.slice(0, MAX_ADMIN_COUNT), BASE_URI],
    from: admins[0],
    log: true,
  });
};
export default func;
func.tags = ["ERC721Admin"];