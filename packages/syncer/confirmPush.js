const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pushUniq = (arr, item) => {
  if (arr.indexOf(item) === -1) {
    arr.push(item);
  }
};

function getMessage(pushPackages) {
  const repackages = pushPackages.reduce((acc, pkg) => {
    Object.keys(pkg.pushDependencies).forEach((dep) => {
      if (!acc.hasOwnProperty(dep)) {
        acc[dep] = { next: [], prev: [], latest: false, fixed: false };
      }
      const item = acc[dep];

      const dependency = pkg.pushDependencies[dep];
      pushUniq(item.prev, dependency.prev);
      pushUniq(item.next, dependency.next);
      if (dependency.fixed) {
        item.fixed = true;
      }
      if (dependency.latest) {
        item.latest = true;
      }
    });

    return acc;
  }, {});

  let message = `\nPackages to update:\n\n`;
  Object.keys(repackages).forEach((name) => {
    const dep = repackages[name];
    message += `${name}: ${dep.prev.join(", ")} => ${dep.next.join(", ")}`;
    if (dep.fixed) {
      message += ` (fixed)\n`;
    }
    if (dep.latest) {
      message += ` (latest)\n`;
    }
  });
  return message;
}

function confirmPush(pushPackages) {
  return new Promise((res, rej) => {
    const message = getMessage(pushPackages);
    console.log(message);
    rl.question("Confirm (y/n)? ", (answer) => {
      rl.close();
      if (answer === "y") {
        res(true);
      }

      res(false);
    });
  });
}

module.exports = {
  getMessage,
  confirmPush,
};
