const contractName = process.env.CONTRACT_NAME || "EthTrustDenverDemo";
import { NextApiRequest, NextApiResponse } from "next";
import Web3 from "web3";

import { contractJson } from "../../../utils";
const web3ProviderURL = process.env.WEB3_PROVIDER_URL;
const web3ProviderPort = process.env.WEB3_PROVIDER_PORT;
const contractDetails = contractJson["31337"][0]["contracts"][contractName];
const contractAddress = contractDetails.address;
const contractABI = contractDetails.abi;

const web3Addr = "ws://" + web3ProviderURL + ":" + web3ProviderPort;

export default async function handlePOEApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const web3 = new Web3(web3Addr);
    const lightEmUpContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );

    const fromAddress = req.body.fromAddress;
    const poeState = req.body.poeState.toUpperCase();
    if (poeState === "ON") {
      const resp = await lightEmUpContract.methods
        .toggleOn()
        .send({
          from: fromAddress,
        })
        .wait();
      if (res.isAxiosError) {
        return res.status(500).json({ status: false });
      }
      return res.status(200).json({ status: true });
    } else if (poeState === "OFF") {
      const resp = await lightEmUpContract.methods
        .toggleOff()
        .send({
          from: fromAddress,
        })
        .wait();
      if (res.isAxiosError) {
        return res.status(500).json({ status: false });
      }
      return res.status(200).json({ status: true });
    } else {
      return res
        .status(422)
        .json({ error: "Server Expected poeState to be either ON or OFF." });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}
