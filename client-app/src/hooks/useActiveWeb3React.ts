import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { ChainId, NetworkContextName } from "../constant";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { injected } from "../config/wallets";

interface CustomProps {
  chainId?: ChainId;
  connectWallet: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> &
  CustomProps {
  const context = useWeb3ReactCore<Web3Provider & CustomProps>();
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName);

  // TODO: REMOVE THIS HARDCODING
  const networkId = `0x${parseInt("421611", 10).toString(16).toUpperCase()}`;

  const switchNetwork = async (provider: any) => {
    try {
      await provider.send("wallet_switchEthereumChain", [
        {
          chainId: networkId,
        },
      ]);
      return true;
    } catch (switchError: any) {
      // The network has not been added to MetaMask
      if (switchError.code === 4902) {
        // console.log("Please add the Polygon network to MetaMask");
        const result = await addNetwork(provider);
        if (result) {
          // This feels dangers
          await switchNetwork(provider);
        }
      }
      console.log("Cannot switch to the network");
      return false;
    }
  };

  const addNetwork = async (provider: any) => {
    try {
      return await provider.send("wallet_addEthereumChain", [
        {
          chainId: networkId,
          chainName: "Arbitum",
          rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
          blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/"],
          nativeCurrency: {
            symbol: "ETH",
            decimals: 18,
          },
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async (firstTime: boolean = false) => {
    try {
      const web3Modal = new Web3Modal({});
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      // const chainId = provider.network.chainId;
      await context.activate(injected);
      if (context.error && context.error.name === "UnsupportedChainIdError") {
        const resp = await switchNetwork(provider);
        console.log("BLAH", context);
      }
    } catch (error) {
      console.log(error);
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
