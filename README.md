
# svelte-web3

Use the [web3.js library](https://web3js.readthedocs.io/) as a
collection of [readable Svelte stores](https://svelte.dev/tutorial/readable-stores)
for Svelte, Sapper or SvelteKit.

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

This step is necessary for now because the Web3.js library doesn't
play well with bundlers (webpack, vite, snowpack, etc), thus we cannot
simply add a dependency in package.json.


## Basic usage (default stores connected to one chain)

### Derived stores

This library creates a set of readable Svelte stores that are
automatically updated when a new connection happens, or when the chain
or the selected account change. You can import them directly in any
Svelte or JavaScript files :

```js
import { connected, web3, selectedAccount, chainId, chainData } from 'svelte-web3'
```

 * connected: store value is true if a connection has been set up.
 * web3: store value is a Web3.js instance when connected.
 * selectedAccount: store value is the current selected account (when connected).
 * chainId: store value is the current chainId when connected.
 * chainData: store value is the current blokchain CAIP-2 data (when connected), see below.

For these stores to be useful in your Svelte application, a connection to an EVM
blockchain first need to established . The abstract helper
`defaultEvmStores` can be used to initiate the connection and automatically
instanciate all stores.

```js
import { defaultEvmStores } from 'svelte-web3'
```

:exclamation: `defaultEvmStores` was named before `defaultChainStore`. The
former naming still works but will be removed in later versions of
`svelte-web3` package. Please update your code!

### Connection with the browser provider (eg wallets like Metamask)

To enable a connection with the current [EIP-1193
provider](https://eips.ethereum.org/EIPS/eip-1193#appendix-i-consumer-facing-api-documentation)
injected in the browser `window` context, simply call `setProvider` on
the library abstract helper with no argument:

```js
defaultEvmStores.setProvider()
```

Please note that `setProvider` can only to be called with no argument
in a browser context. So you may want to use `onMount` when using
Sapper or SvelteKit. Similarly, you cannot use `setProvider` with no
argument in SSR context.

```js
  onMount(
    () => {
      // add a test to return in SSR context
      defaultEvmStores.setProvider()
    }
  )
```

`svelte-web3` will automatically update the stores when the network or
accounts change and remove listeners at disconnection.

:exclamation: previous version of `svelte-web3` were using a special
method `setBrowserProvider`. The former naming still works but will be
removed in later versions. Please update your code!


### Connection with non injected EIP-1193 providers

To connect to non injected EIP-1193 providers like :

 * buidler.dev
 * ethers.js
 * eth-provider
 * WalletConnect
 * Web3Modal

Call `setProvider` on the library abstract helper with the js provider
instance object of the library. For example with Web3Modal :

```js
const web3Modal = new Web3Modal(<your config>)
const provider = await web3Modal.connect()
defaultEvmStores.setProvider(provider)
```

`svelte-web3` will automatically update the stores when the network or
accounts change and remove listeners at disconnection.

Please check
 `examples/svelte-app-template-web3/src/Web3Modal.svelte`(https://github.com/clbrge/svelte-web3/tree/master/examples/svelte-app-template-web3/src/Web3Modal.svelte).
 in github for a complete example.

### Connection with other Web3 providers (ws, http, ipc, ...)

Any provider supported by Web3.js can also be used with `setProvider`.
A WS or HTTP RPC string URL or any providers returned by `new
Web3.providers`, for example :

```js
defaultEvmStores.setProvider('https://rinkeby.infura.io/v3/your-api-key')
// or 
defaultEvmStores.setProvider('https://eth-mainnet.alchemyapi.io/v2/your-api-key')
// or 
defaultEvmStores.setProvider('http://localhost:8545')
// or 
defaultEvmStores.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'))
// or 
var net = require('net')
defaultEvmStores.setProvider(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net))
// etc...
```

### Using the stores

After a connection has been established, you may import the stores
anywhere in your application. Most of the time, you should use the `$`
prefix Svelte notation to access the stores values.


```html
<script>

  import { connected, chainId } from 'svelte-web3'

</script>

{#if !$connected}

<p>My application is not yet connected</p>

{:else}

<p>Connected to chain with id {$chainId}</p>

{/if}
```

### Using the Web3 API

Likewise use the `$` prefix Svelte notation to access its instance and
use the full Web3.js API. (beware, in the Web3.js library
documentation, instances are always noted as `web3`, without `$`, but
in the context of `svelte-web3`, `web3` is the Svelte store itself,
not it's value).

```js
  import { web3, selectedAccount } from 'svelte-web3'

  // ...

  const { name, chainId } = await $web3.eth.getChainId()

  const balance = await $web3.eth.getBalance('0x0000000000000000000000000000000000000000') : ''
```

### Reading stores outside of Svelte files

The `$` prefix Svelte notation to access store values is only
available inside Svelte files. To directly access the instantiated
values in pure javascript library without subscribing to the store,
you can use a special getter on the library abstract helper:

```js
// this is not a Svelte file but a standard JavaScript file 
import { defaultEvmStores } from 'svelte-web3'

if (defaultEvmStores.$selectedAccount) {

  // do something if store selectedAccount is non null

}
```

### Forcing a disconnect (and removing all listeners)

Simply call the function `disconnect` directly on the on the library
abstract helper:

```js
defaultEvmStores.disconnect()
```

## Human readable chain CAIP-2 information

`chainData` is a store returning the current JavaScript [CAIP-2 representation](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md) object.

### Example

The information returned by the `chainData` store depends (like all
other web3 stores) on which chain the current provider is
connected. If the store has not yet been connected (with
`setProvider`), the store value will be `undefined`.

This object is extremely useful to build components that reactively
update all variables elements that depends on the current active chain
or account.

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

This store is also conveniently and automatically updated after
connection and when the account or chain change.


## Web3 Svelte component [ experimental ]


We plan to export generic Svelte components both to demonstrate the use
of the svelte-web3 library and as resuable and composable best practices
components. Only a `Balance` component has been implemented for now. You
are welcome to help define and develop new components by joining our
discussions in our [Discord](https://discord.gg/7yXuwDwaHF).


```html
  import { Balance } from 'svelte-web3/components'
</script>

<p>balance = <Balance address="0x0000000000000000000000000000000000000000" /></p>

```

## Simultaneous multi chain usage

You can also using the library to create several stores, each
connected to different providers.  For example, you may want a
connection to the same chain througth the browser wallet and
simultaneously with Infura; or many stores each connected to a
different chains at the same time.

In this case, use the `makeEvmStores` factory function as below :

```js
  import { makeEvmStores } from 'svelte-web3'

  let evmStores, web3, connected, selectedAccount, chainId, chainData
  ({ web3, connected, selectedAccount, chainId, chainData, ...evmStores } = makeEvmStores('<id>'))

  evmStores.setProvider('https://rpc.slock.it/goerli')
```

`<id>` can be an arbitrary name to be able to retrieve the store with the function `getChainStore`
without reinitializing the conection:


```js
  import { getChainStore } from 'svelte-web3'

  let evmStores, web3, connected, selectedAccount, chainId, chainData
  ({ web3, connected, selectedAccount, chainId, chainData, ...evmStores } = getChainStore('<id>'))
```

The `web3` store and all other derived stores will work the same way as with the default store.

If you want to use the different chain stores in the same Svelte file
(not advised, it's better to use subcomponents), you may renamed the
stores this way :

```js
  let evmStores_A, web3_A, evmStores_B, web3_B

  ({ web3: web3_A, ...evmStores_A } = makeEvmStores('<id_A>'))
  ({ web3: web3_B, ...evmStores_B } = makeEvmStores('<id_B>'))
```

## Examples

If you are using `svelte-web3` to build an open source Dapp, let us know
if you want to be listed in this section.


### Svelte basic example (based on rollup template)

Please check [`examples/svelte-app-template-web3` in github](https://github.com/clbrge/svelte-web3/tree/master/examples/svelte-app-template-web3).

Contains demos to use the default store and multi stores.

### SvelteKit basic example

Please check [`examples/sveltekit-app-template-web3` in github](https://github.com/clbrge/svelte-web3/tree/master/examples/sveltekit-app-template-web3).

### Sapper basic example (based on webpack template)

Please check [`examples/sapper-app-template-web3` in github](https://github.com/clbrge/svelte-web3/tree/master/examples/sapper-app-template-web3).

Please check `examples/sapper-app-template-web3` in github.

### tradingstrategy.ai presented at EthLisbon 2021

A website presented in EthLisbon 2021, used svelte-web3 (version 2) for building the frontend. :

* The page is live here: https://tradingstrategy.ai/strategy/ethlisbon
* Source code : https://github.com/tradingstrategy-ai/frontend/blob/master/src/lib/web3/Investor.svelte

