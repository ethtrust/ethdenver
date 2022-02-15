import { InjectedConnector } from "@web3-react/injected-connector";
import { AVAILABLE_NETWORKS, SUPPORTED_NETWORKS } from "./networks";

const supportedChainIds = Object.values(AVAILABLE_NETWORKS) as number[];

export const injected = new InjectedConnector({
  supportedChainIds,
});
