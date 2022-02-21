import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MAX_INIT_USER } from "../misc/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const users = await hre.getUnnamedAccounts();
  const deployer = users[0];
  const contract = await deploy("ERC20Mojo", {
    args: [ethers.utils.parseEther("1000000"), users.slice(0, MAX_INIT_USER)],
    from: deployer,
  });
  console.log("ERC20Mojo deployed to:", contract.address);
};
export default func;
func.tags = ["all", "ERC20Mojo"];