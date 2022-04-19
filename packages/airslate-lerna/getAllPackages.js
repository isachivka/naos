const cp = require("child_process");

function getAllPackages() {
  const { stdout } = cp.spawnSync("lerna", ["list", "-la"]);
  const packagesString = stdout.toString();
  const packages = packagesString
    .split("\n")
    .filter((n) => n)
    .map((line) => {
      const split = line.split(" ").filter((n) => n);
      // Filter private packages
      if (split[3]) {
        return null;
      }
      return {
        name: split[0],
        version: split[1],
        location: `./${split[2]}`,
      };
    })
    .filter((n) => n);
  return packages;
}

module.exports = {
  getAllPackages,
};
