<script lang=ts>

	import GetAccount from '$lib/sets/GetAccount.svelte';
	import SetCluster from '$lib/sets/SetCluster.svelte';
	import SolTransfer from '$lib/sets/SolTransfer.svelte';
	import SplToken from '$lib/sets/SplToken.svelte';
  import SolanaPay from '$lib/sets/SolanaPay.svelte';


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
			<GetAccount />
		</div>
		<div class="flex m-4 mb-12 justify-center">
			<SolTransfer />
		</div>
    <div class="flex m-4 mb-12 justify-center">
      <SplToken />
    </div>
    <div class="flex m-4 mb-12 justify-center">
			<SolanaPay />
		</div>
	</div>
</section>