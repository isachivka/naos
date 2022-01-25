#!/usr/bin/env node

const { resolve } = require("path");
const getPackages = require("./utils/getPackages");
const { error } = require("./log");
const getConfig = require("./getConfig");
const getPushPackages = require("./push/getPushPackages");
const commit = require("./push/commit");
const getLatestPackages = require("./pull/getLatestPackages");
const printMessage = require("./pull/printMessage");
const { confirmPush } = require("./push/confirmPush");

const [, , action] = process.argv;
const path = process.cwd();

function push(latestVersions = {}) {
  const config = getConfig(path);
  const fixedVersions = (config.fixedVersions = {});
  const packages = [
    ...getPackages(path),
    { location: path, package: require(resolve(path, "package.json")) },
  ];
  const pushPackages = getPushPackages({
    packages,
    fixedVersions,
    latestVersions,
  });
  confirmPush(pushPackages)
    .then((y) => {
      if (y) {
        console.log("Updating...");
        return commit(pushPackages);
      } else {
        return Promise.reject("Cancelled");
      }
    })
    .catch(error)
    .then((finished) => {
      if (finished) {
        console.log("Finished");
      } else {
        error("Error :(");
      }
    });
}

function pull() {
  const config = getConfig(path);
  const latestPackages = getLatestPackages(config.sources || [], config.fixedVersions || {}, path);
  printMessage(latestPackages);
  return latestPackages;
}

function auto() {
  const latestPackages = pull();
  return push(latestPackages);
}

const actions = {
  push,
  pull,
  auto,
};

if (actions.hasOwnProperty(action)) {
  actions[action]();
} else {
  error(
    `Unknown action: '${action}', please use ${Object.keys(actions).join(", ")}`
  );
}
