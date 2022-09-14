import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="p-2 border-b-2 flex flex-row">
      <div className="py-4 px-4 font-bold text-2xl">
        Awesome Decentralized Lottery
        <div className="text-sm font-normal">
          Enter the raffle for a small entrance fee and get all the prize money
          by winning the lottery
        </div>
      </div>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
