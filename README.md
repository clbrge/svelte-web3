
# svelte-web3

Use the [web3.js library](https://web3js.readthedocs.io/) as a
collection of [readable svelte stores](https://svelte.dev/tutorial/readable-stores)
for Svelte, Sapper or Sveltekit.

If you prefer to use the [ethers.js
library](https://docs.ethers.io/v5/) to intereact with EVM, you may be
interested by our sister package
[svelte-ethers-store](https://www.npmjs.com/package/svelte-ethers-store).

### Community

For additional help or discussion, join us [in our
Discord](https://discord.gg/7yXuwDwaHF).

## Installation

1. add the `svelte-web3` package

```bash
npm i svelte-web3
```

2. add the web3.js library in the main HTML page (`public/index.html` in Svelte, `src/template.html` in Sapper or `src/app.html` in SvelteKit)

```html
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
```

This step is necessary for now because the Web3.js doesn't play well with bundlers (webpack,
vite, snowpack, etc), thus we cannot simply add a dependency in package.json.


## Basic usage (default stores connected to one chain)

## Derived stores

This library is creating automatically a set of readable Svelte stores
that are automatically updated when a new connection happens, or when
the chain or the selected account change. You can import them directly
in any svelte or JavaScript files :

```js
import { connected, web3, selectedAccount, chainId, chainData } from 'svelte-web3'
```

 * connected: store value is true a connection has been set up.
 * web3: store value is an Web3.js instance if connected.
 * selectedAccount: store value is the current selected account (if connected).
 * chainId: store value is the current chainId if connected.
 * chainData: store value is the current blokchain CAIP-2 data (if connected), see below.

For these stores to be useful in your svelte application, you first need to connect to the blockchain.

The main connection helper `defaultEvmStores` can be use to initiate a connection.

```js
import { defaultEvmStores } from 'svelte-web3'
```

### Connection with the browser provider (wallets like metamask)

To enable a connection with the current window provider: 

```js
defaultEvmStores.setBrowserProvider()
```

Please note that your code need to be in browser context when
`setBrowserProvider` is running. So you may want to use `onMount` when
using Sapper or Sveltekit. Similarly, you cannot use
`setBrowserProvider` in SSR context.

```js
  onMount(
    () => {
      // add a test to return in SSR context
      defaultEvmStores.setBrowserProvider()
    }
  )
```

:exclamation: `defaultEvmStores` was named before `defaultChainStore`. The
former naming still works but will be removed in later versions of
`svelte-web3` package. Please update your code!


### Connection with other providers (ws, http, Web3Modal, Walletconnect, etc)

To enable connection using an url string or a valid provider object
(as returned by web3Modal or WalletConnect for example):

```js
defaultEvmStores.setProvider(<ws/https or http provider url or provider Object>)
```

Please check `examples/svelte-app-template-web3/src/Web3Modal.svelte` in github.


### Using the connection Web3 API 

After a connection has been established, you may import the default
`web3` store anywhere in your application to use Web3.js API. Use the
`$` prefix svelte notation to access its value and call Web3.js functions.

```js
  import { web3, selectedAccount } from 'svelte-web3'

  ...

  const { name, chainId } = await $web3.eth.getChainId()

  const balance = await $web3.eth.getBalance('0x0000000000000000000000000000000000000000') : ''
```

The whole Web3.js API is usable in the `<script>` section of your
svelte files if you always use notation `$web3` (beware, `web3` is the
default notation in web3.js library documentation but in our context,
it's the Svelte store itself, not it's value, the instantiated
library).


### Forcing a disconnect (and the remove all listeners)

Simply call the function `disconnect` directly on the store. For example with the default store:

```js
defaultEvmStores.disconnect()
```

## Web3 Svelte component [ experimental ]


We plan to export generic Svelte components both to demonstrate the use
of the svelte-web3 library and as resuable and composable best practices
components. Only a `Balance` component has been implemented for now. You
are welcome to help define and develop new components by joining our
discussions in our [Discord](https://discord.gg/7yXuwDwaHF).


```html
  import { Balance } from 'svelte-web3/components'
</script>

<p>balance = <Balance address="0x0000000000000000000000000000000000000000" />

```


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

## Examples

If you are using `svelte-web3` to build an open source Dapp, let us know
if you want to be listed in this section.

### Svelte basic example (based on rollup template)

Please check `examples/svelte-app-template-web3` in github.

Contain both sub-examples to use the default store and multi stores.

### Sapper basic example (based on webpack template)

Please check `examples/sapper-app-template-web3` in github.


### tradingstrategy.ai presented at EthLisbon 2021

A website presented in EthLisbon 2021, used svelte-web3 (version 2) for building the frontend. :

* The page is live here: https://tradingstrategy.ai/strategy/ethlisbon
* Source code : https://github.com/tradingstrategy-ai/frontend/blob/master/src/lib/web3/Investor.svelte

