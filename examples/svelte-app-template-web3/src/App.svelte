<script>
  import MonoChain from './MonoChain.svelte'
  import MultiChain from './MultiChain.svelte'
  import Web3Modal from './Web3Modal.svelte'

  let name
  let example = MonoChain

  $: metamaskConnected = window.ethereum ? window.ethereum.isConnected() : false

</script>

<section class="section pb-0">
  <div class="container">
    <h1 class="title">
      svelte-web3 usage example with Svelte
    </h1>

    <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

    <p>Visit the <a href="https://web3js.readthedocs.io/en/">Web3.js documentation</a> to learn how to use Web3.js library.</p>

    {#if window.Web3}
    <p>The Web3.js library has been injected in Global window Object (version: {window.Web3.version}).</p>
    {:else}
    <div class="notification is-warning">
      <strong>Error! The Web3.js library has not been detected in the Global window Object.</strong>
      Please check that Web3.js has been correctly added in <em class="is-family-code">public/index.html</em>
      with the line:
      <pre>
      &lt;script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js">&lt;/script>
      </pre>
    </div>
    {/if}
    <p>Browser wallet detected in Global Object window.ethereum : { window.ethereum ? 'yes' : 'no' }</p>
    {#if window.ethereum}
    <p>Browser wallet already connected to metamask : { metamaskConnected }</p>
    {/if}

  </div>
</section>

<section class="section">

  <div class="container">

    <div class="tabs is-toggle is-toggle-rounded">
      <ul>
        <li on:click={() => {example = MonoChain}} class:is-active={/MonoChain/.test(example.toString())}>
          <a>
            <span class="icon is-small"><i class="fas fa-image"></i></span>
            <span>MonoChain</span>
          </a>
        </li>
        <li on:click={() => {example = Web3Modal}}  class:is-active={/Web3Modal/.test(example.toString())}>
          <a>
            <span class="icon is-small"><i class="fas fa-music"></i></span>
            <span>Web3Modal</span>
          </a>
        </li>
        <li on:click={() => {example = MultiChain}}  class:is-active={/MultiChain/.test(example.toString())}>
          <a>
            <span class="icon is-small"><i class="fas fa-music"></i></span>
            <span>MultiChains</span>
          </a>
        </li>
      </ul>
    </div>

    <svelte:component this={example} />

  </div>



</section>
