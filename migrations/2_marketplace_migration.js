const MarketplaceMigrations = artifacts.require("CourseMarketPlace");

module.exports = function (deployer) {
  deployer.deploy(MarketplaceMigrations);
};
