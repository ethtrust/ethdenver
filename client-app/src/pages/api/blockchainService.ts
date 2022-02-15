import { ethers } from "ethers";
import { marketAddress, nftAddress } from "../../config";

export const rpcProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_CHAIN_URL
);

export function getMarketContract(signer?: any) {
  let provider = rpcProvider;
  if (signer) {
    provider = signer;
  }
  return new ethers.Contract(marketAddress, Market.abi, provider);
}

export function getTokenContract(signer?: any) {
  let provider = rpcProvider;
  if (signer) {
    provider = signer;
  }
  return new ethers.Contract(nftAddress, NFT.abi, provider);
}
