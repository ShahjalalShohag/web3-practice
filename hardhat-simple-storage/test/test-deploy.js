const { assert } = require("chai");

describe("Simple Storage", function () {
  beforeEach(async function () {
    this.SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    this.simpleStorage = await this.SimpleStorage.deploy();
    await this.simpleStorage.deployed();
  });
  it("Should return the first value 0", async function () {
    const value = await this.simpleStorage.retrieve();
    assert.equal(value.toString(), "0");
  });
  it("Should return the new value 5", async function () {
    const transaction = await this.simpleStorage.store(5);
    await transaction.wait();
    const newValue = await this.simpleStorage.retrieve();
    assert.equal(newValue.toString(), "5");
  });
});
