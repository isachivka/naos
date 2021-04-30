const custom = require("@isachivka/cz-conventional-changelog-for-jira/configurable");
const getPackages = require("get-monorepo-packages");

const packages = getPackages("./");
const names = packages.map((pkg) => {
  return pkg.location.split("/")[1];
});

module.exports = custom({
  skipScope: false,
  scopes: ["", ...names],
  jiraOptional: true,
});
