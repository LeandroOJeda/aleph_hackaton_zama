require("@nomicfoundation/hardhat-ignition");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-viem");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};