<script>
  import RPC from './RPC.svelte'

</script>

<p>Simple example to create several stores connected to different providers in parallel.</p>

<RPC provider="https://sokol.poa.network" name="Sokol" />

<RPC provider="https://rpc.xdaichain.com/" name="xDai" />
