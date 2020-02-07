<script>

import { ethereum, web3, chainName, isListening, nativeCurrency, selectedAccount, whenReady } from '../dist/index.mjs'

export let name
export let tipAddres

const enable = () => ethereum.setBrowserProvider()

$: balance = whenReady($selectedAccount, a => $web3.eth.getBalance(a))

const sendTip = async (e) => {
  console.log('Received move event (sendTip button)', e)
  const tx = await $web3.eth.sendTransaction({
    gasPrice: $web3.utils.toHex($web3.utils.toWei('5', 'gwei')),
    gasLimit: $web3.utils.toHex('21000'),
    from: $selectedAccount,
    to: tipAddres,
    value: $web3.utils.toHex($web3.utils.toWei('1', 'finney'))
  })
  console.log('Receipt from sendTip transaction', tx)
  alert('Thanks!')
}

</script>

<main>

  <h1>Hello {name}!</h1>

  <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

  <p>Visit the <a href="https://web3js.readthedocs.io/en/">Web3.js documentation</a> to learn how to use Web3.js library.</p>

  <p><button on:click="{enable}">connect</button> this svelte example app to the window provider (eg Metamask) :

  </p>

  {#if $isListening}
  <p>
    Selected account: {$selectedAccount || 'not connected'}
  </p>
  <p>
    Balance on {$chainName}:
    {#await balance}<span>waiting...</span>{:then value}<span>{$web3.utils.fromWei(value)}</span>{/await} {$nativeCurrency.symbol}
  </p>
  <p><button on:click="{sendTip}">send 0.01 {$nativeCurrency.symbol} tip to {tipAddres} (author)</button></p>
  {/if}

</main>

<style>

main {
  text-align: center;
  padding: 1em;
  max-width: 240px;
  margin: 0 auto;
}

h1 {
  color: #ff3e00;
  text-transform: uppercase;
  font-size: 4em;
  font-weight: 100;
}

@media (min-width: 640px) {
  main {
	max-width: none;
  }
}

</style>
