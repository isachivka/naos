#!/usr/bin/env node

const lodash = require("lodash");
const fs = require("fs");
const getPackages = require("get-monorepo-packages");
const airslateExternal = require("@naos/airslate-external");
const { ArgumentParser } = require("argparse");
const parseResult = require("./parseResult");

const parser = new ArgumentParser({});
parser.add_argument("-t", "--token");

let data = "";

function onMessage(chunk) {
  data += chunk;
  console.log(chunk.toString());
}

function onEnd() {
  const publishedPackages = parseResult(data, getPackages("./"));
  if (publishedPackages) {
    const packagesWithChangelog = appendChangelogs(publishedPackages);
    const normalized = packagesWithChangelog.map(normalize);
    normalized.forEach((pkg) => {
      const name = pkg[0].value;
      const version = pkg[1].value;
      const title = `${name}@${version}`;
      airslateExternal
        .createSlateAutolink(parser.parse_args().token, pkg)
        .then(() => console.log(`🧬 ${title} created as a slate`))
        .catch((error) =>
          console.error(
            `🆘 ${title} slate creation failed\n\n${error.toString()}`
          )
        );
    });
  }
}

function appendChangelogs(packages) {
  return packages.map(appendChangelog);
}

function normalize(pkg) {
  const keys = Object.keys(pkg);

  return keys.map((key) => ({
    name: key,
    value: pkg[key],
  }));
}

/**
 * God help you
 */
function appendChangelog(pkg) {
  const path = `${pkg.location}/CHANGELOG.md`;
  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path).toString().split("\n");

    const selectedContent = [];
    let started = false;
    let finished = false;
    let i = 1;

    while (i < content.length && !finished) {
      const chunk = content[i];
      const start =
        lodash.startsWith(chunk, "## ") || lodash.startsWith(chunk, "# ");
      if (started && !finished && start) finished = true;
      if (!started && start) started = true;
      if (started && !finished) selectedContent.push(chunk);
      i++;
    }

    const changelog = selectedContent.join("\n");

    return {
      name: pkg.name,
      version: pkg.version,
      changelog,
    };
  }

  return pkg;
}

process.stdin.resume();
process.stdin.on("data", onMessage);
process.stdin.on("end", onEnd);
