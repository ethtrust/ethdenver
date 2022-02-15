import { ethers } from "ethers";
// import { marketAddress, nftAddress } from "../../config";

export const rpcProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_CHAIN_URL
);
