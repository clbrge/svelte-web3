<script>
  import { makeEvmStores } from 'svelte-web3'

  export let name
  export let provider

  let ethStore, web3, connected, selectedAccount, chainId, chainData
  ({ web3, connected, selectedAccount, chainId, chainData, ...ethStore } = makeEvmStores(name))

  ethStore.setProvider(provider)

</script>

<div class="card">
  <header class="card-header">
    <p class="card-header-title">
      { name } { $connected ? '(connected)' : '(not connected)' }
    </p>
  </header>
  <div class="card-content">
    <div class="content">
      {#if $connected}
      <p>
        chainData = {JSON.stringify($chainData)}
      </p>
      {/if}
    </div>
  </div>
  <footer class="card-footer">
    <p href="#" class="card-footer-item">ChainId  {$chainId || 'pending'} <p/>
  </footer>
</div>
