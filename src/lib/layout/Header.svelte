<script lang="ts">
	import { page } from '$app/stores';
	import Toggle from '$lib/layout/Darkmode.svelte';
	import Adapter from '$lib/wallet-adapter/Adapter.svelte';
	import { theme } from '$lib/stores';
	import MetacampDarkModeLogo from '$lib/assets/images/logo/dark-mode-logo.png';
	import MetacampLightModeLogo from '$lib/assets/images/logo/light-mode-logo.png';

</script>


<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="icon" href="" />
</head>

<header class="p-16">
	
	<div class="flex space-x-12 justify-center align-middle items-center h-full font-main text-black dark:text-white">
		<div class="absolute left-6 top-8 items-center">
			<a href="/">
			<div class:active={$page.url.pathname === '/'}>
					<img src={($theme == 'light')? MetacampLightModeLogo : MetacampDarkModeLogo} alt="Metacamp" class="h-6"/>
			</div></a>
		</div>
		<div class="absolute right-16 top-6 h-4">
			<Adapter />
		</div>
		<div class="absolute right-6 top-8">
			<Toggle />
		</div>
	</div>

</header>
