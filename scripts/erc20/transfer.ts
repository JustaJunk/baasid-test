import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { getERC20Mojo } from "../../misc/contract-hooks";
import { TxHandler, delay } from "../helper/handler";

async function main() {

  // Get ERC20Mojo
  const contract = await getERC20Mojo();
  if (!contract) return;

  // Get users
  const users = await ethers.getSigners();
  const size = users.length;
  console.log("users count:", size, "\n");

  // Transfer tokens
  const txHandler = new TxHandler();
  Promise.all(users.map(async (user, userId) => {
    // await delay(userId*20);
    const balance = await contract.balanceOf(user.address).catch(() => BigNumber.from(0));
    return txHandler.handle(
      await contract.connect(users[userId]).transfer(
        users[(userId*7+1)%size].address,
        balance.div(2),
      )
      .catch(() => undefined)
    );
  }))
  .then(() => txHandler.benchmark(`erc20_transfer_${txHandler.totalTxCount}`))
  .catch((err) => {throw err});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
