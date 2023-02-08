import { ethers } from "hardhat";

async function main() {
  const name = "Omatech Token";
  const symbol = "OMT";
  const decimals = 8;
  const supply = 1_000_000_000 * 10 ** decimals;

  const [signer] = await ethers.getSigners();
  const ownerAddress = await signer.getAddress();

  const ERC20Token = await ethers.getContractFactory("ERC20Token");
  const erc20Token = await ERC20Token.deploy(
    name,
    symbol,
    String(supply),
    ownerAddress
  );

  await erc20Token.deployed();

  console.log(`Contract deployed to ${erc20Token.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
