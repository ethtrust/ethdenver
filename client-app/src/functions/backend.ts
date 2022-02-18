import { contractWeb3Connection } from "../utils";

const contractName =
  process.env.NEXT_PUBLIC_CONTRACT_NAME || "EthTrustDenverDemo";

export interface HandleUnlockOptions {
  isOn: boolean;
  account?: string | null;
  afterUnlock?: () => void;
}
export const getStatus = async ({ provider }) => {
  try {
    const contract = contractWeb3Connection(contractName, provider.getSigner());
    return contract.isOn();
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
  const poeState = isOn ? "OFF" : "ON";
  if (!account) {
    return;
  }

  // Try signing the transacttion
  // const signedTxn = await

  try {
    const contract = contractWeb3Connection(contractName, provider.getSigner());

    let resp;
    if (isOn) {
      resp = await contract.toggleOn();
    } else {
      resp = await contract.toggleOff();
    }
    console.log("resp", resp);
  } catch (e) {
    console.log(`Error on POST`, e);
  } finally {
    // afterUnlock ? afterUnlock() : setTimeout(getStatus, 5000);
  }
};
