import Web3 from "web3";
import { ethers } from "ethers";
import contractJsonReq from "../config/contracts.json";

export const contractJson = contractJsonReq;

const web3ProviderURL = process.env.NEXT_PUBLIC_WEB3_PROVIDER_URL;
const web3ProviderPort = process.env.NEXT_PUBLIC_WEB3_PROVIDER_PORT;

export const contractWeb3Connection = (
  contractName: string,
  signer: ethers.Signer = null,
  chainId: string = "421611"
) => {
  const contractDetails = (contractJson as any)[chainId][0]["contracts"][
    contractName
  ];
  const contractAddress = contractDetails.address;
  const contractABI = contractDetails.abi;

  const web3Addr = web3ProviderURL;
  const web3 = new Web3(web3Addr);
  const contractInst = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return contractInst;
};
