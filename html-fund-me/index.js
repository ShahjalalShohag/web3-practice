import { ethers } from "./ethers-5.6.esm.min.js";
import { contractAddress, contractABI } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error(error);
    }
    connectButton.innerHTML = "Connected";
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    connectButton.innerHTML = "Install MetaMask Please!";
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  } else {
    connectButton.innerHTML = "Install MetaMask Please!";
  }
}

async function fund() {
  const amount = document.getElementById("fundAmount").value;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const txnResponse = await contract.fund({
        value: ethers.utils.parseEther(amount),
      });
      await listenForTxnMine(txnResponse, provider);
      console.log("Funded!");
    } catch (error) {
      console.error(error);
    }
  } else {
    fundButton.innerHTML = "Install MetaMask Please!";
  }
}

function listenForTxnMine(txnResponse, provider) {
  return new Promise((resolve, reject) => {
    provider.once(txnResponse.hash, (txnReceipt) => {
      console.log("Transaction Mined!");
      console.log(txnReceipt);
      resolve();
    });
  });
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const txnResponse = await contract.withdraw();
      await listenForTxnMine(txnResponse, provider);
      console.log("Withdrawn!");
    } catch (error) {
      console.error(error);
    }
  } else {
    fundButton.innerHTML = "Install MetaMask Please!";
  }
}
