---

# svelte-web3

import web3.js as a store for Svelte or Sapper.

## Svelte and Sapper installation

1. add the `svelte-web3` package

```bash
npm i svelte-web3
```

2. add the web3.js library in the main HTML page (`public/index.html` in Svelte and `src/template.html` in Sapper)

```html
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>

```

## Svelte and Sapper basic usage

Import the `ethStore` main connection helper and needed derived Svelte stores (see list below):

```js
import { ethStore, web3, selectedAccount, connected } from 'svelte-web3'
```

To enable connection to the current window provider: 

```js
ethStore.setBrowserProvider()
```

To enable connection using an url string: 

```js
ethStore.setProvider('<ws/https or http provider url>')
```

Please note that if your code is running in SSR context (like with
Sapper), you can only call `setBrowserProvider` and `setProvider` in
browser context for example using `onMount` or as an handler of a
client-side event :

```js
  onMount(
    async () => {
      console.log('Connecting to Ethereum Testnet Görli...')
      ethStore.setProvider('https://rpc.slock.it/goerli')
    })
```

In SSR context, the stores are defined but no connection has been
instanciated.

If a connection is successful, you can access the instantiated web3.js
with the current window provider using the `$` svelte store syntax :

```js
$web3.eth.getBalance(<Ethereum address>)
```

## Derived stores

* connected: true if connection to the provider was successful.
* chainId: The current blokchain Id.
* chainName: Name of the The current blokchain.
* selectedAccount: current selected account.
* nativeCurrency: currency name in the current chain.

Svelte stores are automatically updated when network or the selected account change.

Please see the file `example/App.svelte` for more usage information to start a transaction
and concrete usage of stores.

## Svelte example (based on rollup template)

Please check `example/svelte-app-template-web3` in github.

## Sapper example (ased on webpack template)

Please check `example/sapper-app-template-web3` in github.
