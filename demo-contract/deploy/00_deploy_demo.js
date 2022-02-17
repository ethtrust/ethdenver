// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // const LightEmUp = await deployments.get("EthTrustDenverDemo");
  // const LightEmUp = await ethers.getContractFactory("EthTrustDenverDemo");
  // const lightEmUp = await LightEmUp.deploy();
  // console.log(lightEmUp);
  const result = await deploy("EthTrustDenverDemo", {
    from: deployer,
    contract: "EthTrustDenverDemo",
    args: [],
  });
  console.log("rESULT", result);
  // await deploy("EthTrustDenverDemo", {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });
};
module.exports.tags = ["EthTrustDenverDemo"];
