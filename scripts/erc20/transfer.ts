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
  const status = await Promise.all(users.map(async (user, userId) => {
    try {
      const balance = await contract.balanceOf(user.address);
      return txHandler.handle(
        await contract.connect(users[userId]).transfer(
          users[(userId*7)%size].address,
          balance.div(2),
      ));
    } catch (err: any) {
      console.error("[ERROR]", userId, err.message);
    }
  }));
  const endTime = Date.now();
  const invalidCount = status.filter((s) => s !== 1).length;
  if (invalidCount == 0) {
    txHandler.showHistory();
    txHandler.saveHistory(`./test-history/erc20_transfer_${size}`);
    console.log("Time cost:", (endTime - startTime)/1000, "sec");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
