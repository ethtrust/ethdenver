import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Lottie from "react-lottie";
import { useSpinner } from "../components/common/Spinner/SpinnerContext";
import { getMarketContract, getTokenContract } from "./api/blockchainService";
import { GlowButton } from "../components/common/GlowButton";
import { useActiveWeb3React } from "../hooks";

const Home: NextPage = ({ connectedAccount }: any) => {
  const { showSpinner, hideSpinner } = useSpinner();
  const { chainId, account, connector } = useActiveWeb3React();

  useEffect(() => {}, []);

  const handleUnlock = () => {};

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen sm:flex-row sm:justify-evenly">
      <Head>
        <title>EthTrust wallet controller</title>
        <meta name="description" content="EthTrust wallet controller" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <div className="order-2 sm:order-1">
          <h1 className="max-w-xl text-4xl font-semibold leading-tight text-white md:text-5xl">
            You're in good hands
          </h1>

          <h4 className="mt-8 text-lg font-medium leading-relaxed text-gray-200 ">
            Explore EthTrust
          </h4>
          <GlowButton onClick={handleUnlock}>Explore Now</GlowButton>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  );
};

export default Home;
