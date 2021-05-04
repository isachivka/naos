const fs = require("fs");
const { error } = require("./log");

function getConfig(path) {
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

module.exports = getConfig;
