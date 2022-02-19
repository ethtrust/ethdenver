import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Lottie from "react-lottie";
import { useSpinner } from "../components/common/Spinner/SpinnerContext";
import { GlowButton } from "../components/common/GlowButton";
import { useActiveWeb3React, useContractEvent } from "../hooks";
import { ConnectWalletButton } from "../components/blockchain/ConnectWalletButton";
import { getStatus, handleUnlock } from "../functions/backend";
import dynamic from "next/dynamic";

const NotConnected = dynamic(
  () => import("../components/pages/home/NotConnected")
);
const ReadyToUnlock = dynamic(
  () => import("../components/pages/home/ReadyToUnlock")
);

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

  const checkAndSetOnStatus = (provider: any) => {
    try {
      getStatus({ provider }).then((contractOnStatus: any) => {
        console.log("contractOnStatus", contractOnStatus);
        setIsOn(contractOnStatus);
      });
    } catch (e) {
      console.error(`Error`, e);
    }
  };
  useEffect(() => checkAndSetOnStatus(provider), [provider]);

  // const handleUnlock = () => {
  //   setTimeout(async () => await getStatus(), 2000);
  // }

  return (
    <div className="flex justify-center">
      <Head>
        <title>EthTrust wallet controller</title>
        <meta name="description" content="EthTrust wallet controller" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-2">
        <div className="max-w-2xl sm:flex-row sm:justify-center order-2 sm:order-1">
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
