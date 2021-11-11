---

# svelte-web3

Use the [web3.js library](https://web3js.readthedocs.io/) as a
collection of [readable svelte stores](https://svelte.dev/tutorial/readable-stores)
for Svelte, Sapper or Sveltekit.

## Installation

1. add the `svelte-web3` package

```bash
npm i svelte-web3
```

2. add the web3.js library in the main HTML page (`public/index.html` in Svelte, `src/template.html` in Sapper or `src/app.html` in SvelteKit)

```html
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
```

## Basic usage (defaultstore connected to one chain)

Import the `defaultChainStore` main connection helper and needed derived Svelte stores (see list below):

```js
import { defaultChainStore, web3, selectedAccount, connected, chainData } from 'svelte-web3'
```

:exclamation: `defaultChainStore` was named before `ethStore`. The
former naming still works but will be removed in later versions of
`svelte-web3` package. Please update your code!

### Connection with the browser provider (wallets like metamask)

To enable a connection with the current window provider: 

```js
defaultChainStore.setBrowserProvider()
```

Please note that your code need to be in browser context when
`setBrowserProvider` is running. So you may want to use `onMount` when
using Sapper or Sveltekit. Similarly, you cannot use
`setBrowserProvider` in SSR context.

```js
  onMount(
    () => {
      // add a test to return in SSR context
      defaultChainStore.setBrowserProvider()
    }
  )
```

### Connection with other providers (ws, http, Web3Modal, Walletconnect, etc)

To enable connection using an url string or a valid provider object
(as returned by web3Modal or WalletConnect for example):

```js
defaultChainStore.setProvider(<ws/https or http provider url or provider Object>)
```

Please check `examples/svelte-app-template-web3/src/Web3Modal.svelte` in github.


### Forcing a disconnect (and event subscriptions from a provider)

Simply call the function `close` directly on the store. For example with the default store:

```js
defaultChainStore.close()
```

### Using the Web3 instance $web3 after the connection

If a connection is successful, you can access the instantiated web3.js
using the `$` svelte store syntax :

```js
$web3.eth.getBalance(<Ethereum address>)
```

The whole Web3.js API is now usable in the `<script>` section of your
svelte files if you always use notation `$web3` and not `web3` which
is the default notation is in web3.js library documentation.  (using
`svelte-web3` package, because the svelte store value should always
start with `$`, `web3` is the Svelte store itself, not the
instantiated library)

## Derived stores

Some helpers derivated Svelte stores have been defined. They are
automatically updated when a new connection happens, or when the chain
or the selected account change:

* connected: true if connection to the provider was successful.
* selectedAccount: current selected account (if connected).
* chainId: The current chainId (if connected).
* chainData: The current blokchain CAIP-2 data (if connected), see below.


Please see the file
`examples/svelte-app-template-web3/src/MonoChain.svelte` for more
usage information to start a transaction and concrete usage of derived
stores.


## Human readable chain CAIP-2 information

`chainData` is a store returning the current JavaScript [CAIP-2 representation](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md) object.

### Example

The information returned by the `chainData` store depends (like all
other web3 stores) on which chain the current provider is
connected. If the store has not yet been connected (with `setProvider`
or `setBrowserProvider`), the store value will be `undefined`.

Below is the CAIP-2 formatted information when the default store is 
connected with the Ethereum Mainnet :

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


You might want to access all chains CAIP-2 data directly without using the
`chainData` store. In this case, use the getter `allChainsData`, it returns
the list of all CAIP-2 data available.

```js
import { allChainsData } from 'svelte-web3'

console.log( allChainsData )
```


## Create contract stores

The function `makeContractStore` allows you to create a Svelte derived
store of a `web3.eth.Contract` object instance. It takes the same
parameters as a ̀new web3.eth.Contract` call:

```js
makeContractStore(jsonInterface[, address][, options])
```

This store is conveniently and automatically updated after connection
and when the account or chain change.


## Simultaneous multi chain usage

You can also using the library to create several stores, each
connected to different providers.  For example, you may want a
connection to the same chain througth the browser wallet and
simultaneously with Infura; or many stores each connected to a
different chains at the same time.

In this case, use the `makeChainStore` factory function as below :

```js
  import { makeChainStore } from 'svelte-web3'

  let ethStore, web3, connected, selectedAccount, chainId, chainData
  ({ web3, connected, selectedAccount, chainId, chainData, ...ethStore } = makeChainStore('<id>'))

  ethStore.setProvider('https://rpc.slock.it/goerli')
```

`<id>` can be an arbitrary name to be able to retrieve the store with the function `getChainStore`
without reinitializing the conection:


```js
  import { getChainStore } from 'svelte-web3'

  let ethStore, web3, connected, selectedAccount, chainId, chainData
  ({ web3, connected, selectedAccount, chainId, chainData, ...ethStore } = getChainStore('<id>'))
```

The `web3` store and all other derived stores will work the same way as with the default store.

If you want to use the different chain stores in the same svelte file
(not advised, it's better to use subcomponents), you may renamed the
stores this way :

```js
  let ethStore_A, web3_A, ethStore_B, web3_B

  ({ web3: web3_A, ...ethStore_A } = makeChainStore('<id_A>'))
  ({ web3: web3_B, ...ethStore_B } = makeChainStore('<id_B>'))
```


## Svelte example (based on rollup template)

Please check `examples/svelte-app-template-web3` in github.

Contain both sub-examples to use the default store and multi stores.

## Sapper example (based on webpack template)

Please check `examples/sapper-app-template-web3` in github.
