const contractName =
  process.env.NEXT_PUBLIC_CONTRACT_NAME || "EthTrustDenverDemo";
import { NextApiRequest, NextApiResponse } from "next";

import { contractWeb3Connection } from "../../../utils";

export default async function handlePOEStatus(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const lightEmUpContract = contractWeb3Connection(contractName);

    const state = lightEmUpContract.methods.getLightState().call();
    return res.status(200).json({ currentPoEState: state });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
    // process.exit(1);
  }
}
