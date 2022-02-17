import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Lottie from "react-lottie";
import { useSpinner } from "../components/common/Spinner/SpinnerContext";
import { GlowButton } from "../components/common/GlowButton";
import { useActiveWeb3React } from "../hooks";
import { ConnectWalletButton } from "../components/blockchain/ConnectWalletButton";
import { NotConnected, ReadyToUnlock } from "../components/pages/home";
import { getStatus, handleUnlock } from "../functions/backend";

const Home: NextPage = ({ connectedAccount }: any) => {
  const { showSpinner, hideSpinner } = useSpinner();
  const [isOn, setIsOn] = useState(false);
  const { chainId, account, connector } = useActiveWeb3React();

  useEffect(() => {
    try {
      getStatus();
    } catch (e) {
      console.error(`Error`, e);
    }
  }, []);

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

      <GlowButton onClick={handleUnlock}>
        {isOn ? "Deactivate" : "Activate"} wallet
      </GlowButton>
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
