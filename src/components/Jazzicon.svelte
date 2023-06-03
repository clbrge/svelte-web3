<script>
  import { selectedAccount } from '../stores'

  import jazzicon from '@metamask/jazzicon'

  export let address = $selectedAccount
  export let size = 32
  let importedClasses = ''
  export { importedClasses as class }

  let target

  $: if (address && size && target) {
    const seed = parseInt(address.toLowerCase().slice(2, 10), 16)
    const el = jazzicon(size, seed)
    if (importedClasses) el.setAttribute('class', importedClasses)
    target.parentNode.replaceChild(el, target)
    target = el
  }

</script>

<div bind:this={target} />
