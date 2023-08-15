<script lang="ts">
  import { page } from "$app/stores";
  import Toggle from "$lib/layout/Darkmode.svelte";
  import Adapter from "$lib/wallet-adapter/Adapter.svelte";
  import { theme } from "$lib/stores";
  import MetacampDarkModeLogo from "$lib/assets/images/logo/dark-mode-logo.png";
  import MetacampLightModeLogo from "$lib/assets/images/logo/light-mode-logo.png";
</script>

<div class="p-10">
  <div
    class="flex items-center justify-center h-full space-x-12 text-black align-middle font-main dark:text-white"
  >
    <div class="absolute items-center left-6 top-8">
      <a href="/">
        <div class:active={$page.url.pathname === "/"}>
          <img
            src={$theme == "light"
              ? MetacampLightModeLogo
              : MetacampDarkModeLogo}
            alt="Metacamp"
            class="h-6"
          />
        </div></a
      >
    </div>
    <div class="absolute h-4 right-16 top-6">
      <Adapter />
    </div>
    <div class="absolute right-6 top-8">
      <Toggle />
    </div>
  </div>
</div>
