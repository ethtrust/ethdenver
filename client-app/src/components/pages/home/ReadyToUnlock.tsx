import { useState } from "react";
import { GlowButton } from "../../common/GlowButton";
import { useActiveWeb3React } from "../../../hooks";
import { handleUnlock, getStatus } from "../../../functions/backend";

export interface ReadyToUnlockProps {
  isOn?: boolean;
  handleClick: (b: any) => void;
}

export const ReadyToUnlock = ({ handleClick }: ReadyToUnlockProps) => {
  const { chainId, account, connector } = useActiveWeb3React();
  const [isOn, setIsOn] = useState(false);

  const afterUnlock = async () => {
    setTimeout(async () => {
      const res = await getStatus();
      console.log("RES =>", res);
      isOn !== res && setIsOn(res);
    }, 6000);
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
        <GlowButton
          onClick={() => handleUnlock({ isOn, afterUnlock, account })}
        >
          {isOn ? "Deactivate" : "Activate"} wallet
        </GlowButton>
      </div>
    </div>
  );
};

export default ReadyToUnlock;