<script>

  import { onMount } from 'svelte'

  import { defaultEvmStores as evm, connected, web3, evmProviderType, selectedAccount, chainId, chainData } from 'svelte-web3'

  let type
  let pending = false

  const connect = async () => {
    pending = true
    try {
      const handler = {
        Browser: () => evm.setProvider(),
        Localhost: () => evm.setProvider('http://127.0.0.1:8545'),
        Localhost4: () => evm.setProvider('http://127.0.0.1:8545', 4),
        LocalhostNull: () => evm.setProvider('http://127.0.0.1:8545', null),
        Gnosis: () => evm.setProvider('https://rpc.gnosischain.com'),
        Goerli: () => evm.setProvider('https://rpc.goerli.mudit.blog/'),
        Arbitrum: () => evm.setProvider('https://arb1.arbitrum.io/rpc'),
      }
      console.log('[example]', type, handler[type])
      await handler[type]()
      pending = false

    } catch(e) {
      console.log(e)
      pending = false
    }
  }

  const disconnect = async () => {
    await evm.disconnect()
    pending = false
  }

</script>


<div class="content">

  <h1>svelte-web3</h1>

  <h2>using setProvider()</h2>

  {#if !$connected}

  <p>
    Before using any stores, you need to establish a connection to an EVM blockchain.
    Here are a few examples to connect to the provider, RPC or others providers.
    Check the code and the README to learn more.
  </p>

  <p>Choose the provider:</p>

  <button class="button" disabled={pending} on:click={connect}>Connect with</button>

  <select bind:value={type}>
    <option value="Browser">Browser (window.ethereum)</option>
    <option value="Localhost">Localhost (eg ganache or hardhat on http://127.0.0.1:8545)</option>
    <option value="Localhost4">Localhost using account index 4</option>
    <option value="Goerli">https://rpc.goerli.mudit.blog (RPC)</option>
    <option value="Gnosis">https://rpc.gnosischain.com (RPC)</option>
    <option value="Arbitrum">https://arb1.arbitrum.io/rpc (RPC)</option>
  </select>

  {#if pending}connecting...{/if}

  {:else}

  <p>
   You are now connected to the blockchain (account {$selectedAccount})
  </p>

  <button class="button" on:click={disconnect}> Disconnect </button>

  <p>Use the stores in your HTML to get responsive value of evm connection</p>

  <h2>Current stores values:</h2>

  <ul>
    <li>$connected: {$connected}</li>
    <li>$chainId: {$chainId}</li>
    <li>$evmProviderType: {$evmProviderType}</li>
    <li>$selectedAccount: {$selectedAccount}</li>
    <li>$chainData.name: {$chainData.name}</li>
  </ul>


  {/if}

</div>

<style>

  select {
    margin-top: 1em;
    padding: 0.5em;
    font-size: 80%;
  }


  ul li {
    list-style: none;
    text-align: left;
  }

  ul li:before {
    content: "=> ";
  }

</style>
