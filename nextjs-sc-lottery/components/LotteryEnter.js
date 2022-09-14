import { useState } from "react";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useWeb3Contract } from "react-moralis";
import { useEffect } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEnter() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex, 16);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [entranceFee, setEntranceFee] = useState("0");
  const [numberOfPlayers, setNumberOfPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState(0);
  const [contractBalance, setContractBalance] = useState("0");

  const dispatch = useNotification();

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const getContractBalance = async () => {
    console.log("Getting contract balance");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(raffleAddress);
    console.log("Contract balance: ", balance);
    return balance.toString();
  };

  const updateValues = async () => {
    const entranceFee = (await getEntranceFee()).toString();
    setEntranceFee(entranceFee);
    const numberOfPlayers = (await getNumberOfPlayers()).toString();
    setNumberOfPlayers(numberOfPlayers);
    const recentWinner = await getRecentWinner();
    setRecentWinner(recentWinner);
    const contractBalance = await getContractBalance();
    setContractBalance(contractBalance);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateValues();
    }
  }, [isWeb3Enabled]);
  return (
    <div>
      {raffleAddress ? (
        <div>
          <button
            onClick={async () => {
              await enterRaffle({
                onSuccess: async (tx) => {
                  await tx.wait();
                  updateValues();
                  dispatch({
                    type: "info",
                    message: `Transaction successful!`,
                    title: "Success",
                    position: "topR",
                    icon: "bell",
                  });
                },
                onError: (error) => {
                  dispatch({
                    type: "error",
                    message: `Transaction failed!`,
                    title: "Error",
                    position: "topR",
                    icon: "bell",
                  });
                  console.log(error);
                },
              });
            }}
          >
            Enter Raffle
          </button>
          <h1>Entrance Fee: {ethers.utils.formatEther(entranceFee)} ETH</h1>
          <h1>Number of Players: {numberOfPlayers}</h1>
          <h1>Recent Winner: {recentWinner}</h1>
          <h1>Total Money: {ethers.utils.formatEther(contractBalance)} ETH</h1>
        </div>
      ) : (
        <div>Contract not deployed on this network</div>
      )}
    </div>
  );
}
