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

## Pressure test
Mint and burn tokens
```
yarn runs scripts/pressure-mint.ts --network baasid
yarn runs scripts/pressure-burn.ts --network baasid
```

## Reset contract
Destruct the contract and deploy again
```
yarn runs scripts/destruct.ts --network baasid
yarn deploy --network baasid
```