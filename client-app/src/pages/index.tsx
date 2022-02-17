import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Lottie from "react-lottie";
import { useSpinner } from "../components/common/Spinner/SpinnerContext";
import { GlowButton } from "../components/common/GlowButton";
import { useActiveWeb3React } from "../hooks";

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
      await getStatus();
    }
  };

  const ReadyToTurnOn = (
    <div>
      <h1 className="max-w-xl text-4xl font-semibold leading-tight text-white md:text-5xl">
        You are in good hands
      </h1>

      <h4 className="mt-8 text-lg font-medium leading-relaxed text-gray-200 ">
        Explore EthTrust
      </h4>
      <GlowButton onClick={handleUnlock}>Open wallet</GlowButton>
    </div>
  );

  const ConnectWallet = (
    <div>
      <h1 className="max-w-xl text-4xl font-semibold leading-tight text-white md:text-5xl">
        Connect wallet to continue
      </h1>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen sm:flex-row sm:justify-evenly">
      <Head>
        <title>EthTrust wallet controller</title>
        <meta name="description" content="EthTrust wallet controller" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
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
