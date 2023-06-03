<script>
  import { web3, connected, selectedAccount } from '../stores'

  export let address // = $selectedAccount
  export let pending = 'pending'
  // todo format + symbol

  $: balance = $web3 && $web3.eth && address ? $web3.eth.getBalance(address) : ''

</script>

{#if address}{#await balance}{pending}{:then value}{value}{/await}{/if}
