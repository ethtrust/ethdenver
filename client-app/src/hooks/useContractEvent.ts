import { injected } from "../config/wallets";
import { useEffect } from "react";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { contractWeb3Connection } from "../utils";

const defaultContractName =
  process.env.NEXT_PUBLIC_CONTRACT_NAME || "EthTrustDenverDemo";

export type IHandler = (err: Error | null, a?: any) => any;

const identity = (err: Error | null, a: any) => a;

const eventOptions = {
  fromBlock: "latest",
};

export function useContractEvent(
  eventName: string,
  handler: IHandler = identity,
  contractName: string = defaultContractName
) {
  const { active, error, activate } = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does
  const contractInst = contractWeb3Connection(contractName);
  const event = contractInst.events[eventName];

  useEffect(() => {
    if (!event) return;

    event(eventOptions).addListener("data", (data: any) => handler(null, data));
    event(eventOptions).addListener("error", (err: any) => handler(err));

    return () => {
      event(eventOptions).removeListener("data", handler);
      event(eventOptions).removeListener("error", handler);
    };
  }, [event, handler]);
}
