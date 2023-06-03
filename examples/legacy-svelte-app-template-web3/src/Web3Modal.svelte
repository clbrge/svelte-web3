<script>
  import { defaultEvmStores, web3, selectedAccount, walletType, connected, chainId, chainData } from 'svelte-web3'
  import { Balance } from 'svelte-web3/components'

  const Web3Modal = window.Web3Modal.default
  const WalletConnectProvider = window.WalletConnectProvider.default

  const disable = () => defaultEvmStores.disconnect()

  let infuraId
  let web3Modal
  const enable = async () => {
    if (web3Modal) web3Modal.clearCachedProvider()
    web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: { infuraId }
        }
      },
      disableInjectedProvider: false,
    })
    const provider = await web3Modal.connect()
    defaultEvmStores.setProvider(provider)
  }

  $: checkAccount = $selectedAccount


  const debug = async () => {

    console.log('$web3.eth.getChainId', await $web3.eth.getChainId())

  }


  $: if ($connected && $web3) debug()


</script>

<p class="subtitle">
  Simple example to using the <a href="https://web3modal.com/">Web3Modal</a> library to connect the default store.
</p>

<div class="field">
  <div class="control">
    <input class="input p-4" type="text" placeholder="InfuraId (to use walletconnect)"  bind:value={infuraId}>
  </div>
</div>


{#if $web3.version}
<div class="buttons">
  <button class="button is-link is-light" on:click="{enable}">connect using Web3Modal</button>
</div>
{/if}

{#if $web3.version}
<div class="buttons">
  <button class="button is-link is-light" on:click="{disable}">disconnect</button>
</div>
{/if}


{#if $connected}

<p>
  Connected chain: chainId = {$chainId}
</p>
<p>
  Selected account: {$selectedAccount || 'not defined'}
</p>

<p>
  Wallet type: {$walletType || 'not defined'}
</p>
<p>
  chainData = {JSON.stringify($chainData)}
</p>


<p>Selected account balance = <Balance address={checkAccount} /> {$chainData.nativeCurrency?.symbol}</p>

{/if}
