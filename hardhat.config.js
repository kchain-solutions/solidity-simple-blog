require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const MUMBAI_ENDPOINT = process.env.MUMBAI_ENDPOINT;
const GOERLI_ENDPOINT = process.env.MUMBAI_ENDPOINT;

function accounts() {
  return { mnemonic: MNEMONIC };
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: MUMBAI_ENDPOINT,
      accounts: accounts()
    },
    goerli: {
      url: GOERLI_ENDPOINT,
      accounts: accounts()
    }
  }, settings: {
    optimizer: {
      enabled: true,
      runs: 100,
    }
  }
};
