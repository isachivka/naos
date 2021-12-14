const path = require("path");
const getPackages = require("get-monorepo-packages");

function getLatestPackages(sources, fixedVersions, root) {
  const repositories = sources.map((relPath) => path.resolve(root, relPath));

  return repositories.reduce((acc, repository) => {
    const pkgs = getPackages(repository);
    pkgs.forEach((pkg) => {
      acc[pkg.package.name] = fixedVersions[pkg.package.name]
        ? fixedVersions[pkg.package.name]
        : pkg.package.version;
    });
    return acc;
  }, {});
}

module.exports = getLatestPackages;
