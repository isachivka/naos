#!/usr/bin/env node

const fs = require("fs");
const getPackages = require("get-monorepo-packages");
const airslateExternal = require("@naos/airslate-external");
const { ArgumentParser } = require("argparse");
const parseResult = require("./parseResult");
const { getAllPackages } = require("./getAllPackages");
const { getFixedVersions } = require("./getFixedVesions");

const parser = new ArgumentParser({});
parser.add_argument("-t", "--token");
parser.add_argument("-o", "--owner");
parser.add_argument("-r", "--repo");
parser.add_argument("-f", "--file");

let data = "";

function onMessage(chunk) {
  data += chunk;
  console.log(chunk.toString());
}

function getMessageGhForPackage(pk) {
  return `${pk.name}@${pk.version} \n`;
}

function getMessageForPackage(pk) {
  const path = `${pk.location}/CHANGELOG.md`;
  if (fs.existsSync(path)) {
    return `<https://github.com/${parser.parse_args().owner}/${
      parser.parse_args().repo
    }/blob/master/${path.replace("./", "")}|${pk.name}@${pk.version}> \n`;
  }

  return `${pk.name}@${pk.version} \n`;
}

function onEnd() {
  const publishedPackages = parseResult(data, getPackages("./"));
  if (publishedPackages) {
    const namesPublished = publishedPackages.map((pp) => pp.name);
    const allPackages = getAllPackages();
    const otherPackages = allPackages.filter(
      (ap) => namesPublished.indexOf(ap.name) === -1
    );
    let slackMessage = `*Published packages:* \n\n`;
    publishedPackages.forEach((pp) => {
      slackMessage += getMessageForPackage(pp);
    });

    slackMessage += `\n*Other packages:* \n\n`;

    otherPackages.forEach((op) => {
      slackMessage += getMessageForPackage(op);
    });

    slackMessage += `\n*Fixed versions:* \n\n`;

    slackMessage += `\`\`\`${getFixedVersions(
      allPackages,
      publishedPackages
    )}\`\`\``;

    airslateExternal
      .createSlate(parser.parse_args().token, [
        {
          id: "message",
          value: slackMessage,
        },
      ])
      .then((success) => {
        console.log("success", success);
      })
      .catch((error) => {
        console.error("error", error.json());
      });

    if (parser.parse_args().file === "1") {
      let ghMessage = `**Published packages:** \n\n`;
      publishedPackages.forEach((pp) => {
        ghMessage += getMessageGhForPackage(pp);
      });

      ghMessage += `\n**Fixed versions:** \n\n`;

      ghMessage += `\`\`\`
${getFixedVersions(allPackages, publishedPackages)}
\`\`\``;

      fs.writeFileSync("./output", ghMessage);
    }
  } else {
    fs.writeFileSync("./output", `Nothing published`);
  }
}

process.stdin.resume();
process.stdin.on("data", onMessage);
process.stdin.on("end", onEnd);
