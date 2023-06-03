<script>

  import { defaultEvmStores as evm, connected, chainId, chainData, contracts } from 'svelte-web3'

  import IERC20 from '@openzeppelin/contracts/build/contracts/IERC20.json'

  const LINKTOKEN_ADDRESS_ON_GOERLI = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'

  evm.attachContract('link', LINKTOKEN_ADDRESS_ON_GOERLI, IERC20.abi)

</script>


<div class="content">

  <h1>svelte-web3</h1>

  <h2>using the '$contracts' store</h2>

  <p>
    The following code initialize the $contracts store with the ERC20 LINK Token.
    Here we use the #await svelte block to load the token totalSupply of the contract
  </p>

  <pre><code>
  const LINKTOKEN_ADDRESS_ON_GOERLI = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'

  evm.attachContract('link', LINKTOKEN_ADDRESS_ON_GOERLI, IERC20.abi)
  </code></pre>


  {#if $connected }

    {#if $chainId !== 5 }

      <p>
        Your are connected to the wrong network ("{$chainData.name}")". Please
        connect to the testnet Görli for the $contract store demo
      </p>

    {:else if $contracts.link}

      {#await $contracts.link.methods.totalSupply().call() }
        <span>waiting for $contracts.link.methods.totalSupply().call() Promise...</span>
      {:then supply}
        <p>We have the result of $contracts.link.methods.totalSupply().call() :</p>
        <p>ERC20 LINK contract has a supply of {supply} tokens on Görli.</p>
      {/await}

    {/if}

  {:else}

    <p>
      Please first <a href="/web3/set">connect</a>
      connect to the görli network to be able to use this page.
    </p>

  {/if}

</div>
