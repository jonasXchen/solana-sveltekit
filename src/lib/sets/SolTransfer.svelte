<script lang=ts>	
	import { walletStore, type WalletStore } from "@svelte-on-solana/wallet-adapter-core";	
	import { cluster, connectedCluster } from "$lib/stores";
	import Button from '../components/Button.svelte'

    // Web3.js library and transactions
	import { Connection, PublicKey } from '@solana/web3.js'
	import { createSolTransferTx, getAirdrop } from '../utils/systemProgram';
	import signAndSendTx from '../utils/signAndSendTransaction';

	// Request Airdrop function
	async function airDrop(connection: Connection, recipient : PublicKey, solAmount : number) {

		// Request Airdrop
		airDropSignature = await getAirdrop(connection, recipient, solAmount)

		return airDropSignature
	}

	// Send Transaction function
    async function transferSol(wallet : WalletStore, connection: Connection, source: PublicKey, recipient : PublicKey, solAmount : number) {

		// Create ix to transfer Sol, sign and send transaction
		let tx = createSolTransferTx(connection, source, recipient, solAmount)
		transferSignature = await signAndSendTx(connection, wallet, tx)

		return transferSignature
	}

	// Input/Output variables used
	let airDropSignature: string;
	let transferSignature: string;
	let source : PublicKey | any
	let recipient : PublicKey | any; 
	let solAmount : number | string = 2.0;

	// Enable Reactivity, "Source" automatically set to connected wallet
	$: source = $walletStore.publicKey ? $walletStore.publicKey : null

</script>

<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-2/3 rounded-md text-black dark:text-white">
	<h1>Transfer/Airdrop SOL</h1>
	<!-- Transfer & Airdrop Token -->
	<div class="grid grid-cols-1 space-y-4">

		<!-- User Input -->
		<div>
			<label for="Target">Recipient:</label>
			<input class="text-black w-full" bind:value={recipient} placeholder="Enter recipient address ...">
		</div>
		<div>
			<label for="Amount (SOL)">Amount (SOL):</label>
			<input class="text-black w-full" bind:value={solAmount}>
		</div>

		<!-- User Buttons -->
		<div>
			<Button label='Transfer' onClick={() => transferSol($walletStore, $connectedCluster, new PublicKey(source), new PublicKey(recipient), +solAmount)}/>
			<Button label='Airdrop' onClick={() => airDrop($connectedCluster, new PublicKey(recipient), +solAmount)}/>
			<Button label='Copy Wallet' styling='bg-blue-600' onClick={() => recipient = $walletStore.publicKey|| ''}/>
		</div>

	</div>

	<div>
		<!-- Airdrop success message -->
		{#await airDropSignature then value}
			{#if value}
			<p class="break-words">SUCCESS -> Airdop Signature: 
				<a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
			</p>
			{/if}
		{/await}

		<!-- Transfer success message -->
		{#await transferSignature then value}
			{#if value}
			<p class="break-words">SUCCESS -> Transfer Signature: 
				<a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
			</p>
			{/if}
		{/await}

	</div>

</section>