import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20Token Testing", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const name = "Omatech Token";
    const symbol = "OMT";
    const decimals = 8;
    const supply = 1_000_000_000 * 10 ** decimals;
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    console.log(await otherAccount.getAddress());

    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    const erc20Token = await ERC20Token.deploy(
      name,
      symbol,
      String(supply),
      await owner.getAddress()
    );

    return { erc20Token, name, symbol, decimals, supply, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      const { erc20Token, name } = await loadFixture(deployOneYearLockFixture);

      expect(await erc20Token.name()).to.equal(name);
    });

    it("Should set the right symbol", async function () {
      const { erc20Token, symbol } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await erc20Token.symbol()).to.equal(symbol);
    });

    it("Should set the right decimals", async function () {
      const { erc20Token, decimals } = await loadFixture(
        deployOneYearLockFixture
      );
      expect(await erc20Token.decimals()).to.equal(decimals);
    });

    it("Should set the right supply", async function () {
      const { erc20Token, supply } = await loadFixture(
        deployOneYearLockFixture
      );
      expect(await erc20Token.totalSupply()).to.equal(String(supply));
    });

    it("Should mint for the onwer total supply", async function () {
      const { erc20Token, supply, owner } = await loadFixture(
        deployOneYearLockFixture
      );
      expect(await erc20Token.balanceOf(await owner.getAddress())).to.equal(
        String(supply)
      );
    });
  });

  describe("Transfer & TransferFrom", function () {
    it("Should emit Transfer event", async function () {
      const { erc20Token, owner, otherAccount } = await loadFixture(
        deployOneYearLockFixture
      );
      await expect(
        erc20Token.transfer(await otherAccount.getAddress(), "100000")
      )
        .to.emit(erc20Token, "Transfer")
        .withArgs(
          await owner.getAddress(),
          await otherAccount.getAddress(),
          "100000"
        );
    });

    it("Should revert transaction because not enough balance", async function () {
      const { erc20Token, owner, otherAccount } = await loadFixture(
        deployOneYearLockFixture
      );
      await expect(
        erc20Token
          .connect(otherAccount)
          .transfer(await owner.getAddress(), "100000")
      ).to.be.rejectedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should revert the transaction because spender didn't allowance for sender", async function () {
      const { erc20Token, owner, otherAccount } = await loadFixture(
        deployOneYearLockFixture
      );
      await expect(
        erc20Token.transferFrom(
          await otherAccount.getAddress(),
          await owner.getAddress(),
          "10000"
        )
      ).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Should emit Transfer event", async function () {
      const { erc20Token, owner, otherAccount } = await loadFixture(
        deployOneYearLockFixture
      );
      await erc20Token.approve(await otherAccount.getAddress(), "1000000");

      await expect(
        erc20Token.connect(otherAccount).transferFrom(
          await owner.getAddress(),
          await otherAccount.getAddress(),
          "1000000"
        )
      )
        .to.emit(erc20Token, "Transfer")
        .withArgs(
          await owner.getAddress(),
          await otherAccount.getAddress(),
          "1000000"
        );
    });
  });
});
