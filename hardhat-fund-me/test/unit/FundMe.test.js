const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { assert, expect } = require("chai");
describe("FundMe Testing", async function () {
  let fundMe, deployer, mockPriceFeed;
  beforeEach(async function () {
    console.log("beforeEach");
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    mockPriceFeed = await ethers.getContract("MockV3Aggregator", deployer);
    fundMe = await ethers.getContract("FundMe", deployer);
  });
  it("Checks the owner and price feed", async function () {
    const owner = await fundMe.i_owner();
    assert.equal(owner, deployer);
    const priceFeed = await fundMe.priceFeed();
    assert.equal(priceFeed, mockPriceFeed.address);
  });
  it("Fails when not enough ether is sent", async function () {
    await expect(fundMe.fund()).to.be.revertedWith(
      "You need to spend more ETH!"
    );
  });
  it("Funds the contract and checks the balance", async function () {
    await fundMe.fund({
      value: ethers.utils.parseEther("1"),
    });
    const contractBalance = await fundMe.addressToAmountFunded(deployer);
    assert.equal(contractBalance.toString(), ethers.utils.parseEther("1"));
    const addr = await fundMe.funders(0);
    assert.equal(addr, deployer);
  });
  describe("Testing withdraw", async function () {
    beforeEach(async function () {
      await fundMe.fund({
        value: ethers.utils.parseEther("1"),
      });
    });
    it("Asserts the owner balance after withdraw", async function () {
      const prevBalance = await fundMe.provider.getBalance(deployer);
      const txnResponse = await fundMe.withdraw();
      const txn = await txnResponse.wait();
      const { gasUsed, effectiveGasPrice } = txn;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      const updBalance = await fundMe.provider.getBalance(deployer);
      assert.equal(
        prevBalance.sub(gasCost).add(ethers.utils.parseEther("1")).toString(),
        updBalance.toString()
      );
    });
    it("Checks withdraw fails when not owner", async function () {
      const [_, addr1] = await ethers.getSigners();
      await expect(fundMe.connect(addr1).withdraw()).to.be.revertedWith(
        "NotOwner"
      );
    });
  });
});
