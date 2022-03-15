import { BigNumber, ContractTransaction } from "ethers";
import { writeFileSync } from "fs";

type BlockInfo = {
  blockHash: string,
  blockGasUsed: BigNumber,
}

export class TxHandler {
  
  blockInfoMap: Map<number, BlockInfo>;

  constructor() {
    this.blockInfoMap = new Map<number, BlockInfo>();
  }

  async handle(tx: ContractTransaction): Promise<number | undefined> {
    const receipt = await tx.wait();
    if (!this.blockInfoMap.has(receipt.blockNumber)) {
      console.log(receipt.blockNumber);
      this.blockInfoMap.set(
        receipt.blockNumber,
        {
          blockHash: receipt.blockHash,
          blockGasUsed: receipt.cumulativeGasUsed,         
        }
      );
    }
    else {
      const previousBlockInfo = this.blockInfoMap.get(receipt.blockNumber);
      if (!previousBlockInfo) return;
      if (receipt.cumulativeGasUsed.gt(previousBlockInfo.blockGasUsed)) {
        this.blockInfoMap.set(
          receipt.blockNumber,
          {
            blockHash: receipt.blockHash,
            blockGasUsed: receipt.cumulativeGasUsed,         
          }
        );
      }
    }
    return receipt.status;
  }

  showHistory() {
    let gasCost = 0;
    this.blockInfoMap.forEach((blockInfo, blockNumber) => {
      console.log("\nBlockNumber:", blockNumber);
      console.log("BlockHash:", blockInfo.blockHash);
      const gasUsed = blockInfo.blockGasUsed.toNumber();
      console.log("GasUsed:", gasUsed);
      gasCost += gasUsed;
    })
    console.log("\nBlock cost:", this.blockInfoMap.size);
    console.log("Gas cost:", gasCost);
  }

  saveHistory(filename: string) {
    writeFileSync(
      filename,
      JSON.stringify(this.blockInfoMap, null, 4)
    );
  }
}