const path = require("path");
const fs = require("fs");
const solc = require("solc");

const baseDir = path.join(__dirname, "..");
const buildDir = path.join(baseDir, "build");
const nodeModulesDir = path.join(baseDir, "node_modules");
const contractsDir = path.join(baseDir, "contracts");

module.exports = function readContract(
  contractName,
  opts = { baseDir, contractsDir, nodeModulesDir }
) {
  const contractPath = path.join(contractsDir, `${contractName}.sol`);
  const source = fs.readFileSync(contractPath, "utf-8");

  const hardhatConsoleContent = fs.readFileSync(
    path.join(nodeModulesDir, "hardhat/console.sol"),
    "utf-8"
  );

  const input = {
    language: "Solidity",
    sources: {
      [path.basename(contractPath)]: {
        content: source.toString(),
      },
      "hardhat/console.sol": {
        content: hardhatConsoleContent.toString(),
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const compiledJson = solc.compile(JSON.stringify(input));
  return JSON.parse(compiledJson);
};
