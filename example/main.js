import App from './App.svelte'

const app = new App({
  target: document.body,
  props: {
	name: 'Svelte + Web3',
    tipAddres: '0x834356a88C66897FA0A05a61964a91A607956ee3',
  }
});

export default app
