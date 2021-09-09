require("@nomiclabs/hardhat-waffle");
const fs = require("fs")
const projectId = "c360ddc600e940a6898f1e1d3e7f1c64"

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: ['3208fbf74c9377ad0e7fc164f995bb90f77063390f794d3ce9d617dce2cff467'],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: ['3208fbf74c9377ad0e7fc164f995bb90f77063390f794d3ce9d617dce2cff467'],
    },
  },
  solidity: "0.8.4",
};
