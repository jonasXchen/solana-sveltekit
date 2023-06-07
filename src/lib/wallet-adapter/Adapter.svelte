<script lang="ts">
    // Wallet Store
    import { walletStore, getLocalStorage, setLocalStorage } from '@svelte-on-solana/wallet-adapter-core';
	import { clusterApiUrl, type Cluster } from '@solana/web3.js';
	import {
		WalletProvider,
		WalletMultiButton,
		ConnectionProvider
	} from './index';

	import { PhantomWalletAdapter, SolflareWalletAdapter, BackpackWalletAdapter } from '@solana/wallet-adapter-wallets';
	import { browser } from "$app/environment";

	const localStorageKey = 'walletAdapter';



	// Get localStorage for cluster
	let cluster : Cluster | undefined
	(browser) ? cluster = localStorage.getItem('cluster') as Cluster : 'devnet'

	let network = clusterApiUrl(cluster)

	let wallets = [
        new PhantomWalletAdapter(), 
        new SolflareWalletAdapter(),
		new BackpackWalletAdapter()
    ];

</script>

<section>

	<WalletProvider {localStorageKey} {wallets} autoConnect />
	<ConnectionProvider {network} />
	
	<WalletMultiButton />
	{#if $walletStore?.connected}
	<div>My wallet is connected</div>
	{/if}

</section>