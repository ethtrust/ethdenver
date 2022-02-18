import { contractWeb3Connection } from "../utils";
import { ethers } from "ethers";

const contractName =
  process.env.NEXT_PUBLIC_CONTRACT_NAME || "EthTrustDenverDemo";

export interface HandleUnlockOptions {
  isOn: boolean | undefined;
  account?: string | null;
  afterUnlock?: () => void;
  provider?: any | undefined; // TODO: define this as an ethers.Provider
}
export const getStatus = async ({ provider }: { provider: any }) => {
  try {
    const contract = contractWeb3Connection(contractName, provider.getSigner());
    return await contract.isOn();
  } catch (e) {
    // TODO: the server is down
    return false;
  }
};

export const handleUnlock = async ({
  isOn,
  account,
  provider,
}: // afterUnlock,
HandleUnlockOptions) => {
  if (!account) {
    return;
  }

  // Try signing the transacttion
  // const signedTxn = await

  try {
    const contract = contractWeb3Connection(contractName, provider.getSigner());

    let resp;
    if (isOn) {
      resp = await contract.toggleOff();
    } else {
      resp = await contract.toggleOn();
    }
  } catch (e) {
    // Rejected transaction
    throw new Error(`User rejected transaction`);
  } finally {
    // afterUnlock ? afterUnlock() : setTimeout(getStatus, 5000);
  }
};
