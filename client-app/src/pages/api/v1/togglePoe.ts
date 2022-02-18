const contractName =
  process.env.NEXT_PUBLIC_CONTRACT_NAME || "EthTrustDenverDemo";
import { NextApiRequest, NextApiResponse } from "next";
import Web3 from "web3";
import { contractWeb3Connection } from "../../../utils";

export default async function handlePOEApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const lightEmUpContract = contractWeb3Connection(contractName);

    const fromAddress = req.body.fromAddress;
    const poeState = req.body.poeState.toUpperCase();
    if (poeState === "ON") {
      const resp = await lightEmUpContract.methods.toggleOn().send({
        from: fromAddress,
      });
      if (resp.isAxiosError) {
        return res.status(500).json({ status: false });
      }
      return res.status(200).json({ status: true });
    } else if (poeState === "OFF") {
      const resp = await lightEmUpContract.methods.toggleOff().send({
        from: fromAddress,
      });
      if (resp.isAxiosError) {
        return res.status(500).json({ status: false });
      }
      return res.status(200).json({ status: true });
    } else {
      return res
        .status(422)
        .json({ error: "Server Expected poeState to be either ON or OFF." });
    }
  } catch (err) {
    console.error("ERROR", err);
    return res.status(500).json({ error: err });
  }
}
