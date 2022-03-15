import { ethers } from "hardhat";
import { getERC20Mojo } from "../../misc/contract-hooks";
import { TxHandler } from "../helper/handler";

async function main() {

  // Get ERC20Mojo
  const contract = await getERC20Mojo();
  if (!contract) return;

  // Get users
  const users = await ethers.getSigners();
  const size = users.length;
  console.log("users count:", size, "\n");

  // Transfer tokens
  const startTime = Date.now();
  const txHandler = new TxHandler();
  Promise.all(users.map(async (user, userId) => {
    const balance = await contract.balanceOf(user.address);
    return txHandler.handle(
      await contract.connect(users[userId]).transfer(
        users[(userId*7+1)%size].address,
        balance.div(2),
      )
      .then((tx) => {return tx})
      .catch((err) => {throw err})
    );
  }))
  .then(() => {
    const endTime = Date.now();
    txHandler.showHistory();
    txHandler.saveHistory(`./test-logs/erc20_transfer_${size}`);
    const costSec = (endTime - startTime)/1000;
    console.log("Time cost:", costSec, "sec");
    console.log("Gas / sec:", Math.floor(txHandler.totalGasCost/costSec));
    console.log("Tx  / sec:", Math.floor(size/costSec));
  })
  .catch((err) => {
    throw err;
  });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
