#!/usr/bin/env node

const fs = require("fs");
const [, , action] = process.argv;
const path = process.cwd();

function error(str) {
  throw new Error(str);
}

function getConfig() {
  const configPath = `${path}/.syncerrc`;
  const isConfigExists = fs.existsSync(configPath);
  if (isConfigExists) {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (e) {
      error(`Can't parse: ${configPath}, ${e}`);
    }
  }

  error(`Config do not exists, expected path: ${configPath}`);
}

function push() {
  const config = getConfig();
  console.log(config);
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
