<script>
  import {
    allChainsData,
    makeEvmStores,
    defaultEvmStores,
    web3,
    selectedAccount,
    connected,
    chainId,
    chainData } from 'svelte-web3'

  import DAI from './contract-stores.js'

  import { Balance } from 'svelte-web3/components'

  let tipAddress = '0x834356a88C66897FA0A05a61964a91A607956ee3'

  //const enable = () => defaultEvmStores.setProvider('https://sokol.poa.network')
  //const enableBrowser = () => defaultEvmStores.setBrowserProvider()

  const sendTip = async (e) => {
    console.log('Received move event (sendTip button)', e)
    const tx = await $web3.eth.sendTransaction({
      // gasPrice: $web3.utils.toHex($web3.utils.toWei('30', 'gwei')),
      gasLimit: $web3.utils.toHex('21000'),
      from: $selectedAccount,
      to: tipAddress,
      value: $web3.utils.toHex($web3.utils.toWei('1', 'finney'))
    })
    console.log('Receipt from sendTip transaction', tx)
    alert('Thanks!')
  }

  let type
  let pending = false

  const connect = async () => {
    pending = true
    try {
      const handler = {
        Browser: () => defaultEvmStores.setProvider(),
        Localhost: () => defaultEvmStores.setProvider('http://127.0.0.1:8545'),
        Localhost4: () => defaultEvmStores.setProvider('http://127.0.0.1:8545', 4),
        DAI: () => defaultEvmStores.setProvider('https://rpc.xdaichain.com/'),
        Sokol: () => defaultEvmStores.setProvider('https://sokol.poa.network'),
      }
      await handler[type]()
      console.log('$connected', defaultEvmStores.$connected  )
      console.log('$selectedAccount', defaultEvmStores.$selectedAccount )
      console.log('$web3', defaultEvmStores.$web3  )
      pending = false
    } catch(e) {
      console.log(e)
      pending = false
    }
  }

  const disconnect = async () => {

    console.log( await $DAI.methods.totalSupply().call() )

    await defaultEvmStores.disconnect()
    pending = false
  }


  $: DAISupply = $DAI ? $DAI.methods.totalSupply().call() : ''

</script>

<p class="subtitle">
  Simple example to using the default store. You may switch
  the connection to different providers (browser or not) at any time.
</p>

{#if $web3.version}

<p>Choose the provider:</p>
<button class="button is-link is-light" disabled={pending} on:click={connect}>Connect with {type}</button>
<select bind:value={type}>
  <option value="Browser">Browser (window.ethereum)</option>
  <option value="Localhost">Localhost (eg ganache or hardhat on http://127.0.0.1:8545)</option>
  <option value="Localhost4">Localhost using account index 4</option>
  <option value="DAI">https://rpc.xdaichain.com/ (RPC)</option>
  <option value="Sokol">https://sokol.poa.network (RPC)</option>
</select>

{/if}

{#if $connected}

<button class="button is-link is-warn" on:click={disconnect}> Disconnect </button>

<p>
  Connected chain: chainId = {$chainId}
</p>
<p>
  chainData = {JSON.stringify($chainData)}
</p>

<p>
  Selected account: {$selectedAccount || 'no account'}
</p>

<p>Selected account balance = <Balance address={$selectedAccount} /> {$chainData.nativeCurrency?.symbol}</p>

{#if $selectedAccount}
<p><button class="button is-primary is-light" on:click="{sendTip}">send 0.01 {$chainData.nativeCurrency?.symbol} tip to {tipAddress} (author)</button></p>
{/if}

{#await DAISupply}
   pending contract definition
{:then value}
  {value}
{/await}


{/if}
