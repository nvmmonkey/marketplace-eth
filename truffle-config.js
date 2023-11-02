const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json");

module.exports = {
  contracts_build_directory: "./public/contracts",

  plugins: ["truffle-plugin-verify"],

  api_keys: { etherscan: keys.ETHERSCAN_API },

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC,
          },
          providerOrUrl: `wss://sepolia.infura.io/ws/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0,
        }),
      network_id: "11155111",
      gasPrice: 2500000010, //how much we are willing to spend for unit of gas
      networkCheckoutTimeout: 10000,
      timeoutBlocks: 200, //number of blocks before deployment time-out
    },
  },

  compilers: {
    solc: {
      version: "0.8.4",
    },
  },
};

// transaction hash:0x18dd655beca174165cbd429bd733267eb84d114aff88a34b09e6b61d4929455e
// contract address:0xEd212Eff62b9F4BE3c18451da621F03D1ba18abc
// Gas Price: 0.00000000250000001 ETH * 1495078 gas unit used
// => 0.003737695015 ETH used
// => 0.00373769501495078 on txs
