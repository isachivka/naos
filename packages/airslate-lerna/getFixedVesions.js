function getFixedVersions(allPackages, publishedPackages) {
  const obj = {};
  allPackages.forEach((ap) => {
    obj[ap.name] = ap.version;
  });
  publishedPackages.forEach((ap) => {
    obj[ap.name] = ap.version;
  });
  return JSON.stringify(obj, null, 2);
}

module.exports = {
  getFixedVersions,
};
