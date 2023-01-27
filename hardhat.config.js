require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const fs = require('fs');

const MNEMONIC = process.env.MNEMONIC;
const MUMBAI_ENDPOINT = process.env.MUMBAI_ENDPOINT;
const GOERLI_ENDPOINT = process.env.GOERLI_ENDPOINT;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

function accounts() {
  return { mnemonic: MNEMONIC };
}

task("getBlogEvents", "Read all event of a BlogFactory contract")
  .addParam("contract", "Smart contract address")
  .setAction(async (taskArgs) => {

    const accounts = await hre.ethers.getSigners();

    let data = await fs.readFileSync("artifacts/contracts/BlogFactory.sol/BlogFactory.json");
    data = JSON.parse(data);
    const blockNumber = await ethers.provider.getBlockNumber();
    const contract = new ethers.Contract(taskArgs.contract, data.abi, accounts[0]);
    const eventFilter = await contract.queryFilter('NewBlog', blockNumber - 100000, blockNumber);
    console.log(eventFilter);
    for (let ev of eventFilter) {
      console.log('Event: ', ev.event, 'owner: ', ev.args.owner, ' blogAddr: ', ev.args.blogAddr);
    }
  });


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
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    }
  }
};
