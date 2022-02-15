import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const POLLING_INTERVAL = 12000;
const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.NEXT_PUBLIC_RPC_URL_1 as string,
  4: process.env.NEXT_PUBLIC_RPC_URL_4 as string,
  421611: process.env.NEXT_PUBLIC_ARB_RPC_URL as string,
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 421611],
});

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 4: RPC_URLS[4], 421611: RPC_URLS[421611] },
  defaultChainId: 421661,
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
