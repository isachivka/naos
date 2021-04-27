#### Node.js script for airSlate `Create Slate from External Event Bot`

[Official documentation](https://cdn.airslate.com/static/62/assets/files/user-guide-create-slate-from-external-event-bot.pdf)

#### API:

```js
const fields = [
  {
    id: 'E9F25E89-FD00-0000-000021F6-0001',
    name: 'package-name',
    value: 'name',
  },
  {
    id: 'E9F25E89-FD00-0000-000021F6-0002',
    name: "package-changelog",
    value: "changelog",
  }
];

const fieldsWithoutId = [
  {
    name: 'package-name',
    value: 'name',
  },
  {
    name: "package-changelog",
    value: "changelog",
  }
];

getSample(token)
  .then(JSON.stringify)
  .then(console.log);

createSlate(token, fields)
  .then(JSON.stringify)
  .then(console.log);

getStructure(token)
  .then(JSON.stringify)
  .then(console.log);

// Two API calls, sample -> createSlate, experimental
createSlateAutolink(token, fieldsWithoutId)
  .then(JSON.stringify)
  .then(console.log);
```
