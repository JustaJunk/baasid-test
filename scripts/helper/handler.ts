import { ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { existsSync, mkdirSync, writeFileSync } from "fs";

const LOG_PATH = './test-logs';

type BlockInfo = {
  blockNumber: number,
  blockHash: string,
  blockTxCount: number,
  blockGasUsed: number,
  blockEndTime: number,
}

type BenchmarkReport = {
  txCount: number,
  blockConsumed: number,
  gasConsumed: number,
  timeConsumed: number,
  TPS: number,
  GPS: number,
  SPB: number,
  blockInfos: BlockInfo[],
}

export async function makeReportPath(filename: string) {
  if (!existsSync(LOG_PATH)) mkdirSync(LOG_PATH);
  const { chainId } = await ethers.provider.getNetwork();
  const folder = `${LOG_PATH}/${chainId}`;
  if (!existsSync(folder)) mkdirSync(folder);
  return `${folder}/${filename}.json`;
}

export class TxHandler {
  
  blockInfoMap: Map<number, BlockInfo>;

  totalTxCount: number;

  constructor() {
    this.blockInfoMap = new Map<number, BlockInfo>();
    this.totalTxCount = 0;
  }

  async handle(tx: ContractTransaction | undefined): Promise<void> {
    if (!tx) return;
    ++this.totalTxCount;
    const receipt = await tx.wait();
    if (!this.blockInfoMap.has(receipt.blockNumber)) {
      console.log(receipt.blockNumber);
      this.blockInfoMap.set(
        receipt.blockNumber,
        {
          blockNumber: receipt.blockNumber,
          blockHash: receipt.blockHash,
          blockTxCount: 1,
          blockGasUsed: receipt.cumulativeGasUsed.toNumber(),
          blockEndTime: Date.now(),
        }
      );
    }
    else {
      const previousBlockInfo = this.blockInfoMap.get(receipt.blockNumber);
      if (!previousBlockInfo) return;
      const newBlockCount = previousBlockInfo.blockTxCount + 1;
      const newGasUsed = 
        receipt.cumulativeGasUsed.gt(previousBlockInfo.blockGasUsed)?
        receipt.cumulativeGasUsed.toNumber():
        previousBlockInfo.blockGasUsed;
      this.blockInfoMap.set(
        receipt.blockNumber,
        {
          blockNumber: receipt.blockNumber,
          blockHash: receipt.blockHash,
          blockTxCount: newBlockCount,
          blockGasUsed: newGasUsed,
          blockEndTime: previousBlockInfo.blockEndTime,
        }
      );
    }
  }

  async benchmark(filename: string | undefined) {
    const blockInfos = [...this.blockInfoMap.values()];
    const validBlockInfos = blockInfos.slice(1, -1);
    const validBlockCount = validBlockInfos.length;
    if (validBlockCount < 2) return;
    const timeConsumed = (validBlockInfos[validBlockCount-1].blockEndTime - blockInfos[0].blockEndTime)/1000;
    let totalTxCount = 0;
    let totalGas = 0;
    validBlockInfos.map((blockInfo) => {
      console.log("\nBlockNumber:", blockInfo.blockNumber);
      console.log("BlockHash:", blockInfo.blockHash);
      const gasUsed = blockInfo.blockGasUsed;
      const txCount = blockInfo.blockTxCount;
      console.log("TxCount:", txCount);
      console.log("GasUsed:", gasUsed);
      totalTxCount += txCount;
      totalGas += gasUsed;
    });
    const txCount = totalTxCount;
    const gasConsumed = totalGas;
    const blockConsumed = validBlockCount;
    const TPS = parseFloat((txCount/timeConsumed).toFixed(2));
    const GPS = parseFloat((gasConsumed/timeConsumed).toFixed(2));
    const SPB = parseFloat((timeConsumed/blockConsumed).toFixed(2));
    console.log("\nTx count :", txCount);
    console.log("Gas consumed:", gasConsumed);
    console.log("Block consumed:", blockConsumed);
    console.log("Time consumed:", timeConsumed);
    console.log("TPS:", TPS);
    console.log("GPS:", GPS);
    console.log("SPB:", SPB);

    const report: BenchmarkReport = {
      txCount,
      blockConsumed,
      gasConsumed,
      timeConsumed,
      TPS,
      GPS,
      SPB,
      blockInfos,
    }
    
    if (filename) {
      const filePath = await makeReportPath(filename);
      writeFileSync(
        filePath,
        JSON.stringify(report, null, 4)
      );
    }
  }
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}