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

## Setup RPC
Copy `.env.example` to `.env` and modify the RPC URL, for example:
```
BAASID_URL="http://192.168.2.181:8545"
```
And source `.env` if necessary
```
source .env
```

## Pressure test
Mint 100 tokens
```
yarn runs scripts/pressure-mint.ts --network baasid
yarn runs scripts/total-supply.ts --network baasid
```

## Reset contract
Destruct the contract and deploy again
```
yarn runs scripts/destruct.ts --network baasid
yarn deploy --network baasid
```