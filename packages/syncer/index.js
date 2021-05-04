#!/usr/bin/env node

const getPackages = require("get-monorepo-packages");
const { error } = require("./log");
const getConfig = require("./getConfig");
const getPushPackages = require("./getPushPackages");
const commit = require("./commit");
const { confirmPush } = require("./confirmPush");

const [, , action] = process.argv;
const path = process.cwd();

function push() {
  const config = getConfig(path);
  const { fixedVersions } = config;
  const packages = getPackages(path);
  console.log(packages);
  const latestVersions = {};
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

function pull() {}

function auto() {}

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
