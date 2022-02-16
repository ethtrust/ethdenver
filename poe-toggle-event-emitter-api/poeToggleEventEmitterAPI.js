require("dotenv").config();

// Notice: danger keeping file reading in here
const path = require("path");
const fs = require("fs");
const Web3 = require("web3");
const express = require("express");

const emitterAPI = express();
emitterAPI.use(express.json());

// const emitterConfig = require("./config/poeEmitterConfig.json");
const contractName = process.env.CONTRACT_NAME;

// TODO: move me, kthx
const json = JSON.parse(
  fs.readFileSync(path.join(__dirname, "build", `${contractName}.bin`), "utf-8")
);
const contract = json.contracts[`${contractName}.sol`][contractName];
const contractABI = contract["abi"];

const web3ProviderURL = process.env.WEB3_PROVIDER_URL;
const web3ProviderPort = process.env.WEB3_PROVIDER_PORT;
const contractAddress =
  process.env.CONTRACT_ADDRESS || process.env.TEST_CONTRACT_ADDRESS;
const port = process.env.PORT || 3000;

if (
  !(
    contractName &&
    web3ProviderURL &&
    web3ProviderPort &&
    contractABI &&
    contractAddress
  )
) {
  console.error(`Not all required values are provided`);
  process.exit(-1);
}

const web3 = new Web3("ws://" + web3ProviderURL + ":" + web3ProviderPort);
const lightEmUpContract = new web3.eth.Contract(contractABI, contractAddress);

emitterAPI.post("/togglePoe", function (req, res) {
  if (req.body.poeState.toUpperCase() === "ON") {
    lightEmUpContract.methods
      .toggleOn()
      .call()
      .then(() => res.sendStatus(200))
      .catch((err) => {
        res.status(500).json({ error: err });
        console.log(err);
      });
  } else if (req.body.poeState.toUpperCase() === "OFF") {
    lightEmUpContract.methods
      .toggleOff()
      .call()
      .then(() => res.sendStatus(200))
      .catch((err) => {
        res.status(500).json({ error: err });
        console.log(err);
      });
  } else {
    res
      .status(422)
      .json({ error: "Server Expected poeState to be either ON or OFF." });
  }
});

emitterAPI.listen(port, () => {
  console.log(`POE Event Emitter API is Listening on Port ${port}`);
});