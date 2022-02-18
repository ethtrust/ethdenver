import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Lottie from "react-lottie";
import { useSpinner } from "../components/common/Spinner/SpinnerContext";
import { GlowButton } from "../components/common/GlowButton";
import { useActiveWeb3React, useContractEvent } from "../hooks";
import { ConnectWalletButton } from "../components/blockchain/ConnectWalletButton";
import { NotConnected, ReadyToUnlock } from "../components/pages/home";
import { getStatus, handleUnlock } from "../functions/backend";

const Home: NextPage = ({ connectedAccount }: any) => {
  const { showSpinner, hideSpinner } = useSpinner();
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    chainId,
    account,
    connector,
    library: provider,
  } = useActiveWeb3React();

  const handleOffIntent = (data: any) => {
    // if (data && data.from === account) {
    // showSpinner();
    setLoading(true);
    // }
  };
  const handleConfirmOff = (data: any) => {
    hideSpinner();
    setLoading(false);
    setIsOn(false);
    console.log("Confirm off", isOn);
  };

  const handleOnIntent = (data: any) => {
    // if (data && data.from === account) {
    // showSpinner();
    setLoading(true);
    // }
  };
  const handleConfirmOn = (data: any) => {
    hideSpinner();
    setLoading(false);
    setIsOn(true);
  };

  useContractEvent("OffIntent", handleOffIntent);
  useContractEvent("ConfirmOff", handleConfirmOff);
  useContractEvent("OnIntent", handleOnIntent);
  useContractEvent("ConfirmOn", handleConfirmOn);

  useEffect(() => {
    try {
      getStatus({ provider });
    } catch (e) {
      console.error(`Error`, e);
    }
  }, [provider]);

  // const handleUnlock = () => {
  //   setTimeout(async () => await getStatus(), 2000);
  // }

  const ReadyToTurnOn = (
    <div>
      <h1 className="max-w-3xl text-4xl font-semibold leading-loose text-white md:text-4xl">
        {isOn
          ? "Your wallet is currently hot and ready to do your bidding"
          : "Your wallet is offline and secure"}
      </h1>

      {loading ? (
        <div>Loading</div>
      ) : (
        <GlowButton onClick={handleUnlock}>
          {isOn ? "Deactivate" : "Activate"} wallet
        </GlowButton>
      )}
    </div>
  );

  return (
    <div className="flex flex-col justify-center w-full h-screen sm:flex-row sm:justify-evenly">
      <Head>
        <title>EthTrust wallet controller</title>
        <meta name="description" content="EthTrust wallet controller" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-8">
        <div className="order-2 sm:order-1">
          {/* {isOn ? "ON" : "OFF"} */}
          {account ? (
            <ReadyToUnlock handleClick={handleUnlock} isOn={isOn} />
          ) : (
            <NotConnected />
          )}
        </div>
      </main>

      <footer className=""></footer>
    </div>
  );
};

export default Home;
