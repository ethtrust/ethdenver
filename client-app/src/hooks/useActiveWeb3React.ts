import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { ChainId, NetworkContextName } from "../constant";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import * as connectors from "../config/connectors";

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & {
  chainId?: ChainId;
} {
  const connectWallet = async (firstTime: boolean = false) => {
    try {
      console.log("Connecting metamask...");
      const web3Modal = new Web3Modal({ cacheProvider: true });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      if (accounts) {
        console.log("accounts", accounts);
      }
    } catch (error) {
      console.log("Error ", error);
    }
  };
  const disconnect = async () => {
    const web3Modal = new Web3Modal({ cacheProvider: true });
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
    }
  };

  // replace with address to impersonate
  const impersonate = false;
  const context = useWeb3ReactCore<Web3Provider>();
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName);
  return context.active
    ? {
        ...context,
        connectWallet,
        disconnect,
        connectors,
        account: impersonate || context.account,
      }
    : {
        ...contextNetwork,
        connectors,
        connectWallet,
        disconnect,
        account: impersonate || contextNetwork.account,
      };
}
