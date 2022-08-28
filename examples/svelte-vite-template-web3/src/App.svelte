<script>
  import svelteLogo from './assets/svelte.svg'
  import ethereumLogo from '../public/ethereum.svg'
  import Counter from './lib/Counter.svelte'

  import Providers from './Providers.svelte'

  $: route = window.location.pathname




</script>

<main>

  {#if /setprovider/.test(route)}

    <Providers />

  {:else if /setprovidex/.test(route)}

    <Providers />

  {:else}

  <div>
    <a href="https://vitejs.dev" target="_blank"> 
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank"> 
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
    <a href="https://web3js.readthedocs.io/" target="_blank">
      <img src={ethereumLogo} class="logo ethereum" alt="Ethereum Logo" />
    </a>
  </div>
  <h1>Vite + Svelte + web3.js</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out the <a href="https://www.npmjs.com/package/svelte-web3" target="_blank">svelte-web3</a>, documentation!
  </p>

  <p>
    Before using the svelte-web3 stores, you need to connect to a provider: <a href="/setprovider">here are a few examples</a>...
  </p>

  <p class="read-the-docs">
    Click on the Vite, Svelte and web3.js/Ethereum logos to learn more
  </p>

  {/if}

</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .logo.ethereum:hover {
    filter: drop-shadow(0 0 2em #343434aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
