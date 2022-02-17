require("dotenv").config();

const path = require("path");
const fs = require("fs");
const Web3 = require("web3");

const baseDir = path.join(__dirname, "..");
const buildDir = path.join(baseDir, "build");
const nodeModulesDir = path.join(baseDir, "node_modules");
const contractsDir = path.join(baseDir, "contracts");

module.exports = async function deployContract(contractName, opts = {}) {
  const web3ProviderURL =
    opts.web3ProviderURL || process.env.WEB3_PROVIDER_URL || "127.0.0.1";
  const web3ProviderPort =
    opts.web3ProviderPort || process.env.WEB3_PROVIDER_PORT || 8545;
  const deployerAddress = opts.deployerAddress || process.env.DEPLOYER_ADDRESS;
  const deployerPassphrase =
    opts.deployerPassphrase || process.env.DEPLOYER_PASSPHRASE;

  const contractFilename = `${contractName}.sol`;
  const json = JSON.parse(
    fs.readFileSync(path.join(buildDir, `${contractName}.bin`), "utf-8")
  );

  const contract = json.contracts[contractFilename][contractName];
  const contractABI = contract["abi"];
  const contractBytecode = contract.evm.bytecode.object;

  const web3 = new Web3("ws://" + web3ProviderURL + ":" + web3ProviderPort);
  console.log("web3", "ws://" + web3ProviderURL + ":" + web3ProviderPort);
  const lightEmUpContract = new web3.eth.Contract(contractABI);

  // Fund account
  // const accounts = await web3.eth.personal.getAccounts();
  // console.log(web3.eth.accounts);

  await web3.eth.sendTransaction({
    from: deployerAddress,
    to: deployerAddress,
    value: 10000000000000000,
  });

  // const unlock = await web3.eth.personal.unlockAccount(
  //   deployerAddress,
  //   deployerPassphrase
  // );

  const contractOpts = {
    data: `0x${contractBytecode}`,
    arguments: [],
  };
  const txnObj = {
    from: deployerAddress,
    gas: 1000000,
  };

  const res = await lightEmUpContract.deploy(contractOpts);
  const deploy = await res.send(txnObj);
  console.log("DEPLOY", deploy);
  return deploy;
};
