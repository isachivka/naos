#### Lerna publish parser and slate creator

Based on `@naos/airslate-external`

#### API:

```shell script
yarn add airslate-lerna
lerna publish 2>&1 | airslate-lerna --token=*** --owner=*** --- repo=***
               # airSlate external bot token 👆🏻
```

#### TODO:

Can be simplified after merge https://github.com/lerna/lerna/pull/2653
