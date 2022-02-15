import { ChainId } from "../constant";
import { isEnvironment } from "../functions/environment";

const Arbitrum =
  "https://raw.githubusercontent.com/sushiswap/icons/master/network/arbitrum.jpg";
const Mainnet = "/images/networks/mainnet-network.jpg";
const Rinkeby = "/images/networks/rinkeby-network.jpg";
const Ropsten = "/images/networks/ropsten-network.jpg";

export const DEFAULT_METAMASK_CHAIN_ID = [
  ChainId.MAINNET,
  ChainId.RINKEBY,
  ChainId.HARDHAT,
];

export const NETWORK_ICON = {
  [ChainId.MAINNET]: Mainnet,
  [ChainId.ROPSTEN]: Ropsten,
  [ChainId.RINKEBY]: Rinkeby,
  [ChainId.ARBITRUM]: Arbitrum,
  [ChainId.ARBITRUM_TESTNET]: Arbitrum,
};

export const AVAILABLE_NETWORKS: number[] = [
  ChainId.MAINNET,
  ChainId.ROPSTEN,
  // ChainId.MATIC,
  // ChainId.FANTOM,
  ChainId.ARBITRUM,
];

export const SUPPORTED_NETWORKS: {
  [chainId: number]: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
} = {
  [ChainId.MAINNET]: {
    chainId: "0x1",
    chainName: "Ethereum",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3"],
    blockExplorerUrls: ["https://etherscan.com"],
  },
  [ChainId.RINKEBY]: {
    chainId: "0x4",
    chainName: "Rinkeby",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.infura.io/v3"],
    blockExplorerUrls: ["https://rinkeby.etherscan.com"],
  },
  [ChainId.ROPSTEN]: {
    chainId: "0x3",
    chainName: "Ropsten",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://ropsten.infura.io/v3"],
    blockExplorerUrls: ["https://ropsten.etherscan.com"],
  },
  [ChainId.ARBITRUM]: {
    chainId: "0xA4B1",
    chainName: "Arbitrum",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://mainnet-arb-explorer.netlify.app"],
  },
};
