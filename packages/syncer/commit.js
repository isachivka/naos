function commit(pushPackages) {
  console.log(pushPackages);
  return Promise.resolve(true);
}

module.exports = commit;
