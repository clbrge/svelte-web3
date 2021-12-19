<script>
  import { web3, connected } from 'svelte-web3'

  export let address
  export let pending = 'pending'
  // todo format + symbol

  $: balance = $connected && address ? $web3.eth.getBalance(address) : ''

</script>

{#if address}{#await balance}{pending}{:then value}{value}{/await}{/if}
