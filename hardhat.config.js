require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      // メインネットからフォークする方法
      forking: {
        url: process.env.POLYGON_RPC_URL,
      },
    },
  },
};
