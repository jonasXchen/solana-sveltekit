<script lang="ts">
    // Wallet Store
    import { walletStore, getLocalStorage, setLocalStorage } from '@svelte-on-solana/wallet-adapter-core';
	import { clusterApiUrl, type Cluster } from '@solana/web3.js';
	import {
		WalletProvider,
		WalletMultiButton,
		ConnectionProvider
	} from './index';

	import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
	import { onMount } from 'svelte'

	const localStorageKey = 'walletAdapter';



	// Get localStorage for cluster
	let cluster : Cluster | undefined
	onMount(() => {
		cluster = localStorage.getItem('cluster') as Cluster
	});

	let network = clusterApiUrl(cluster)

	let wallets = [
        new PhantomWalletAdapter(), 
        new SolflareWalletAdapter()
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