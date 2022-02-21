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