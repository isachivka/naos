function printMessage(latestPackages) {
  console.log("Latest packages: ");
  Object.keys(latestPackages).forEach((pkgName) => {
    console.log(`${pkgName}@${latestPackages[pkgName]}`);
  });
}

module.exports = printMessage;
