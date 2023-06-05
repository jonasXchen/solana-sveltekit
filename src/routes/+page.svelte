<script>
  import PageSelector from '$lib/sets/PageSelector.svelte'
  import { Keypair } form '@solana/web3.js'
  
  const keypair = Keypair.fromSecretKey(
  bs58.decode(
    "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG"
  )
  );
  console.log(Keypair)

</script>


<div class="flex justify-center">

  <PageSelector />




</div>