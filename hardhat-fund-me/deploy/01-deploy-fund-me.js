const { network } = require("hardhat");
module.exports = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const chainId = network.config.chainId;
  console.log("Deploying FundMe...");
  const { deployer } = await getNamedAccounts();
  console.log(deployer);
  const mock = await deployments.get("MockV3Aggregator");
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [mock.address],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  console.log("FundMe deployed to:", fundMe.address);
};
module.exports.tags = ["all", "FundMe"];
