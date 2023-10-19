const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json")

module.exports = {
  contracts_build_directory: "./public/contracts",

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
