import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const [ deployer ] = await hre.getUnnamedAccounts();
  await deploy("ERC20Usdf", {
    args: [],
    from: deployer,
    log: true,
  });
};
export default func;
func.tags = ["ERC20Usdf"];