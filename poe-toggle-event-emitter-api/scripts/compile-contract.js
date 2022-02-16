#!/usr/bin/env node

require("dotenv").config();
const compileContract = require("../lib/compile");
const contractName = process.env.CONTRACT_NAME;

compileContract(contractName);
