<script lang="ts">
  import GetAccount from "$lib/sets/GetAccount.svelte";
  import SetCluster from "$lib/sets/SetCluster.svelte";
  import SolTransfer from "$lib/sets/SolTransfer.svelte";
  import SplToken from "$lib/sets/SplToken.svelte";
  import SolanaPay from "$lib/sets/SolanaPay.svelte";
  import TransferMadLadsRewards from "$lib/sets/TransferMadLadsRewards.svelte";
  import Staking from "$lib/sets/Staking.svelte";
</script>

<section class="w-full h-screen font-main">
  <div>
    <div class="flex justify-center m-4 mb-12">
      <SetCluster />
    </div>
    <div class="flex justify-center m-4 mb-12">
      <GetAccount />
    </div>
    <div class="flex justify-center m-4 mb-12">
      <SolTransfer />
    </div>
    <div class="flex justify-center m-4 mb-12">
      <SplToken />
    </div>
    <div class="flex justify-center m-4 mb-12">
      <SolanaPay />
    </div>
    <div class="flex justify-center m-4 mb-12">
      <Staking />
    </div>
  </div>
</section>
