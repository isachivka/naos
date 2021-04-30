const fetch = require("node-fetch");

const api = {
  create: {
    url: "https://bots.airslate.com/slate-creation-from-event-bot/create-slate",
    method: "POST",
  },
  structure: {
    url: "https://bots.airslate.com/slate-creation-from-event-bot/documents",
    method: "GET",
  },
  sample: {
    url: "https://bots.airslate.com/slate-creation-from-event-bot/create-slate",
    method: "GET",
  },
};

function getHeaders(token, method) {
  return { method, headers: { Authorization: token } };
}

function flatFields(fields) {
  return fields.reduce((acc, field) => {
    acc[field.attributes.name] = field.id;
    return acc;
  }, {});
}

function createSlate(token, fields) {
  return fetch(api.create.url, {
    body: JSON.stringify({
      data: {
        type: "slate_creation_requests",
      },
      meta: {
        fields,
      },
    }),
    ...getHeaders(token, api.create.method),
  }).then((response) => response.json());
}

function createSlateAutolink(token, fields) {
  return getSample(token)
    .then((sample) => flatFields(sample.included))
    .then((flatFields) =>
      fields.map((field) => ({
        ...field,
        id: flatFields[field.name],
      }))
    )
    .then((fieldsWithIds) => {
      return createSlate(token, fieldsWithIds);
    });
}

function getStructure(token) {
  return fetch(
    api.structure.url,
    getHeaders(token, api.structure.method)
  ).then((response) => response.json());
}

function getSample(token) {
  return fetch(
    api.sample.url,
    getHeaders(token, api.sample.method)
  ).then((response) => response.json());
}

module.exports = {
  getSample,
  createSlate,
  getStructure,
  createSlateAutolink,
};
