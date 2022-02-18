import { useState } from "react";
import { GlowButton } from "../../common/GlowButton";
import { useActiveWeb3React } from "../../../hooks";
import { handleUnlock, getStatus } from "../../../functions/backend";
import { useSpinner } from "../../common/Spinner/SpinnerContext";

export interface ReadyToUnlockProps {
  isOn?: boolean;
  handleClick: (b: any) => void;
}

export const ReadyToUnlock = ({ handleClick, isOn }: ReadyToUnlockProps) => {
  const { showSpinner, hideSpinner } = useSpinner();
  const ctx = useActiveWeb3React();

  const { chainId, account, connector, library: provider } = ctx;

  // const afterUnlock = async () => {
  //   setTimeout(async () => {
  //     const res = await getStatus({ provider });
  //     console.log("RES =>", res);
  //     isOn !== res && setIsOn(res);
  //   }, 6000);
  // };

  const onActivateClick = async () => {
    showSpinner(true);
    try {
      await handleUnlock({ isOn, account, provider });
    } catch (e) {
      console.log("Error in handleUnlock");

      hideSpinner();
    }
  };

  return (
    <div className="bg-indigo-800 rounded-xl flex flex-col justify-center items-center">
      <div className="flex-1 py-2 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mt-1 text-4xl font-normal text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            {isOn
              ? "Your wallet is currently hot and ready to do your bidding"
              : "Your wallet is offline and secure"}
          </p>
        </div>
      </div>
      <div className="justify-center items-center mb-auto mx-auto">
        <GlowButton onClick={onActivateClick}>
          {isOn ? "Deactivate" : "Activate"} wallet
        </GlowButton>
      </div>
    </div>
  );
};

export default ReadyToUnlock;
