<script lang="ts">
    // Wallet Store
    import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
	import { onMount } from 'svelte';
	import { clusterApiUrl, PublicKey, type Cluster } from '@solana/web3.js';
	import {
		workSpace,
		WalletProvider,
		WalletMultiButton,
		ConnectionProvider
	} from './index';

	import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

	import { cluster } from '$lib/stores';

	const localStorageKey = 'walletAdapter';

	let network = clusterApiUrl($cluster as Cluster); // localhost or mainnet
	// let network = clusterApiUrl('mainnet-beta'); // localhost or mainnet

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