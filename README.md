---

# svelte-web3

web3.js as a Svelte store.

## Installation

```bash
npm i svelte-web3
```

## Basic Usage

Import the `ethereum` main helper and needed derived Svelte stores (see list below):

```js
import { ethereum, web3, selectedAccount, isListening } from 'svelte-ethereum';
```

To enable connection to the current window provider: 

```js
ethereum.setBrowserProvider()
```

If connection is successful, you can access the instantiated web3.js with the current window provider
using the `$` svelte store syntax :

```js
$web3.eth.getBalance(<Ethereum address>)
```

## Derived stores

* chainId: The current blokchain Id.
* chainName: Name of the The current blokchain.
* isListening: true if connection to the provider was successful.
* selectedAccount: current selected account.

Svelte stores are automatically updated when network or selected account change.

Please see the file `example/App.svelte` for more usage information.

## Demo/Example

```bash
npm run example
```
