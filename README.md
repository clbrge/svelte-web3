---

# svelte-web3

Import the [web3.js library](https://web3js.readthedocs.io/) as a
collection of [readable svelte stores](https://svelte.dev/tutorial/readable-stores)
for Svelte, Sapper or Svelte-kit.

## Svelte, Sapper and Svelte-kit installation

1. add the `svelte-web3` package

```bash
npm i svelte-web3
```

2. add the web3.js library in the main HTML page (`public/index.html` in Svelte, `src/template.html` in Sapper or `src/app.html` in Svelte-kit)

```html
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
```

## Svelte and Sapper basic usage

Import the `ethStore` main connection helper and needed derived Svelte stores (see list below):

```js
import { ethStore, web3, selectedAccount, connected, chainData } from 'svelte-web3'
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
* selectedAccount: current selected account (if connected).
* chainId: The current chainId (if connected).
* chainData: The current blokchain CAIP-2 data (if connected), see below.

Svelte stores are automatically updated when the chain or the selected account change.

Please see the file `example/App.svelte` for more usage information to start a transaction
and concrete usage of stores.

## Human readable chain CAIP-2 information

`chainData` is a store returning the current JavaScript [CAIP-2 representation](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md) object.

### Example of information available (vary depending on the chain)

```json
{
  "name": "Ethereum Mainnet",
  "chain": "ETH",
  "network": "mainnet",
  "rpc": [
    "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://api.mycryptoapi.com/eth"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ethereum.org",
  "shortName": "eth",
  "chainId": 1,
  "networkId": 1,
  "icon": "ethereum",
  "explorers": [{
    "name": "etherscan",
    "url": "https://etherscan.io",
    "icon": "etherscan",
    "standard": "EIP3091"
  }]
}
```

## Svelte example (based on rollup template)

Please check `example/svelte-app-template-web3` in github.

## Sapper example (based on webpack template)

Please check `example/sapper-app-template-web3` in github.
