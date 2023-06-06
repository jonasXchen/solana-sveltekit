<script lang=ts>
    import { cluster, connectedCluster } from "$lib/stores";
	import { type Cluster, Connection, clusterApiUrl } from "@solana/web3.js";


	// Define list for cluster options
	let cluster_options = [
		{ name: 'devnet'},
		{ name: 'testnet'},
		{ name: 'mainnet-beta'},
		{ name: 'localnet'}
	]

	// Input/Output variables used
	let cluster_selected : Cluster | 'localnet' = 'devnet'
	let clusterUrl : string

    // Set cluster connection via store
	function handleSubmit() {

		// Set new cluster and connection in store
		cluster.set(
			cluster_selected as Cluster
		)

		if (cluster_selected == 'localnet') {
			clusterUrl = 'http://127.0.0.1:8899'
		} else {
			clusterUrl = clusterApiUrl(cluster_selected as Cluster)
		}
		
		connectedCluster.set(
			// new Connection('https://rpc.helius.xyz/?api-key=72d348d8-4037-4fe1-a4d3-fe9e271be940', 'confirmed')
			new Connection(clusterUrl, 'confirmed') 
			// new Connection('https://devnet.genesysgo.net/') 
		)

	}



	handleSubmit()

</script>


<!-- HTML + SVELTE -->
<section class="text-black dark:text-white" >
	<!-- User Input -->
	<div>
		<label for="Cluster">Cluster:</label>
		<select class='text-black' bind:value={cluster_selected} on:change="{handleSubmit}">
			{#each cluster_options as cluster}
				<option class='text-black' value={cluster.name}>
					{cluster.name}
				</option>
			{/each}
		</select>
	</div>
</section>
