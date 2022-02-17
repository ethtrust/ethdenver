export interface HandleUnlockOptions {
  isOn: boolean;
  account?: string;
  afterUnlock?: () => void;
}
export const getStatus = async () => {
  try {
    console.log("Getting status");
    const resp = await fetch("/api/v1/status", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await resp.json();
    const state = parseInt(json.currentPoEState);
    return state === 1;
  } catch (e) {
    // TODO: the server is down
    return false;
  }
};

export const handleUnlock = async ({
  isOn,
  account,
  afterUnlock,
}: HandleUnlockOptions) => {
  const poeState = isOn ? "OFF" : "ON";
  if (!account) {
    return;
  }

  await fetch("/api/v1/togglePoe", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({ poeState, fromAddress: account.toUpperCase() }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  afterUnlock ? afterUnlock() : setTimeout(getStatus, 5000);
};
