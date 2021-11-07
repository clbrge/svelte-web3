import { Readable } from "svelte/store";
import Web3 from "web3";

declare module "svelte-web3" {
    /**
     * JavaScript CAIP-2 representation object.
     * @see https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md
     */
    interface ChainData {
        name: string;
        chain: string;
        network: string;
        rpc: string[];
        faucets: string[];
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
        infoURL: string;
        shortName: string;
        chainId: number;
        networkId: number;
        icon: string;
        explorers: {
            name: string;
            url: string;
            icon: string;
            standard: string;
        }[];
    }

    interface DefaultChainStore {
        /**
         * Enables a connection with the current window provider
         * Note that your code need to be in browser context when setBrowserProvider is running.
         * So you may want to use onMount when using Sapper or Sveltekit. Similarly, you cannot use setBrowserProvider in SSR context.
         */
        readonly setBrowserProvider(): Promise<void>;
        /**
         * To enable connection using a custom provider.
         * @param provider An url string or a valid provider object (as returned by web3Modal or WalletConnect for example)
         */
        readonly setProvider(provider: string): Promise<void>;
        /**
         * Forces a disconnect (and event subscriptions from a provider)
         */
        readonly close(): Promise<void>;
    }

    // ---------- CUSTOM CHAIN STORE PROPERTIES ----------
    interface ChainStore extends DefaultChainStore {
        /**
         * The whole Web3.js API. It must be references as `$web3` and not `web3` since it is a Svelte store.
         * @see https://web3js.readthedocs.io/en/v1.5.2/web3.html
         */
        readonly web3: Readable<Web3>;
        /**
         * Current selected account address if connected, `null` otherwise.
         */
        readonly selectedAccount: Readable<string | null>;
        /**
         * `true` if connection to the provider was successful.
         */
        readonly connected: Readable<boolean>;
        /**
         * The current blockchain CAIP-2 data if connected, empty object otherwise.
         */
        readonly chainData: Readable<ChainData>;
        /**
         * The current chainId (if connected).
         */
        readonly chainId: Readable<number>;
    }

    // ---------- DEFAULT CHAIN STORE EXPORTS ----------
    /**
     * The main connection helper and derived Svelte stores
     */
    const defaultChainStore: DefaultChainStore;

    /**
     * The whole Web3.js API for the `defaultChainStore`. It must be references as `$web3` and not `web3` since it is a Svelte store.
     * @see https://web3js.readthedocs.io/en/v1.5.2/web3.html
     */
    const web3: Readable<Web3>;
    /**
     * Current selected account address of the `defaultChainStore` if connected, `null` otherwise.
     */
    const selectedAccount: Readable<string | null>;
    /**
     * `true` if connection to the provider was successful for `defaultChainStore`.
     */
    const connected: Readable<boolean>;
    /**
     * The current blockchain CAIP-2 data of `defaultChainStore` if connected, empty object otherwise.
     */
    const chainData: Readable<ChainData>;
    /**
     * The current chainId of `defaultChainStore` if connected.
     */
    const chainId: Readable<number>;

    /**
     * This can be used to create several stores, each connected to different providers.
     * This lets you manage different chains at the same time.
     * @param name Unique name for the newly created store. The name `default` is used to create `defaultChainStore` so you shouldn't use it unless you want to override the default store.
     */
    function makeChainStore(name: string): ChainStore;
    /**
     * Retrieves the store without re-initializing the connection:
     * @param name Name of the previously created store.
     */
    function getChainStore(name: string): ChainStore;

    export {
        ChainData,
        DefaultChainStore,
        ChainStore,
        web3,
        selectedAccount,
        connected,
        chainId,
        chainData,
        defaultChainStore,
        makeChainStore,
        getChainStore,
    };
}
