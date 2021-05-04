function getPushPackages({ packages, fixedVersions, latestVersions }) {
  return packages.reduce((acc, pkg) => {
    const { location } = pkg;
    const {
      dependencies: stdDependencies,
      devDependencies,
      peerDependencies,
      name,
    } = pkg.package;
    const jsonLocation = `${location}/package.json`;

    const dependencies = {
      ...stdDependencies,
      ...devDependencies,
      ...peerDependencies,
    };

    const pushDependencies = Object.keys(dependencies).reduce(
      (depAcc, dependency) => {
        const dependencyVersion = dependencies[dependency];

        if (fixedVersions.hasOwnProperty(dependency)) {
          if (fixedVersions[dependency] !== dependencyVersion) {
            depAcc[dependency] = {
              prev: dependencyVersion,
              next: fixedVersions[dependency],
              fixed: true,
            };
            return depAcc;
          }

          return depAcc;
        }

        if (latestVersions.hasOwnProperty(dependency)) {
          if (latestVersions[dependency] !== dependencyVersion) {
            depAcc[dependency] = {
              prev: dependencyVersion,
              next: latestVersions[dependency],
              latest: true,
            };
            return depAcc;
          }
        }

        return depAcc;
      },
      {}
    );

    if (Object.keys(pushDependencies).length > 0) {
      acc.push({
        jsonLocation,
        pushDependencies,
        name,
      });
    }
    return acc;
  }, []);
}

module.exports = getPushPackages;
