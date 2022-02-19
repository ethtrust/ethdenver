import { useEffect, useState, useCallback, createContext, FC } from "react";
import { ethers, Wallet } from "ethers";
import Web3Modal from "web3modal";
import { Web3ReactProvider } from "@web3-react/core";
import dynamic from "next/dynamic";

import Modal from "../Modal";
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
  children: any;
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

  const connectWallet = async (firstTime: boolean = false) => {
    try {
      console.log("Connecting metamask...");
      const web3Modal = new Web3Modal({ cacheProvider: true });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      if (accounts) {
        setConnectedAccount(accounts[0]);

        if (firstTime) {
          localStorage.setItem("connected", accounts[0]);
        }
      }
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const getProvider = async () => {
    if (connectedAccount == undefined) {
      return;
    }

    const providerOptions = {};
    const web3Modal = new Web3Modal({
      network: "arbitrum",
      providerOptions,
    });
    const connection = await web3Modal.connect();

    // const arbProvider = new ethers.providers.Web3Provider(window.ethereum);
    // return arbProvider;

    return new ethers.providers.Web3Provider(connection);
  };

  const disconnect = async () => {
    const web3Modal = new Web3Modal({ cacheProvider: true });
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
      setConnectedAccount(undefined);
      localStorage.removeItem("connected");
    }
  };

  const checkIsWalletConnected = useCallback(async () => {
    const connected = localStorage.getItem("connected");

    if (connected != null) {
      console.log("connected ", connected);
      connectWallet();
    }
  }, []);

  useEffect(() => {
    checkIsWalletConnected();
  }, [checkIsWalletConnected]);

  // if (typeof window !== "undefined" && !window.ethereum) {
  //   return (
  //     <div className="flex justify-center items-center mx-auto">
  //       <Modal
  //         title={`If you're seeing this message, there is an error It might be one of two different things.`}
  //       >
  //         <h1 className="text-md mt-8">
  //           You must have MetaMask installed to use our app. If you do have{" "}
  //           <a href="https://metamask.io">MetaMask</a> installed, try opening
  //           the app in your MetaMask browser.
  //         </h1>
  //       </Modal>
  //     </div>
  //   );
  // }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <>{children}</>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};
