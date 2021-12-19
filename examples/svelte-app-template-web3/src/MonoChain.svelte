<script>
  import { allChainsData, makeChainStore, defaultChainStore, web3, selectedAccount, connected, chainId, chainData } from 'svelte-web3'

  import { Balance } from 'svelte-web3/components'

  let tipAddress = '0x834356a88C66897FA0A05a61964a91A607956ee3'

  let sokol, sokol_connected, sokol_web3
  ({ connected: sokol_connected, web3: sokol_web3, ...sokol } = makeChainStore('sokol'))

  sokol.setProvider('https://sokol.poa.network')

  const enable = () => defaultChainStore.setProvider('https://sokol.poa.network')
  const enableBrowser = () => defaultChainStore.setBrowserProvider()

  $: checkAccount = $selectedAccount || '0x0000000000000000000000000000000000000000'

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

</script>

<p>
  Simple example to using the default store. You may switch
  the connection to different providers (browser or not) at any time.
</p>

{#if $web3.version}
<div class="buttons">
  <button class="button is-link is-light" on:click="{enable}">connect to https://sokol.poa.network</button>
  <button class="button is-link is-light" on:click="{enableBrowser}">connect to the browser window provider </button> (eg Metamask)
</div>
{/if}

{#if $connected}
<p>
  Connected chain: chainId = {$chainId}
</p>
<p>
  chainData = {JSON.stringify($chainData)}
</p>

<p>
  Selected account: {$selectedAccount || 'not defined'}
</p>

<p>Selected account balance = <Balance address={checkAccount} /> {$chainData.nativeCurrency?.symbol}</p>

{#if $selectedAccount}
<p><button class="button is-primary is-light" on:click="{sendTip}">send 0.01 {$chainData.nativeCurrency?.symbol} tip to {tipAddress} (author)</button></p>
{/if}

{/if}
