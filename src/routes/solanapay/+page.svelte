<script lang="ts">
  import SolanaPay from "$lib/sets/SolanaPay.svelte";
  import SetCluster from "$lib/sets/SetCluster.svelte";
</script>

<section class="w-full h-screen font-main">
  <div>
    <div class="flex justify-center m-4 mb-12">
      <SetCluster />
    </div>
    <div class="flex justify-center m-4 mb-12">
      <SolanaPay />
    </div>
  </div>
</section>
