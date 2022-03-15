import { BigNumber, ContractTransaction } from "ethers";
import { writeFileSync } from "fs";

type BlockInfo = {
  blockHash: string,
  blockGasUsed: number,
}

export class TxHandler {
  
  blockInfoMap: Map<number, BlockInfo>;

  totalGasCost: number;

  constructor() {
    this.blockInfoMap = new Map<number, BlockInfo>();
    this.totalGasCost = 0;
  }

  async handle(tx: ContractTransaction): Promise<void> {
    if (!tx) return;
    const receipt = await tx.wait();
    if (!this.blockInfoMap.has(receipt.blockNumber)) {
      console.log(receipt.blockNumber);
      this.blockInfoMap.set(
        receipt.blockNumber,
        {
          blockHash: receipt.blockHash,
          blockGasUsed: receipt.cumulativeGasUsed.toNumber(),         
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
            blockGasUsed: receipt.cumulativeGasUsed.toNumber(),         
          }
        );
      }
    }
  }

  showHistory() {
    this.blockInfoMap.forEach((blockInfo, blockNumber) => {
      console.log("\nBlockNumber:", blockNumber);
      console.log("BlockHash:", blockInfo.blockHash);
      const gasUsed = blockInfo.blockGasUsed;
      console.log("GasUsed:", gasUsed);
      this.totalGasCost += gasUsed;
    })
    console.log("\nBlock cost:", this.blockInfoMap.size);
    console.log("Gas cost:", this.totalGasCost);
  }

  saveHistory(filename: string) {
    writeFileSync(
      filename,
      JSON.stringify(Object.fromEntries(this.blockInfoMap), null, 4)
    );
  }
}