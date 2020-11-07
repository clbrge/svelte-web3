
// rollup fails to bundle current source web3
// import Web3 from 'web3'
import Web3 from 'web3/dist/web3.js'

import { derived, writable } from 'svelte/store'

import chains from './chains.json'

const chain = id => {
  if (!id) return {}
  if (Web3.utils.isHexStrict(id)) id = Web3.utils.hexToNumber(id)
  for (const def of chains) {
    if (def.chainId === id) return def
  }
  return {}
}

export const createStore = () => {
  const { subscribe, set } = writable({
    connected: false,
    accounts: []
  })

  const setProvider = async provider => {
    const instance = new Web3(provider)
    const chainId = await instance.eth.getChainId()
    set({
      provider,
      providerType: 'String',
      connected: true,
      chainId,
      accounts: [null],
      instance,
    })
  }

  if (window.ethereum) window.ethereum.autoRefreshOnNetworkChange = false

  const setBrowserProvider = async () => {
    if (!window.ethereum) throw new Error('Please autorized browser extension (Metamask or similar)')
    const res = await window.ethereum.request({ method: 'eth_requestAccounts' })
    window.ethereum.on('accountsChanged', setBrowserProvider)
    window.ethereum.on('chainChanged', setBrowserProvider)
    set({
      provider: window.ethereum,
      providerType: 'Browser',
      connected: true,
      chainId: window.ethereum.chainId,
      accounts: res,
      instance: new Web3(window.ethereum)
    })
  }

  return {
    setBrowserProvider,
    setProvider,
    subscribe
  }

}

export const ethStore = createStore()

export const connected = derived(ethStore, $ethStore => $ethStore.connected)

export const selectedAccount = derived(
  ethStore,
  $ethStore => $ethStore.accounts.length ? $ethStore.accounts[0] : null
)

export const providerType = derived(ethStore, $ethStore => $ethStore.providerType)
export const chainId = derived(ethStore, $ethStore => $ethStore.chainId)

export const chainName = derived(ethStore, $ethStore => chain($ethStore.chainId).name)
export const nativeCurrency = derived(ethStore, $ethStore => chain($ethStore.chainId).nativeCurrency)

export const walletType = derived(ethStore, $ethStore => {
  if (!$ethStore.provider) return null
  if (typeof $ethStore.provider === 'string') return $ethStore.provider
  if ($ethStore.provider.isMetaMask) return 'MetaMask (or compatible)'
  if ($ethStore.provider.isNiftyWallet) return 'Nifty'
  if ($ethStore.provider.isTrust) return 'Trust'
  return 'Unknown'
});

export const web3 = derived(
  ethStore,
  $ethStore => {
    if (!$ethStore.instance) return { utils: Web3.utils, version: Web3.version }
    return $ethStore.instance
  }
)
