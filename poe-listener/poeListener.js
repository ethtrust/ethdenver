require("dotenv").config();
const axios = require("axios");
const Web3 = require("web3");
const path = require("path");
const fs = require("fs");

const json = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "demo-contract", "deployments", `output.json`),
    "utf-8"
  )
);
const contractName = process.env.CONTRACT_NAME;
const contract = json.abi;
const listenerConfig = require("./config/poeListenerConfig.json");
// const {
//   poeAPIURL,
//   poeAPIPort,
//   web3ProviderURL,
//   web3ProviderPort,
//   contractAddress,
//   contractABI,
// } = listenerConfig;

const poeAPIURL = process.env.POE_API_URL || listenerConfig.poeAPIURL;
const poeAPIPort = process.env.POE_API_PORT || listenerConfig.poeAPIPort;
const web3ProviderURL =
  process.env.WEB3_PROVIDER_URL || listenerConfig.web3ProviderURL;
const web3ProviderPort =
  process.env.WEB3_PROVIDER_PORT || listenerConfig.web3ProviderPort;

const contractDetails = json["31337"][0]["contracts"][contractName];
const contractAddress = contractDetails.address;
const contractABI = contractDetails.abi;
// const contractAddress =
//   process.env.CONTRACT_ADDRESS ||
//   process.env.TEST_CONTRACT_ADDRESS ||
//   listenerConfig.contractAddress;
// const contractABI =
// process.env.CONTRACT_ABI || contract["abi"] || listenerConfig.contractABI;

console.log(contractABI);
const port = process.env.PORT || 3000;

const web3Address = "ws://" + web3ProviderURL + ":" + web3ProviderPort;
const web3 = new Web3(web3Address);
web3.eth.net
  .isListening()
  .then((isUp) => {
    if (isUp) {
      console.log("Web3 is Up");
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
    .ToggleOn()
    .on("data", (event) => {
      console.log("Toggle On Caught");
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
    .ToggleOff()
    .on("data", (event) => {
      console.log("Toggle Off Caught");
      axios
        .get("http://" + poeAPIURL + ":" + poeAPIPort + "/off")
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .on("error", console.error);
}
