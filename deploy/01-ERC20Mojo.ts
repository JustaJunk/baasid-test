import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MAX_ADMIN_COUNT } from "../misc/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const users = await hre.getUnnamedAccounts();
  const deployer = users[0];
  await deploy("ERC20Mojo", {
    args: [ethers.utils.parseEther("1000000"), users.slice(0, MAX_ADMIN_COUNT)],
    from: deployer,
    log: true,
  });
};
export default func;
func.tags = ["ERC20Mojo"];