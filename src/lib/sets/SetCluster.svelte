<script lang="ts">
  import { cluster, connectedCluster } from "$lib/stores";
  import { type Cluster, Connection, clusterApiUrl } from "@solana/web3.js";
  import Select from "../components/Select.svelte";

  // Input/Output variables used
  let clusters = ["devnet", "testnet", "mainnet-beta", "localnet"];
  let clusterSelected: Cluster | "localnet" = "devnet";
  let clusterUrl: string;

  // Set cluster connection via store
  const handleSubmit = () => {
    // Set new cluster in store
    cluster.set(clusterSelected as Cluster);

    // Handle localnet
    if (clusterSelected == "localnet") {
      clusterUrl = "http://127.0.0.1:8899";
    } else if (clusterSelected == "mainnet-beta") {
      clusterUrl =
        "https://rpc.helius.xyz/?api-key=72d348d8-4037-4fe1-a4d3-fe9e271be940";
    } else {
      clusterUrl = clusterApiUrl(clusterSelected as Cluster);
    }

    // Set connection in store
    connectedCluster.set(new Connection(clusterUrl));
  };
</script>

<!-- HTML + SVELTE -->
<section class="text-black dark:text-white">
  <!-- User Input -->
  <div>
    <Select
      label="Cluster"
      options={clusters}
      bind:bindValue={clusterSelected}
      onChange={handleSubmit}
    />
  </div>
</section>
