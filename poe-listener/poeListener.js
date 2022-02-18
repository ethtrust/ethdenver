require("dotenv").config();
const axios = require("axios");
const Web3 = require("web3");
const path = require("path");
const fs = require("fs");

const listenerConfig = require("./config/poeListenerConfig.json");
const compileOutputJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config", `output.json`), "utf-8")
);

const poeAPIURL = process.env.POE_API_URL || listenerConfig.poeAPIURL;
const poeAPIPort = process.env.POE_API_PORT || listenerConfig.poeAPIPort;
const web3ProviderURL = process.env.WEB3_PROVIDER_URL || listenerConfig.web3ProviderURL;
const chainIdCfg = process.env.CHAIN_ID || listenerConfig.chainId;

const contractName = process.env.CONTRACT_NAME;
const contractDetails = compileOutputJson[chainIdCfg][0]["contracts"][contractName];
const contractAddress = contractDetails.address;
const contractABI = contractDetails.abi;

console.log("Connecting to " + web3ProviderURL);
const web3 = new Web3(web3ProviderURL);
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

async function listenForEvents() {
  // Grab the Web3 Instance of the Contract
  const lightEmUpContract = new web3.eth.Contract(contractABI, contractAddress);

  // Handle the Toggle On Event
  //   Catch the event and invoke a REST call to toggle the POE on.
  lightEmUpContract.events
    .OnIntent()
    .on("data", (event) => {
      console.log("On Intent Caught");
      axios
        .get("http://" + poeAPIURL + ":" + poeAPIPort + "/on")
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .on("error", console.error);

  // Handle the Toggle Off Event
  //   Catch the event and invoke a REST call to toggle the POE off.
  lightEmUpContract.events
    .OffIntent()
    .on("data", (event) => {
      console.log("Off Intent Caught");
      axios
        .get("http://" + poeAPIURL + ":" + poeAPIPort + "/off")
        .then((response) => {
          console.log(response);
          // console.log("RESPONDED SUCCESSFULLY");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .on("error", console.error);
}
