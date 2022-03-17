# Baasid test

## Setup
Open a terminal
```
git clone https://github.com/JustaJunk/baasid-test.git
cd baasid-test
yarn
yarn compile
yarn deploy
yarn test
```

## ERC721 single pressure test
Single mint and burn tokens
```
yarn runs scripts/erc721/single-mint.ts --network baasid
yarn runs scripts/erc721/single-burn.ts --network baasid
```

## ERC721 batch pressure test
Batch mint and burn tokens
```
yarn runs scripts/erc721/batch-mint.ts --network baasid
yarn runs scripts/erc721/batch-burn.ts --network baasid
```

## ERC20 transfer test
```
yarn runs scripts/erc20/transfer.ts --network baasid
```

## Reset all contracts
Destruct the contract and deploy again
```
yarn runs scripts/destruct.ts --network baasid
yarn deploy --network baasid
```

## Special function
#### tokenOfOwnerByPage
```
參數
1. owner: 要訪問的錢包地址
2. pageIndex: 頁面編號，從1開始
3. amountPerPage: 一頁顯示的token數量，建議不超過50
回傳
tokenIdList: tokenId 的陣列

P.S.
pageIndex或amountPerPage為零會回傳[]
訪問範圍超過owner的持有數也會回傳[]
```