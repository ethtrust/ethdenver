const path = require("path");
const fs = require("fs");

const baseDir = path.join(__dirname, "..");
const buildDir = path.join(baseDir, "build");
const nodeModulesDir = path.join(baseDir, "node_modules");
const contractsDir = path.join(baseDir, "contracts");

module.exports = function compileContract(contractName, opts) {
  const output = require("./reader")(contractName, opts);

  const outputFile = path.join(buildDir, `${contractName}.bin`);
  fs.writeFileSync(outputFile, JSON.stringify(output), {
    encoding: "utf-8",
  });
};
