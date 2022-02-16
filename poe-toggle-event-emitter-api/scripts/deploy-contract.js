#!/usr/bin/env node

require("dotenv").config();
const deployContract = require("../lib/deploy");
const contractName = process.env.CONTRACT_NAME;
const fs = require("fs");
const path = require("path");
const { parse, stringify } = require("envfile");

const basePath = path.join(__dirname, "..");
const envFilepath = path.join(basePath, ".env");
(async () => {
  const envs = parse(fs.readFileSync(envFilepath, "utf-8"));
  const newContract = await deployContract(contractName);
  envs["CONTRACT_ADDRESS"] = `"${newContract.options.address}"`;
  fs.writeFileSync(envFilepath, stringify(envs));
  process.exit(0);
})();
