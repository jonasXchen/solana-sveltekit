<script lang="ts">
	import SolanaPay from '$lib/sets/SolanaPay.svelte';
	import SetCluster from '$lib/sets/SetCluster.svelte';


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
			<SolanaPay />
		</div>
	</div>
</section>