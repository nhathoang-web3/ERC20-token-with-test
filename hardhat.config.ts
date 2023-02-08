import { HardhatUserConfig, NetworkUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
require("dotenv").config();


const goerli: NetworkUserConfig = {
  url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  chainId: 5,
  accounts: [process.env.PRIVATE_KEY!],
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      gas: 120000000,
      blockGasLimit: 0x1fffffffffffff,
    },
    goerli,
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 99999,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
