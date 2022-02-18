import cheerio from "cheerio";
import md5 from "md5";
import { ethers } from "ethers";
import { merge } from "lodash-es";

import { abis } from "../contracts";

// Parse the GET Login Response DOM, extract the hidden salt field,
// combine with the PW string per the JS, and calc the hash.
export function calculatePWHash(loginDom: any) {
  const cheerioLogin = cheerio.load(loginDom);
  var pwSalt = cheerioLogin("#rand").attr("value");
  var pwStr = "Netgearshot1!";
  var pwHash = md5(merge(pwStr, pwSalt));
  return pwHash;
}

export async function getAllowance(
  provider: any,
  token: string,
  user: string,
  spender: string
) {
  const web3Provider = new ethers.providers.Web3Provider(provider);
  const tokenContract = new ethers.Contract(token, abis.erc20, web3Provider);
  return await tokenContract.allowance(user, spender);
}

export async function approve(
  provider: any,
  token: string,
  user: string,
  spender: string,
  amount: string,
  callback?: Function
) {
  const web3Provider = new ethers.providers.Web3Provider(provider);
  const tokenContract = new ethers.Contract(
    token,
    abis.erc20,
    web3Provider.getSigner()
  );
  await tokenContract.approve(spender, amount, { from: user });
  if (typeof callback === "function")
    tokenContract.once("Approval", () => {
      callback();
    });
}
