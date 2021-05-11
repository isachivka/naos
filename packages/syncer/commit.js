const fs = require('fs');

const bumpDeps = (json, pkgToUpdate, path, targetVersion) => {
  if (
    json.hasOwnProperty(path) &&
    json[path].hasOwnProperty(pkgToUpdate)
  ) {
    // eslint-disable-next-line no-param-reassign
    json[path][pkgToUpdate] = targetVersion;
  }
};


const writePackageJson = (jsonLocation, objectToJson) => {
  fs.writeFileSync(
    jsonLocation,
    `${JSON.stringify(objectToJson, undefined, 2)}\n`,
  );
};

const getPackageJson = (jsonLocation) => {
  return require(jsonLocation);
};

function commit(pushPackages) {
  pushPackages.forEach((pkg) => {
    const packageJson = getPackageJson(pkg.jsonLocation);
    Object.keys(pkg.pushDependencies).map((pkgToUpdate) => {
      const targetVersion = pkg.pushDependencies[pkgToUpdate].next;
      bumpDeps(packageJson, pkgToUpdate, 'dependencies', targetVersion);
      bumpDeps(packageJson, pkgToUpdate, 'devDependencies', targetVersion);
      bumpDeps(packageJson, pkgToUpdate, 'peerDependencies', targetVersion);
    })
    writePackageJson(pkg.jsonLocation, packageJson);
  })
  return Promise.resolve(true);
}

module.exports = commit;
