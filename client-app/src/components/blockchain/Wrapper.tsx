import { useEffect, useState, createContext, FC } from "react";
import { ethers, Wallet } from "ethers";
import { Bridge } from "arb-ts";
import Web3Modal from "web3modal";
import { Web3ReactProvider } from "@web3-react/core";
import dynamic from "next/dynamic";

import Web3ReactManager from "./Web3ReactManager";
import getLibrary from "../../functions/getLibrary";

export type AppContextProps = {
  connectedAccount: string | undefined;
  connectWallet: Function;
  disconnect: Function;
  getProvider: Function;
};

export const BlockchainContext = createContext<AppContextProps>(
  {} as AppContextProps
);

type Props = {
  children: React.ReactNode;
};

const Web3ProviderNetwork = dynamic(() => import("./Web3ProviderNetwork"), {
  ssr: false,
});

if (typeof window !== "undefined" && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

export const BlockchainWrapper = ({ children }: Props) => {
  const [connectedAccount, setConnectedAccount] = useState<
    string | undefined
  >();

  // const connectWallet = async (firstTime: boolean = false) => {
  //   try {
  //     console.log("Connecting metamask...");
  //     const web3Modal = new Web3Modal({ cacheProvider: true });
  //     const connection = await web3Modal.connect();
  //     const provider = new ethers.providers.Web3Provider(connection);
  //     const accounts = await provider.listAccounts();
  //     if (accounts) {
  //       setConnectedAccount(accounts[0]);

  //       if (firstTime) {
  //         localStorage.setItem("connected", accounts[0]);
  //       }
  //     }
  //   } catch (error) {
  //     console.log("Error ", error);
  //   }
  // };

  // const getProvider = async () => {
  //   if (connectedAccount == undefined) {
  //     return;
  //   }

  //   const providerOptions = {};
  //   const web3Modal = new Web3Modal({
  //     network: "arbitrum",
  //     providerOptions,
  //   });
  //   const connection = await web3Modal.connect();

  //   // const arbProvider = new ethers.providers.Web3Provider(window.ethereum);
  //   // return arbProvider;

  //   return new ethers.providers.Web3Provider(connection);
  // };

  // const disconnect = async () => {
  //   const web3Modal = new Web3Modal({ cacheProvider: true });
  //   if (web3Modal.cachedProvider) {
  //     web3Modal.clearCachedProvider();
  //     setConnectedAccount(undefined);
  //     localStorage.removeItem("connected");
  //   }
  // };

  // const checkIsWalletConnected = async () => {
  //   const connected = localStorage.getItem("connected");

  //   if (connected != null) {
  //     console.log("connected ", connected);
  //     connectWallet();
  //   }
  // };

  // useEffect(() => {
  //   checkIsWalletConnected();
  // }, []);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Web3ReactManager>{children}</Web3ReactManager>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};
