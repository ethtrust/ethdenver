import { injected } from "../config/wallets";
import { useEffect } from "react";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { contractWeb3Connection } from "../utils";

const defaultContractName =
  process.env.NEXT_PUBLIC_CONTRACT_NAME || "EthTrustDenverDemo";

export type IHandler = (err: Error | null, a?: any) => any;

const identity = (err: Error | null, a: any) => a;

export function useContractEvent(
  eventName: string,
  handler: IHandler = identity,
  contractName: string = defaultContractName
) {
  const { active, error, activate, library } = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    if (!active) return;
    const contractInst = contractWeb3Connection(
      contractName,
      library.getSigner()
    );

    contractInst.on(eventName, handler);

    return () => {
      contractInst.off(eventName, handler);
    };
  }, [handler, active, contractName, library, eventName]);
}
