import { useMoralis } from "react-moralis";
import { useEffect } from "react";
export default function ManualHeader() {
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();
  useEffect(() => {
    if (!isWeb3Enabled && window.localStorage.getItem("connected")) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);
  useEffect(() => {
    Moralis.onAccountChanged((new_account) => {
      console.log("Account changed to: ", new_account);
      if (new_account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, []);

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
            window.localStorage.setItem("connected", true);
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
}
