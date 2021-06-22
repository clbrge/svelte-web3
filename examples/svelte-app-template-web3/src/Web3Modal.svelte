<script>
  import { defaultChainStore, web3, connected, selectedAccount, chainId, chainData } from '../../../dist/index.js'
  //import { defaultChainStore, web3, selectedAccount, connected, chainId, chainData } from 'svelte-web3'

  export let name

  const Web3Modal = window.Web3Modal.default
  const WalletConnectProvider = window.WalletConnectProvider.default

  const enable = async () => {
    let web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: '27e484dcd9e3efcfd25a83a78777cdf1'
          }
        }
      },
      disableInjectedProvider: false,
    })
    const provider = await web3Modal.connect()
    defaultChainStore.setProvider(provider)
  }

  $: checkAccount = $selectedAccount || '0x0000000000000000000000000000000000000000'
  $: balance = $connected ? $web3.eth.getBalance(checkAccount) : ''

</script>

<p>
  Simple example to using the <a href="https://web3modal.com/">Web3Modal</a> library to connect the default store.
</p>

{#if $web3.version}
<div class="buttons">
  <button class="button is-link is-light" on:click="{enable}">connect using Web3Modal</button>
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

<p>
  {checkAccount} Balance on {$chainData.name}:
    {#await balance}
  <span>waiting...</span>
  {:then value}
  <span>{value}</span>
  {/await} {$chainData.nativeCurrency?.symbol}
</p>


{/if}
