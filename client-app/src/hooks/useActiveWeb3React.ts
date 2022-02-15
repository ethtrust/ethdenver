import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { ChainId, NetworkContextName } from "../constant";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { injected } from "../config/wallets";

console.log("RPC_URLS", injected);

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & {
  chainId?: ChainId;
} {
  const context = useWeb3ReactCore<Web3Provider>();
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName);

  const connectWallet = async (firstTime: boolean = false) => {
    try {
      const web3Modal = new Web3Modal({});
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      await context.activate(injected);
    } catch (error) {
      console.log("Error ", error);
    }
  };
  const disconnect = async () => {
    const web3Modal = new Web3Modal({});
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
    }
    await context.deactivate();
  };

  // replace with address to impersonate
  const impersonate = false;

  return context.active
    ? {
        ...context,
        connectWallet,
        disconnect,
        account: impersonate || context.account,
      }
    : {
        ...contextNetwork,
        connectWallet,
        disconnect,
        account: impersonate || contextNetwork.account,
      };
}
