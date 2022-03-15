import { ContractTransaction } from "ethers";
import { writeFileSync } from "fs";

type BlockInfo = {
  blockHash: string,
  blockGasUsed: number,
}

type BenchmarkReport = {
  blockInfos: any,
  txCount: number,
  blockConsumed: number,
  gasConsumed: number,
  timeConsumed: number,
  TPS: number,
  GPS: number,
  SPB: number,
}

export class TxHandler {
  
  blockInfoMap: Map<number, BlockInfo>;

  totalGas: number;

  timer: number;

  txCounter: number;

  constructor() {
    this.blockInfoMap = new Map<number, BlockInfo>();
    this.totalGas = 0;
    this.timer = 0;
    this.txCounter = 0;
  }

  start() {
    this.timer = Date.now();
  }

  async handle(tx: ContractTransaction): Promise<void> {
    ++this.txCounter;
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

  benchmark(filename: string | undefined) {
    const timeConsumed = (Date.now() - this.timer)/1000;
    this.blockInfoMap.forEach((blockInfo, blockNumber) => {
      console.log("\nBlockNumber:", blockNumber);
      console.log("BlockHash:", blockInfo.blockHash);
      const gasUsed = blockInfo.blockGasUsed;
      console.log("GasUsed:", gasUsed);
      this.totalGas += gasUsed;
    });
    const txCount = this.txCounter;
    const gasConsumed = this.totalGas;
    const blockConsumed = this.blockInfoMap.size;
    const TPS = parseFloat((txCount/timeConsumed).toFixed(2));
    const GPS = parseFloat((gasConsumed/timeConsumed).toFixed(2));
    const SPB = parseFloat((timeConsumed/blockConsumed).toFixed(2));
    console.log("\nTx count :", txCount);
    console.log("Gas consumed:", gasConsumed);
    console.log("Block consumed:", blockConsumed);
    console.log("TPS:", TPS);
    console.log("GPS:", GPS);
    console.log("SPB:", SPB);

    const report = {
      blockInfos: Object.fromEntries(this.blockInfoMap),
      txCount,
      blockConsumed,
      gasConsumed,
      timeConsumed,
      TPS,
      GPS,
      SPB,
    }
    
    if (filename) {
      writeFileSync(
        filename,
        JSON.stringify(report, null, 4)
      );
    }
  }
}