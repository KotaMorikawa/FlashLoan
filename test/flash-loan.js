const { expect, asset } = require("chai");
const { ethers } = require("hardhat");

const { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require("../config");

describe("Flash Loan", async function () {
  it("Should take aflash loan and be able to  return it", async function () {
    const FlashLoanExample = await ethers.deployContract("FlashLoanExample", [
      POOL_ADDRESS_PROVIDER,
    ]);
    await FlashLoanExample.waitForDeployment();

    const token = await ethers.getContractAt("IERC20", DAI);
    const BALANCE_AMOUNT_DAI = ethers.parseEther("2000");
    const signer = await ethers.getImpersonatedSigner(DAI_WHALE);
    await token
      .connect(signer)
      .transfer(FlashLoanExample.target, BALANCE_AMOUNT_DAI);

    const txn = await FlashLoanExample.createFlashLoan(DAI, 10000);
    await txn.wait();

    // By this point, we should have executed the flash loan and paid back (10,000 + premium) DAI to Aave
    // Do not function arbitrage in this time.

    const remainingBalance = await token.balanceOf(FlashLoanExample.target);

    expect(remainingBalance).to.lessThan(BALANCE_AMOUNT_DAI);
  });
});
