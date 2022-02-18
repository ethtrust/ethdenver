import Web3 from "web3";
import contractJsonReq from "../config/contracts.json";

export const contractJson = contractJsonReq;

const web3ProviderURL = process.env.NEXT_PUBLIC_WEB3_PROVIDER_URL;
const web3ProviderPort = process.env.NEXT_PUBLIC_WEB3_PROVIDER_PORT;

export const contractWeb3Connection = (
  contractName: string,
  chainId: string = "31337"
) => {
  const contractDetails = (contractJson as any)[chainId][0]["contracts"][
    contractName
  ];
  const contractAddress = contractDetails.address;
  const contractABI = contractDetails.abi;

  const web3Addr = "ws://" + web3ProviderURL + ":" + web3ProviderPort;
  const web3 = new Web3(web3Addr);
  const contractInst = new web3.eth.Contract(contractABI, contractAddress);
  return contractInst;
};
