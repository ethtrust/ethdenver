// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("EthTrustDenverDemo", {
    from: deployer,
    contract: "EthTrustDenverDemo",
    args: [],
  });
};
module.exports.tags = ["EthTrustDenverDemo"];
