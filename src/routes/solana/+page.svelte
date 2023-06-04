<script lang=ts>

    import GetParsedAccountData from '$lib/sets/GetParsedAccountData.svelte';
    import SetCluster from '$lib/sets/SetCluster.svelte';
	import TransferSol from '$lib/sets/TransferSol.svelte';
	import SplToken from '$lib/sets/SplToken.svelte';
	import SplToken2022 from '$lib/sets/SplToken2022.svelte';

</script>

<svelte:head>
	<title>Metacamp</title>
</svelte:head>

<section class="w-full h-screen font-main">
	<div>
		<div class="flex m-4 mb-12 justify-center">
			<SetCluster />
		</div>
		<div class="flex m-4 mb-12 justify-center">
			<GetParsedAccountData />
		</div>
		<div class="flex m-4 mb-12 justify-center">
			<TransferSol />
		</div>
		<div class="grid grid-cols-2">
			<div class="flex m-4 mb-12 justify-center">
				<SplToken />
			</div>
			<div class="flex m-4 mb-12 justify-center">
				<SplToken2022 />
			</div>
		</div>
	</div>
</section>