import { GlowButton } from "../../common/GlowButton";
import { useActiveWeb3React } from "../../../hooks";
import { handleUnlock, getStatus } from "../../../functions/backend";

export interface ReadyToUnlockProps {
  isOn: boolean;
  handleClick: (bool) => void;
}

export const ReadyToUnlock = ({ isOn, handleClick }: ReadyToUnlockProps) => {
  const { chainId, account, connector } = useActiveWeb3React();
  const handleUnlock = async () => {
    let status = 200; // TODO: successful?
    try {
      const poeState = isOn ? "OFF" : "ON";
      if (!account) {
        return;
      }
      const resp = await fetch("http://localhost:4568/togglePoe", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ poeState, fromAddress: account.toUpperCase() }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      status = resp.status;
    } catch (e) {
    } finally {
      handleClick(status == 200);
    }
  };

  return (
    <div className="bg-indigo-800 rounded-xl flex flex-col justify-center items-center">
      <div className="flex-1 max-w-7xl py-2 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mt-1 text-4xl font-normal text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            {isOn
              ? "Your wallet is currently hot and ready to do your bidding"
              : "Your wallet is offline and secure"}
          </p>
        </div>
      </div>
      <div className="justify-center items-center mb-auto mx-auto">
        <GlowButton onClick={handleUnlock}>
          {isOn ? "Deactivate" : "Activate"} wallet
        </GlowButton>
      </div>
    </div>
  );
};

export default ReadyToUnlock;
