import { ethers } from "ethers";

import { abis, addresses } from "../contracts";

export async function depositArbitrumTestnet(
  externalProvider: ethers.providers.ExternalProvider,
  amount: string,
  sender: string,
  callback?: Function
) {
  const provider = new ethers.providers.Web3Provider(externalProvider);
  const contract = new ethers.Contract(
    addresses.arbitrumKovan5Inbox,
    abis.arbitrumInbox,
    provider.getSigner()
  );
  const { hash } = await contract.depositEth(sender, {
    value: amount,
    from: sender,
  });

  if (typeof callback === "function") provider.once(hash, () => callback());
}

export async function depositETHOptimismTestnet(
  externalProvider: ethers.providers.ExternalProvider,
  amount: string,
  sender: string,
  callback?: Function
) {
  const provider = new ethers.providers.Web3Provider(externalProvider);
  const contract = new ethers.Contract(
    addresses.optimismETHGatewayKovan2,
    abis.optimismGateway,
    provider.getSigner()
  );
  const { hash } = await contract.deposit({
    from: sender,
    value: amount,
  });

  if (typeof callback === "function") provider.once(hash, () => callback());
}

export async function depositETHOptimism(
  externalProvider: ethers.providers.ExternalProvider,
  amount: string,
  sender: string,
  callback?: Function
) {
  const provider = new ethers.providers.Web3Provider(externalProvider);
  const contract = new ethers.Contract(
    addresses.optimismETHGatewayMainnet,
    abis.optimismGateway,
    provider.getSigner()
  );
  const { hash } = await contract.deposit({
    from: sender,
    value: amount,
  });

  if (typeof callback === "function") provider.once(hash, () => callback());
}

// todo: merge depositETHMatic & depositETHMaticTestnet
export async function depositETHMatic(
  externalProvider: ethers.providers.ExternalProvider,
  amount: string,
  sender: string,
  callback?: Function
) {
  const provider = new ethers.providers.Web3Provider(externalProvider);
  const contract = new ethers.Contract(
    addresses.maticDepositProxy,
    abis.maticBridge,
    provider.getSigner()
  );
  const { hash } = await contract.depositEtherFor(sender, {
    from: sender,
    value: amount,
  });

  if (typeof callback === "function") provider.once(hash, () => callback());
}

export async function depositETHMaticTestnet(
  externalProvider: ethers.providers.ExternalProvider,
  amount: string,
  sender: string,
  callback?: Function
) {
  const provider = new ethers.providers.Web3Provider(externalProvider);
  const contract = new ethers.Contract(
    addresses.maticDepositProxy,
    abis.maticBridge,
    provider.getSigner()
  );
  const { hash } = await contract.depositEtherFor(sender, {
    from: sender,
    value: amount,
  });

  if (typeof callback === "function") provider.once(hash, () => callback());
}

export async function depositTokenMatic(
  externalProvider: ethers.providers.ExternalProvider,
  token: string,
  amount: string,
  sender: string,
  callback?: Function
) {
  const provider = new ethers.providers.Web3Provider(externalProvider);
  const contract = new ethers.Contract(
    addresses.maticDepositProxy,
    abis.maticBridge,
    provider.getSigner()
  );
  const { hash } = await contract.depositERC20ForUser(token, sender, amount, {
    from: sender,
  });

  if (typeof callback === "function") provider.once(hash, () => callback());
}

export async function depositTokenMaticTestnet(
  externalProvider: ethers.providers.ExternalProvider,
  token: string,
  amount: string,
  sender: string,
  callback?: Function
) {
  const provider = new ethers.providers.Web3Provider(externalProvider);
  const contract = new ethers.Contract(
    addresses.maticDepositProxyGoerli,
    abis.maticBridge,
    provider.getSigner()
  );
  const { hash } = await contract.depositERC20ForUser(token, sender, amount, {
    from: sender,
  });

  if (typeof callback === "function") provider.once(hash, () => callback());
}

/**
 * deposit Dai to xDai
 * @param externalProvider
 * @param token
 * @param amount
 * @param sender
 * @param callback
 */
export async function depositDai(
  externalProvider: ethers.providers.ExternalProvider,
  token: string,
  amount: string,
  sender: string,
  callback?: Function
) {
  // todo: add other token deposit
  if (token !== addresses.dai) throw new Error("Can only deposit Dai");
  const provider = new ethers.providers.Web3Provider(externalProvider);
  const contract = new ethers.Contract(token, abis.erc20, provider.getSigner());

  // deposit by trasnfering dai to foreignBridge
  const { hash } = await contract.transfer(
    addresses.xdaiForeignBridge,
    amount,
    {
      from: sender,
    }
  );

  if (typeof callback === "function") provider.once(hash, () => callback());
}
