import { NetworkContextName } from "../../constant";
import { createWeb3ReactRoot } from "@web3-react/core";

const Web3ReactRoot = createWeb3ReactRoot(NetworkContextName);

function Web3ProviderNetwork({ children, getLibrary }: any) {
  return <Web3ReactRoot getLibrary={getLibrary}>{children}</Web3ReactRoot>;
}

export default Web3ProviderNetwork;
