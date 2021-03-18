
import { derived, writable } from 'svelte/store'

import chains from './chains.js'

const getGlobalObject = () => {
  if (typeof globalThis !== 'undefined') { return globalThis }
  if (typeof self !== 'undefined') { return self }
  if (typeof window !== 'undefined') { return window }
  if (typeof global !== 'undefined') { return global }
  throw new Error('cannot find the global object')
}

let Web3 = {}

export const loadWeb3 = () => {
  if (Web3.version) return
  try {
    Web3 = getGlobalObject().Web3 || {}
  } catch (err) {
    console.error('no globalThis.Web3 object')
  }
}

export const getWindowEthereum = () => {
  try {
    if (getGlobalObject().ethereum) return getGlobalObject().ethereum
  } catch (err) {
    console.error('no globalThis.ethereum object')
  }
}

const chain = id => {
  if (!id || !Web3.utils) return {}
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

  const init = () => {
    loadWeb3()
    if (!Web3.version) throw new Error('Cannot find Web3')
    if (getWindowEthereum()) getWindowEthereum().autoRefreshOnNetworkChange = false
  }

  const setProvider = async provider => {
    init()
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

  const setBrowserProvider = async () => {
    init()
    if (!getWindowEthereum()) throw new Error('Please autorized browser extension (Metamask or similar)')
    const res = await getWindowEthereum().request({ method: 'eth_requestAccounts' })
    getWindowEthereum().on('accountsChanged', setBrowserProvider)
    getWindowEthereum().on('chainChanged', setBrowserProvider)
    set({
      provider: getWindowEthereum(),
      providerType: 'Browser',
      connected: true,
      chainId: getWindowEthereum().chainId,
      accounts: res,
      instance: new Web3(getWindowEthereum())
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

loadWeb3()
