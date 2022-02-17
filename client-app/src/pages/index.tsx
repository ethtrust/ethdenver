import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Lottie from "react-lottie";
import { useSpinner } from "../components/common/Spinner/SpinnerContext";
import { GlowButton } from "../components/common/GlowButton";
import { useActiveWeb3React } from "../hooks";
import { ConnectWalletButton } from "../components/blockchain/ConnectWalletButton";

const Home: NextPage = ({ connectedAccount }: any) => {
  const { showSpinner, hideSpinner } = useSpinner();
  const [isOn, setIsOn] = useState(false);
  const { chainId, account, connector } = useActiveWeb3React();

  const getStatus = async () => {
    const resp = await fetch("http://localhost:4569/status", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await resp.json();
    const state = parseInt(json.currentPoEState);
    setIsOn(state === 1);
  };
  useEffect(() => {
    getStatus();
  }, []);

  const handleUnlock = async () => {
    const poeState = isOn ? "OFF" : "ON";

    const resp = await fetch("http://localhost:4568/togglePoe", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ poeState, fromAddress: account.toUpperCase() }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const json = await resp.json();

    if (resp.status == 200) {
      setTimeout(async () => await getStatus(), 2000);
    }
  };

  const ReadyToTurnOn = (
    <div>
      <h1 className="max-w-xl text-4xl font-semibold leading-loose text-white md:text-4xl">
        {isOn
          ? "Your wallet is currently hot and ready to do your bidding"
          : "Your wallet is offline and secure"}
      </h1>

      <GlowButton onClick={handleUnlock}>
        {isOn ? "Deactivate" : "Activate"} wallet
      </GlowButton>
    </div>
  );

  const ConnectWallet = (
    <div>
      <h1 className="max-w-2xl text-3xl font-normal leading-tight text-white md:text-5xl">
        EthTrust provides you with safety and security for your financial
        assets.
      </h1>
      <h2 className="text-2xl mt-8">Get started by connecting your wallet.</h2>
      <ConnectWalletButton />
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen sm:flex-row sm:justify-evenly">
      <Head>
        <title>EthTrust wallet controller</title>
        <meta name="description" content="EthTrust wallet controller" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-8">
        <div className="order-2 sm:order-1">
          {/* {isOn ? "ON" : "OFF"} */}
          {account ? ReadyToTurnOn : ConnectWallet}
        </div>
      </main>

      <footer className=""></footer>
    </div>
  );
};

export default Home;
