#!/usr/bin/env node

let data = '';

function onMessage(chunk) {
  data += chunk;
}

function onEnd() {
  console.log(data);
}

process.stdin.resume();
process.stdin.on('data', onMessage);
process.stdin.on('end', onEnd);
