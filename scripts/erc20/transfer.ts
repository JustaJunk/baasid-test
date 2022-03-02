import { ethers } from "hardhat";
import { getERC20Mojo } from "../../misc/contract-hooks";

const { provider } = ethers;

async function main() {

  // Get ERC20Mojo
  const contract = await getERC20Mojo();
  if (!contract) return;

  // Get users
  const users = await ethers.getSigners();
  const size = users.length;
  console.log("users count:", size);

  // Transfer tokens
  const startBlockNumber = await provider.getBlockNumber();
  const startTime = Date.now();
  let previousBlockNumber = -1;
  await Promise.all(users.map(async (user, userId) => {
    try {
      const balance = await contract.balanceOf(user.address);
      const tx = await contract.connect(users[userId]).transfer(
        users[(userId+1)%size].address,
        balance.div(2),
        { 
          gasPrice: 0
        }  
      );
      const receipt = await tx.wait();
      if (receipt.blockNumber > previousBlockNumber) {
        console.log("\nBlockNumber:", receipt.blockNumber);
        console.log("BlockHash:", receipt.blockHash);
        previousBlockNumber = receipt.blockNumber;
      }
      // console.log("TxHash:", receipt.transactionHash); // print tx hash
    } catch (err: any) {
      console.error("[ERROR]", userId, err.message);
    }
  }));
  const endBlockNumber = await provider.getBlockNumber();
  const endTime = Date.now();
  console.log("\nBlock cost:", endBlockNumber - startBlockNumber);
  console.log("Time cost:", (endTime - startTime)/1000, "sec");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
