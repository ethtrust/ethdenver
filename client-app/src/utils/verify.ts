import { Config } from "../types";

export function verifyConfig(config: Config): void {
  if (config.targetNetwork.rpcUrls.length === 0)
    throw new Error("Plase provide RPC urls.");
}
