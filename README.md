---

# svelte-web3

web3.js 1.2.9 as a Svelte store.

## Installation

```bash
npm i svelte-web3
```

## Basic Usage

Import the `ethStore` main connection helper and needed derived Svelte stores (see list below):

```js
import { ethStore, web3, selectedAccount, connected } from 'svelte-web3';
```

To enable connection to the current window provider: 

```js
ethStore.setBrowserProvider()
```

To enable connection using an url string: 

```js
ethStore.setProvider('<ws/https or http provider url>')
```

If connection is successful, you can access the instantiated web3.js with the current window provider
using the `$` svelte store syntax :

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

## Demo/Example

```bash
npm run example
```
