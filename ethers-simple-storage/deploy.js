const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;

const wallet = new ethers.Wallet(privateKey, provider);
const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
const binary = fs.readFileSync(
  "./SimpleStorage_sol_SimpleStorage.bin",
  "utf-8"
);

async function main() {
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying contract...");
  const contract = await contractFactory.deploy();
  console.log("Contract deployed to address:", contract.address);
  const txnReceipt = await contract.deployTransaction.wait();
  //   console.log(contract.deployTransaction);
  //   console.log(txnReceipt);
  const number = await contract.retrieve();
  console.log("Retrieved number:", number.toString());
  const setTxn = await contract.store(42);
  const receipt = await setTxn.wait();
  //   console.log("Transaction receipt:", receipt);
  const newNumber = await contract.retrieve();
  console.log("Retrieved number:", newNumber.toString());
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
