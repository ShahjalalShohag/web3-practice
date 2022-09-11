const { ethers } = require("hardhat");

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying SimpleStorage...");
  const simpleStorage = await simpleStorageFactory.deploy();
  // console.log(simpleStorage);
  const receipt = await simpleStorage.deployed();
  console.log("SimpleStorage deployed to:", simpleStorage.address);
  const value = await simpleStorage.retrieve();
  console.log("Initial value:", value.toString());
  const transaction = await simpleStorage.store(5);
  await transaction.wait();
  const newValue = await simpleStorage.retrieve();
  console.log("New value:", newValue.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
