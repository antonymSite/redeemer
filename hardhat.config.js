/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config({path:__dirname+'/.env'})
 require("@nomiclabs/hardhat-waffle");
 require("@nomiclabs/hardhat-etherscan");
 require("@nomiclabs/hardhat-ethers");
 require('hardhat-contract-sizer');

 const { 
  ALCHEMY_GOERLI_API_KEY,
  ALCHEMY_MAINNET_API_KEY,
  CONTRACT_OWNER_PRIVATE_KEY,
  ETHERSCAN_API_KEY
} = process.env;
 
module.exports = {
  solidity: "0.8.13",
  defaultNetwork: "localhost",
  networks: {
    localhost: {},
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_MAINNET_API_KEY}`,
      accounts: [CONTRACT_OWNER_PRIVATE_KEY]
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_GOERLI_API_KEY}`,
      accounts: [CONTRACT_OWNER_PRIVATE_KEY]
    }
  },
  mocha: {
    timeout: 20000
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
  }
};