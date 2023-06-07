<script lang=ts>
	import {
		PublicKey,
		type ParsedAccountData,
		type AccountInfo,
		type RpcResponseAndContext, 
		type Connection
	} from '@solana/web3.js';

	import { cluster, connectedCluster, notify } from "$lib/stores";
	import Button from '../components/Button.svelte';

	import {
		getAccountInfo,
		getParsedAccountInfo,
		subscribeAccountInfo
	} from '../utils/systemProgram'
  import { walletStore } from '@svelte-on-solana/wallet-adapter-core';


	// Input/Output variables used
	let pubKey : PublicKey | string
	$ : pubKey
	let accountData : RpcResponseAndContext<AccountInfo<Buffer | ParsedAccountData> | null> | AccountInfo<Buffer> |  null
	let subscribedAccountInfoChange : number


	// Get AccountInfo function
	async function getAccountInfoHandler(connection: Connection, pubKey : PublicKey) {

		notify('Getting Account Info')
		
		// Get accountInfo
		accountData = await getAccountInfo(connection, pubKey)
		
	};


	// Get ParsedAccountData function
	async function getParsedAccountDataHandler(connection: Connection, pubKey : PublicKey) {
		notify('Getting Parsed Account Info')

		// Get Parsed AccountInfo
		accountData = await getParsedAccountInfo(connection, pubKey);
	};

	// Subscribe AccountData function
	async function subscribeAccountInfoDataHandler(connection: Connection, pubKey : PublicKey) {
		
		// Subscribe accountInfo
		subscribedAccountInfoChange = subscribeAccountInfo(connection, pubKey)
	};


</script>


<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
	<h1>Check / Subscribe to Accounts</h1>
	<div>
		<!-- User Input -->
		<div>
			<div>
				<label for="Account"></label>
				<input class="text-black w-full mb-2" bind:value={pubKey} placeholder="Enter address ...">	
			</div>

			<div class="flex flex-wrap items-center">

			
				<div class="mt-1 mr-2 mb-1">
					<Button label='Get AccountInfo' onClick={() => getAccountInfoHandler($connectedCluster, new PublicKey(pubKey))}/>
				</div>

				<div class="mt-1 mr-2 mb-1">
					<Button label='Get ParsedAccountInfo' onClick={() => getParsedAccountDataHandler($connectedCluster, new PublicKey(pubKey))}/>
				</div>

				<div class="mt-1 mr-2 mb-1">
					<Button label='Subscribe Account' onClick={() => subscribeAccountInfoDataHandler($connectedCluster, new PublicKey(pubKey))}/>
				</div>

				<div class="mt-1 mr-2 mb-1">
					<a href='https://solana.fm/address/{pubKey}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">
						<Button label='Check Explorer'/>
					</a>					
				</div>

				<div class="mt-1 mr-2 mb-1">
					<Button label='Copy Wallet' styling='bg-blue-600' onClick={() => pubKey = $walletStore.publicKey|| ''}/>
				</div>
			

			</div>
		</div>

		<!-- Response Output -->
		<div>
			{#if subscribedAccountInfoChange !== undefined}
			<div>Subscription ID: {subscribedAccountInfoChange}</div>
			{/if}
		</div>
		<div>
			{#await accountData}
				<p>waiting</p>
			{:then account}
				{#if account !== undefined}
				<pre>{JSON.stringify(account, null, 4)}</pre>
				{/if}
			{:catch error}
				<p>No data</p>
			{/await}
		</div>
	</div>
</section>
