require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: ['3208fbf74c9377ad0e7fc164f995bb90f77063390f794d3ce9d617dce2cff467'],
    },
  },
  solidity: "0.8.4",
};
