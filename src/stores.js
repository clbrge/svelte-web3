
import { proxied } from 'svelte-proxied-store'
import { derived } from 'svelte/store'

import chains from './chains.js'

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
    if (!Web3.version) throw new Error('[svelte-web3] Cannot find Web3')
    if (getWindowEthereum()) getWindowEthereum().autoRefreshOnNetworkChange = false
    deleteAll()
    assign({
      connected: false,
      evmProviderType: '',
      accounts: []
    })
  }

  const setProvider = async (evmProvider, callback) => {
    init()
    const web3 = new Web3(evmProvider)
    const chainId = await web3.eth.getChainId()
    // no account with ganache use try catch ?
    const accounts = /127/.test(evmProvider) ? [] : await web3.eth.getAccounts()
    if (callback) {
      web3._provider.removeListener('accountsChanged', () => setProvider(evmProvider, true))
      web3._provider.removeListener('chainChanged', () =>  setProvider(evmProvider, true))
    } else {
      if (web3._provider && web3._provider.on) {
        web3._provider.on('accountsChanged', () => setProvider(evmProvider, true))
        web3._provider.on('chainChanged', () => setProvider(evmProvider, true))
      }
    }
    assign({
      web3,
      selectedAccount: accounts.length ? accounts[0] : null,
      connected: true,
      chainId,
      evmProvider: web3._provider,
      evmProviderType: typeof evmProvider === 'string' ? 'RPC' : 'Web3',
      accounts
    })
    emit()
  }

  const setBrowserProvider = async () => {
    init()
    if (!getWindowEthereum()) throw new Error('[svelte-web3] Please authorize browser extension (Metamask or similar)')
    const accounts = await getWindowEthereum().request({ method: 'eth_requestAccounts' })
    getWindowEthereum().on('accountsChanged', setBrowserProvider)
    getWindowEthereum().on('chainChanged', setBrowserProvider)
    const web3 = new Web3(getWindowEthereum())
    const chainId = await web3.eth.getChainId()
    assign({
      web3,
      selectedAccount: accounts.length ? accounts[0] : null,
      connected: true,
      chainId,
      evmProvider: getWindowEthereum(),
      evmProviderType: 'Browser',
      accounts
    })
    emit()
  }

  const disconnect = async (evmProvider) => {
    if(evmProvider && evmProvider.disconnect) {
      await evmProvider.disconnect()
    }
    init()
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

const subStoreNames = [ 'web3', 'selectedAccount', 'connected', 'chainId', ]

export const makeEvmStores = name => {

  const evmStore = allStores[name] = createStore()

  allStores[name].web3 = derived(
    evmStore,
    $evmStore => {
      if (!$evmStore.web3) return { utils: Web3.utils, version: Web3.version }
      return $evmStore.web3
    }
  )

  allStores[name].selectedAccount = derived(evmStore, $evmStore => $evmStore.selectedAccount)

  allStores[name].connected = derived(evmStore, $evmStore => $evmStore.connected)
  allStores[name].chainId = derived(evmStore, $evmStore => $evmStore.chainId)
  allStores[name].chainData = derived(
    evmStore,
    $evmStore => $evmStore.chainId ? getData($evmStore.chainId) : {}
  )

  allStores[name].evmProviderType = derived(evmStore, $evmStore => $evmStore.evmProviderType)
  allStores[name].walletType = derived(evmStore, $evmStore => {
    if (!$evmStore.provider) return null
    if (typeof $evmStore.provider === 'string') return $evmStore.provider
    if ($evmStore.provider.isMetaMask) return 'MetaMask (or compatible)'
    if ($evmStore.provider.isNiftyWallet) return 'Nifty'
    if ($evmStore.provider.isTrust) return 'Trust'
    return 'Unknown'
  })

  return new Proxy(allStores[name], {
    get: function (internal, property) {
      if (/^\$/.test(property)) {
        // TODO forbid deconstruction !
        property = property.slice(1)
        if (subStoreNames.includes(property)) return allStores[name].get(property)
        throw new Error(`[svelte-web3] no value for store named ${property}`)
      }
      if (['subscribe', 'get', 'setBrowserProvider', 'setProvider', 'evmProviderType', 'chainData', 'walletType', 'close', 'disconnect', ...subStoreNames].includes(property))
        return Reflect.get(internal, property)
      throw new Error(`[svelte-web3] no store named ${property}`)
    }
  })
}

export const getChainStore = name => {
  if (!allStores[name]) throw new Error(`[svelte-web3] chain store ${name} does not exist`)
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
export const evmProviderType = allStores.default.evmProviderType
export const selectedAccount = allStores.default.selectedAccount
export const web3 = allStores.default.web3
export const chainData = allStores.default.chainData

// TODO spin off dectector
export const walletType = allStores.default.walletType

// legacy naming

export const defaultChainStore = defaultEvmStores
