const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const api = {
  create: {
    url: "https://bots.airslate.com/slate-creation-from-event-bot/create-slate",
    method: "POST",
  },
};

function getHeaders(token, method) {
  return { method, headers: { Authorization: token } };
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
    method: api.create.method,
    headers: { Authorization: token },
  }).then((response) => response.json());
}

module.exports = {
  createSlate,
};
