const parseResult = require("../parseResult");

describe("parseResult", () => {
  const text = `
info
 cli using local version of lerna

lerna
 notice cli v4.0.0

lerna info versioning
 independent
lerna info ci enabled

lerna notice 

Successfully published:

 - @editors/elements-traverse@1.0.4
 - @editors/elements@2.0.0
 - @editors/validations-core@1.0.4
 - @editors/engine@1.0.10

lerna success published 4 packages
`;

  const packages = [
    {
      location: "elements-traverse",
      package: {
        name: "@editors/elements-traverse",
      },
    },
    {
      location: "elements",
      package: {
        name: "@editors/elements",
      },
    },
    {
      location: "validations-core",
      package: {
        name: "@editors/validations-core",
      },
    },
    {
      location: "engine",
      package: {
        name: "@editors/engine",
      },
    },
  ];

  it("should parse regular lerna result", () => {
    expect(parseResult(text, packages)).toEqual([
      {
        location: "./elements-traverse",
        name: "@editors/elements-traverse",
        version: "1.0.4",
      },
      {
        location: "./elements",
        name: "@editors/elements",
        version: "2.0.0",
      },
      {
        location: "./validations-core",
        name: "@editors/validations-core",
        version: "1.0.4",
      },
      {
        location: "./engine",
        name: "@editors/engine",
        version: "1.0.10",
      },
    ]);
  });
});
