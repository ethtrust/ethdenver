export interface HandleUnlockOptions {
  isOn: boolean;
  account?: string;
}
export const getStatus = async () => {
  try {
    const resp = await fetch("http://localhost:4569/status", {
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

export const handleUnlock = async ({ isOn, account }: HandleUnlockOptions) => {
  const poeState = isOn ? "OFF" : "ON";
  if (!account) {
    return;
  }
  await fetch("http://localhost:4568/togglePoe", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({ poeState, fromAddress: account.toUpperCase() }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
