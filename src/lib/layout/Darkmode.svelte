<script>
  import { theme } from "$lib/stores";
  import sun from "$lib/assets/images/darkmode/sun.svg";
  import moon from "$lib/assets/images/darkmode/moon.svg";

  function toggle() {
    if (window.document.documentElement.classList.value == "dark") {
      theme.set("light");
      window.document.documentElement.classList.replace("dark", "light");
    } else {
      theme.set("dark");
      window.document.documentElement.classList.replace("light", "dark");
    }
  }
</script>

<button
  class="p-1 rounded-md bg-grey dark:bg-dark hover:bg-primary dark:hover:bg-primary"
  on:click={toggle}
>
  {#if $theme == "dark"}
    <img src={sun} alt="sun" />
  {:else}
    <img src={moon} alt="moon" />
  {/if}
</button>
