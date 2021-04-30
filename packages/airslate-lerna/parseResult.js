/**
 * God help you
 */
function parseResult(text, pkgs) {
  const packages = pkgs.reduce((acc, pkg) => {
    acc[pkg.package.name] = pkg.location;
    return acc;
  }, {});
  const singleLine = text.replace(/\n/g, "|");
  const successText = singleLine.match(
    /Successfully published:(.+)lerna success/
  );
  if (successText && successText[1]) {
    return successText[1]
      .replace(/ - /g, "")
      .split("|")
      .filter((e) => e)
      .map((pkg) => {
        const version = pkg.match(/[^^]@(.+)/)[1];
        const name = pkg.replace(`@${version}`, "");
        return {
          version,
          name,
          location: `./${packages[name]}`,
        };
      });
  }
  return false;
}

module.exports = parseResult;
