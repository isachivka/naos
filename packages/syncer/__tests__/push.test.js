const getPushPackages = require("../push/getPushPackages");
const { getMessage } = require("../push/confirmPush");

const packages = [
  {
    location: "/a",
    package: {
      name: "@bar/a",
      dependencies: { "@foo/a": "1.0.0", "@foo/b": "1.0.0" },
    },
  },
  {
    location: "/b",
    package: {
      name: "@bar/b",
      dependencies: {
        "@foo/b": "1.0.0",
        "@foo/c": "1.0.0",
        "@foo/d": "1.0.0",
      },
    },
  },
  {
    location: "/c",
    package: {
      name: "@bar/c",
      dependencies: {},
    },
  },
];
const fixedVersions = {
  "@foo/a": "1.2.1",
  "@foo/b": "1.2.2",
  "@foo/c": "1.2.3",
};
const latestVersions = {
  "@foo/a": "2.0.0",
  "@foo/d": "2.0.0",
};

describe("getPushPackages", () => {
  it("should work fine", () => {
    expect(
      getPushPackages({
        packages,
        fixedVersions,
        latestVersions,
      })
    ).toEqual([
      {
        jsonLocation: "/a/package.json",
        pushDependencies: {
          "@foo/a": { prev: "1.0.0", next: "1.2.1", fixed: true },
          "@foo/b": { prev: "1.0.0", next: "1.2.2", fixed: true },
        },
        name: "@bar/a",
      },
      {
        jsonLocation: "/b/package.json",
        pushDependencies: {
          "@foo/b": { prev: "1.0.0", next: "1.2.2", fixed: true },
          "@foo/c": { prev: "1.0.0", next: "1.2.3", fixed: true },
          "@foo/d": { prev: "1.0.0", next: "2.0.0", latest: true },
        },
        name: "@bar/b",
      },
    ]);
  });
});

describe("getMessage", () => {
  it("should work fine", () => {
    const pushPackages = getPushPackages({
      packages,
      fixedVersions,
      latestVersions,
    });
    const message = `
Packages to update:

@foo/a: 1.0.0 => 1.2.1 (fixed)
@foo/b: 1.0.0 => 1.2.2 (fixed)
@foo/c: 1.0.0 => 1.2.3 (fixed)
@foo/d: 1.0.0 => 2.0.0 (latest)
`;

    expect(getMessage(pushPackages)).toEqual(message);
  });
});
