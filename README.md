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
```
yarn runs scripts/pressure-mint.ts --network baasid
yarn runs scripts/query.ts --network baasid
```

## Reset contract
```
yarn runs scripts/destruct.ts --network baasid
yarn deploy --network baasid
```