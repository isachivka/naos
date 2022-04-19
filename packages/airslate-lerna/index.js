#!/usr/bin/env node

const fs = require("fs");
const getPackages = require("get-monorepo-packages");
const airslateExternal = require("@naos/airslate-external");
const { ArgumentParser } = require("argparse");
const parseResult = require("./parseResult");
const { getAllPackages } = require("./getAllPackages");

const parser = new ArgumentParser({});
parser.add_argument("-t", "--token");
parser.add_argument("-o", "--owner");
parser.add_argument("-r", "--repo");

let data = "";

function onMessage(chunk) {
  data += chunk;
  console.log(chunk.toString());
}

function getMessageForPackage(pk) {
  const path = `${pk.location}/CHANGELOG.md`;
  if (fs.existsSync(path)) {
    return `<https://github.com/${parser.parse_args().owner}/${
      parser.parse_args().repo
    }/blob/master/${path.replace("./", "")}|${pk.name}@${pk.version}> \n`;
  }

  return `${pp.name}@${pp.version} \n`;
}

function onEnd() {
  const publishedPackages = parseResult(data, getPackages("./"));
  if (publishedPackages) {
    const namesPublished = publishedPackages.map((pp) => pp.name);
    const allPackages = getAllPackages();
    const otherPackages = allPackages.filter(
      (ap) => namesPublished.indexOf(ap.name) === -1
    );
    let slackMessage = `**Published packages:** \n\n`;
    publishedPackages.forEach((pp) => {
      slackMessage += getMessageForPackage(pp);
    });

    slackMessage += `\n**Other packages:** \n\n`;

    otherPackages.forEach((op) => {
      slackMessage += getMessageForPackage(op);
    });

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
  }
}

process.stdin.resume();
process.stdin.on("data", onMessage);
process.stdin.on("end", onEnd);
