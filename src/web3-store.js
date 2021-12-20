
import chains from './chains.js'
import { proxied } from 'svelte-proxied-store'
import { derived } from 'svelte/store'

const getGlobalObject = () => {
  if (typeof globalThis !== 'undefined') { return globalThis }
  if (typeof self !== 'undefined') { return self }
  if (typeof window !== 'undefined') { return window }
  if (typeof global !== 'undefined') { return global }
  throw new Error('cannot find the global object')
}

export let Web3 = {}

export const loadWeb3 = () => {
  if (Web3.version) return
  try {
    Web3 = getGlobalObject().Web3 || {}
  } catch (err) {
    console.error('no globalThis.Web3 object')
  }
}

const getWindowEthereum = () => {
  try {
    if (getGlobalObject().ethereum) return getGlobalObject().ethereum
  } catch (err) {
    console.error('no globalThis.ethereum object')
  }
}

export const createStore = () => {

  const { emit, get, subscribe, assign, deleteAll } = proxied()

  const init = () => {
    loadWeb3()
    if (!Web3.version) throw new Error('Cannot find Web3')
    if (getWindowEthereum()) getWindowEthereum().autoRefreshOnNetworkChange = false
    assign({
      connected: false,
      accounts: []
    })
  }

  const setProvider = async (provider, callback) => {
    init()
    const instance = new Web3(provider)
    const chainId = await instance.eth.getChainId()
    // no account with ganache
    const accounts = /127/.test(provider) ? [] : await instance.eth.getAccounts()
    if (callback) {
      instance._provider.removeListener('accountsChanged', () => setProvider(provider, true))
      instance._provider.removeListener('chainChanged', () =>  setProvider(provider, true))
    } else {
      if (instance._provider && instance._provider.on) {
        instance._provider.on('accountsChanged', () => setProvider(provider, true))
        instance._provider.on('chainChanged', () => setProvider(provider, true))
      }
    }
    assign({
      provider,
      providerType: 'String',
      connected: true,
      chainId,
      accounts,
      instance
    })
    emit()
  }

  const setBrowserProvider = async () => {
    init()
    if (!getWindowEthereum()) throw new Error('Please authorize browser extension (Metamask or similar)')
    const res = await getWindowEthereum().request({ method: 'eth_requestAccounts' })
    getWindowEthereum().on('accountsChanged', setBrowserProvider)
    getWindowEthereum().on('chainChanged', setBrowserProvider)
    const instance = new Web3(getWindowEthereum())
    const chainId = await instance.eth.getChainId()
    assign({
      provider: getWindowEthereum(),
      providerType: 'Browser',
      connected: true,
      chainId,
      accounts: res,
      instance
    })
    emit()
  }

  const disconnect = async (provider) => {
    if(provider && provider.disconnect) {
      await provider.disconnect()
    }
    deleteAll()
    assign({
      connected: false,
      accounts: []
    })
    emit()
  }

  return {
    setBrowserProvider,
    setProvider,
    disconnect,
    close: disconnect,
    subscribe,
    get
  }
}

const allStores = {}

const noData = { rpc: [], faucets: [], nativeCurrency: {} }

const getData = id => {
  if (!id || !Web3.utils) return noData
  if (Web3.utils.isHexStrict(id)) id = Web3.utils.hexToNumber(id)
  for (const data of chains) {
    if (data.chainId === id) return data
  }
  return noData
}

export const makeEvmStores = name => {

  const ethStore = allStores[name] = createStore()

  allStores[name].connected = derived(ethStore, $ethStore => $ethStore.connected)
  allStores[name].chainId = derived(ethStore, $ethStore => $ethStore.chainId)
  allStores[name].providerType = derived(ethStore, $ethStore => $ethStore.providerType)
  allStores[name].selectedAccount = derived(
    ethStore,
    $ethStore => {
      if ($ethStore.connected) return $ethStore.accounts.length ? $ethStore.accounts[0] : null
      return null
    }
  )

  allStores[name].walletType = derived(ethStore, $ethStore => {
    if (!$ethStore.provider) return null
    if (typeof $ethStore.provider === 'string') return $ethStore.provider
    if ($ethStore.provider.isMetaMask) return 'MetaMask (or compatible)'
    if ($ethStore.provider.isNiftyWallet) return 'Nifty'
    if ($ethStore.provider.isTrust) return 'Trust'
    return 'Unknown'
  })

  allStores[name].web3 = derived(
    ethStore,
    $ethStore => {
      if (!$ethStore.instance) return { utils: Web3.utils, version: Web3.version }
      return $ethStore.instance
    }
  )

  allStores[name].chainData = derived(
    ethStore,
    $ethStore => $ethStore.chainId ? getData($ethStore.chainId) : {}
  )

  return allStores[name]
}

export const getChainStore = name => {
  if (!allStores[name]) throw new Error(`chain store ${name} does not exist`)
  return allStores[name]
}

export const makeContractStore = (abi, address, defaults = {}) => derived(
  [web3, connected],
  ([$web3, $connected]) => {
    if ($connected && $web3.eth) {
      return new $web3.eth.Contract(abi, address, defaults)
    }
    return null
  }
)

loadWeb3()

export { chains as allChainsData }

export const defaultEvmStores = makeEvmStores('default')

export const connected = allStores.default.connected
export const chainId = allStores.default.chainId
export const providerType = allStores.default.providerType
export const selectedAccount = allStores.default.selectedAccount
export const walletType = allStores.default.walletType
export const web3 = allStores.default.web3
export const chainData = allStores.default.chainData

// legacy naming

export const defaultChainStore = defaultEvmStores
