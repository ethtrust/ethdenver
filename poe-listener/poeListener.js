require("dotenv").config();
const axios = require("axios");
const Web3 = require("web3");
const path = require("path");
const fs = require("fs");

const listenerConfig = require("./config/poeListenerConfig.json");
const compileOutputJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config", `output.json`), "utf-8")
);

const web3ProviderURL = process.env.WEB3_PROVIDER_URL || listenerConfig.web3ProviderURL;
const web3 = new Web3(web3ProviderURL);

const poeAPIURL = process.env.POE_API_URL || listenerConfig.poeAPIURL;
const poeAPIPort = process.env.POE_API_PORT || listenerConfig.poeAPIPort;
const chainIdCfg = process.env.CHAIN_ID || listenerConfig.chainId;

const contractName = process.env.CONTRACT_NAME;
const contractDetails = compileOutputJson[chainIdCfg][0]["contracts"][contractName];
const contractAddress = contractDetails.address;
const contractABI = contractDetails.abi;

const lightEmUpContract = new web3.eth.Contract(contractABI, contractAddress);

console.log("Connecting to " + web3ProviderURL);
web3.eth.net
  .getId()
  .then((chainId) => {
    if (chainId === parseInt(chainIdCfg)) {
      console.log("Web3 is Up on Aribtrum Testnet (Rinkeby)");
      listenForEvents();
    } else {
      console.error("Web3 is not up. Shutting down.");
      process.exit(1);
    }
  })
  .catch((web3Err) => {
    console.log("Web3 failed to connect. Shutting down.\n" + web3Err);
    process.exit(1);
  });

function signTx(contractMethodName) {
  console.log(web3.utils.sha3(contractMethodName).slice(0,10));
  return web3.eth.accounts.signTransaction({
    to: contractAddress,
    gas: 2000000,
    data: web3.utils.sha3(contractMethodName).slice(0,10)
  }, process.env.PRIVATE_KEY)
}

async function sendTx(contractMethodName) {
  const txOutput = await signTx(contractMethodName);
  console.log(txOutput);
  return await web3.eth.sendSignedTransaction(txOutput.rawTransaction);
}

function handleOnEvent() {
  turnOn()
  .then((toggleResponse) => handleToggleOn(toggleResponse))
  .catch((error) => console.log("An Error Occurred: \n" + error));
}

function handleOffEvent() {
  turnOff()
  .then((toggleResponse) => handleToggleOff(toggleResponse))
  .catch((error) => console.log("An Error Occurred: \n" + error));
}

function turnOn() {
  return axios.get("http://" + poeAPIURL + ":" + poeAPIPort + "/on")
}

function turnOff() {
  return axios.get("http://" + poeAPIURL + ":" + poeAPIPort + "/off")
}

async function handleToggleOn(toggleResponse) {
  console.log(toggleResponse.status);
  if(toggleResponse && toggleResponse.status === 200 && toggleResponse.data) {
    console.log(toggleResponse.data);
    const sendTxResp = await sendTx("confirmOn()");
    return;
  } else if (toggleResponse.status === 205) {
    console.log("Connection reset, or redirected to login. Retrying Request.");
    return handleOnEvent();
  } else {
    console.log("An unexpected error occured.\n", toggleResponse);
  }
}

async function handleToggleOff(toggleResponse) {
  console.log(toggleResponse.status);
  if(toggleResponse && toggleResponse.status === 200 && toggleResponse.data) {
    console.log(toggleResponse.data);
    const sendTxResp = await sendTx("confirmOff()");
    return;
  } else if (toggleResponse.status === 205) {
    console.log("Connection reset, or redirected to login. Retrying Request.");
    return handleOffEvent();
  } else {
    console.log("An unexpected error occured.\n", toggleResponse);
  }
}

async function listenForEvents() {
  // Handle the Toggle On Event
  //   Catch the event and invoke a REST call to toggle the POE on.
  lightEmUpContract.events
    .OnIntent()
    .on("data", (event) => {
      console.log("On Intent Caught");
      handleOnEvent();
    })
    .on("error", console.error);

  // Handle the Toggle Off Event
  //   Catch the event and invoke a REST call to toggle the POE off.
  lightEmUpContract.events
  .OffIntent()
  .on("data", (event) => {
    console.log("Off Intent Caught");
    handleOffEvent();
  })
  .on("error", console.error);
}
