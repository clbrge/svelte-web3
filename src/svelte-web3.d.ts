import { Readable } from 'svelte/store'
import Web3 from 'web3'
import { provider } from 'web3-core'
import { ContractOptions, Contract } from 'web3-eth-contract'

declare module 'svelte-web3' {
  /**
   * JavaScript CAIP-2 representation object.
   * @see https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md
   */
  interface ChainData {
    name: string
    chain: string
    network: string
    rpc: string[]
    faucets: string[]
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    infoURL: string
    shortName: string
    chainId: number
    networkId: number
    icon: string
    explorers: {
      name: string
      url: string
      icon: string
      standard: string
    }[]
  }

  interface ChainStore {
    /**
     * Enables a connection with the current window provider.
     * Note that your code need to be in browser context when setProvider is running.
     * So you may want to use onMount when using Sapper or Sveltekit.
     * @param provider An url string or a valid provider object (as returned by web3Modal or WalletConnect for example)
     * @param index Select another account than the default when possible.
     */
    setProvider(provider?: provider, index?: string): Promise<void>
    /**
     * Forces a disconnect (and event subscriptions from a provider)
     */
    disconnect(): Promise<void>
    /**
     * The whole Web3.js API. It must be references as `$web3` and not `web3` since it is a Svelte store.
     * @see https://web3js.readthedocs.io/en/v1.5.2/web3.html
     */
    readonly web3: Readable<Web3>
    /**
     * Current selected account address if connected, `null` otherwise.
     */
    readonly selectedAccount: Readable<string | null>
    /**
     * `true` if connection to the provider was successful.
     */
    readonly connected: Readable<boolean>
    /**
     * The current blockchain CAIP-2 data if connected, empty object otherwise.
     */
    readonly chainData: Readable<ChainData>
    /**
     * The current chainId (if connected).
     */
    readonly chainId: Readable<number>
  }

  // ---------- DEFAULT CHAIN STORE EXPORTS ----------
  /**
   * The main connection helper and derived Svelte stores
   */
  const defaultEvmStores: ChainStore

  /**
   * The whole Web3.js API for the `defaultEvmStores`. It must be references as `$web3` and not `web3` since it is a Svelte store.
   * @see https://web3js.readthedocs.io/en/v1.5.2/web3.html
   */
  const web3: Readable<Web3>
  /**
   * Current selected account address of the `defaultEvmStores` if connected, `null` otherwise.
   */
  const selectedAccount: Readable<string | null>
  /**
   * `true` if connection to the provider was successful for `defaultEvmStores`.
   */
  const connected: Readable<boolean>
  /**
   * The current blockchain CAIP-2 data of `defaultEvmStores` if connected, empty object otherwise.
   */
  const chainData: Readable<ChainData>
  /**
   * The current chainId of `defaultEvmStores` if connected.
   */
  const chainId: Readable<number>

  /**
   * This can be used to create several stores, each connected to different providers.
   * This lets you manage different chains at the same time.
   * @param name Unique name for the newly created store. The name `default` is used to create `defaultEvmStores` so you shouldn't use it unless you want to override the default store.
   */
  function makeEvmStores(name: string): ChainStore
  /**
   * Retrieves the store without re-initializing the connection:
   * @param name Name of the previously created store.
   * @returns The store if connected, `null` otherwise.
   */
  function getChainStore(name: string): ChainStore

  /**
   * You might want to access all chains CAIP-2 data directly without using the chainData store.
   * In this case, use the getter allChainsData, it returns the list of all CAIP-2 data available.
   */
  const allChainsData: ChainData[]

  /**
   * Allows you to create a Svelte derived store of a web3.eth.Contract object instance.
   * It takes the same parameters as a ̀new web3.eth.Contract` call.
   * @param jsonInterface The contract ABI
   * @param address The contract address
   * @param options The contract options
   * @returns A Svelte derived store of a web3.eth.Contract object instance
   */
  function makeContractStore(
    jsonInterface: any,
    address?: string,
    options?: ContractOptions
  ): Readable<Contract>

  export {
    ChainData,
    ChainStore,
    web3,
    selectedAccount,
    connected,
    chainId,
    chainData,
    defaultEvmStores,
    makeEvmStores,
    getChainStore,
    allChainsData,
    makeContractStore
  }
}
