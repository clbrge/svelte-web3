<script>

  import { connected, chainId, selectedAccount }  from 'svelte-web3'

  import { Balance, Identicon, Jazzicon } from 'svelte-web3/components'

  import Highlight from 'svelte-highlight'
  import { xml } from "svelte-highlight/languages"

  import lightfair from "svelte-highlight/styles/lightfair"

</script>

<svelte:head>
  {@html lightfair}
</svelte:head>


<div class="content">

  <h1>ethers-svelte</h1>

  <h2>using Components</h2>

  {#if $connected }

    <Highlight language={xml} code={'\n<Balance address={$selectedAccount} />\n\n'} />

    Balance of {$selectedAccount} : <Balance address={$selectedAccount} />

    <hr />

    <Highlight language={xml} code={'\n<Identicon address={$selectedAccount} class="whatever" />\n\n'} />

    Identicon of {$selectedAccount} :
    <figure class="identicon">
      <Identicon address={$selectedAccount} class="whatever"  />
    </figure>

    <hr />

    <Highlight language={xml} code={'\n<Jazzicon address={$selectedAccount} class="whatever" />\n\n'} />

    Jazzicon of {$selectedAccount} : <Jazzicon address={$selectedAccount} class="whatever" />

  {:else}

    <p>
      Please first <a href="/web3/set">connect</a>
      connect to the Rinkeby network to be able to use this page
    </p>

  {/if}

</div>

<style>
  .content {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
  }

  .identicon {
    display: inline-block;
    height: 32px;
    width: 32px;
  }

  hr {
    margin-top: 2em;
  }
</style>
