import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { admin } = await hre.getNamedAccounts();
  const contract = await deploy("ERC721Admin", { from: admin });
  console.log("ERC721Admin deployed to:", contract.address);
};
export default func;
func.tags = ["ERC721Admin"];