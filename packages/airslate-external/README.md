#### Node.js script for airSlate `Create Slate from External Event Bot`

[Official documentation](https://cdn.airslate.com/static/62/assets/files/user-guide-create-slate-from-external-event-bot.pdf)

#### API:

```js
const fields = [
  {
    id: 'name',
    value: 'Igor',
  },
  {
    id: 'surname',
    value: "Sachivka",
  }
];

createSlate(token, fields)
  .then(JSON.stringify)
  .then(console.log);
```
