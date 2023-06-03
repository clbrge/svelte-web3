<script>
  import { selectedAccount } from '../stores'

  import makeBlockie from 'ethereum-blockies-base64'

  export let address = $selectedAccount
  let importedClasses = ''
  export { importedClasses as class }

  let img

  $: if (address && img) {
    img.src = makeBlockie(address)
  }

</script>

<img bind:this={img} class={importedClasses}>

<style>

img {
  display: block;
  height: auto;
  width: 100%;
}

</style>
