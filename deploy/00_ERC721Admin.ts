import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MAX_ADMIN_COUNT, BAASID_CHAINS, BASE_URI } from "../misc/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const admins = await hre.getUnnamedAccounts();
  const { network } = hre;
  console.log("Deployer:", admins[0]);
  const contract = await deploy("ERC721Admin", {
    args: [admins.slice(0, MAX_ADMIN_COUNT), BASE_URI],
    from: admins[0],
    gasPrice: BAASID_CHAINS.includes(hre.network.name)? '0x0': undefined,
  });
  console.log("ERC721Admin deployed to:", contract.address);
};
export default func;
func.tags = ["all", "ERC721Admin"];