<script lang="ts">
  import {
    type WalletStore,
    walletStore,
  } from "@svelte-on-solana/wallet-adapter-core";
  import {
    PublicKey,
    Transaction,
    LAMPORTS_PER_SOL,
    Connection,
    Keypair,
  } from "@solana/web3.js";

  import Button from "../components/Button.svelte";
  import { cluster, connectedCluster } from "$lib/stores";

  import Select from "$lib/components/Select.svelte";
  import { getStakeAccountAmount, withdrawStake } from "$lib/utils/staking";
  import { signAndSendTx } from "$lib/utils/web3Authorize";
  import sanctumList from "$lib/utils/staking/sanctumList.json";

  let poolAccountObjects = sanctumList.sanctum_lst_list;
  let poolAcccountSymbols = poolAccountObjects.map((obj) => obj.symbol);
  poolAcccountSymbols.sort((a, b) => a.localeCompare(b));

  let poolAccountSymbolSelected = poolAccountObjects.find(
    (obj) => obj.symbol == "JupSOL"
  )!.symbol;

  let poolAccountAddressSelected = new PublicKey(
    sanctumList.sanctum_lst_list[3].pool.pool!
  );

  let onChange: () => Promise<any> | any = () => {
    poolAccountAddressSelected = new PublicKey(
      poolAccountObjects.find(
        (obj) => obj.symbol == poolAccountSymbolSelected
      )!.pool.pool!
    );
  };

  let unstakeSignature: string;

  // Define inputs and set default values for Solana Pay
  let amount: number = 0;

  // GetAmount
  const getAmount = async (
    wallet: WalletStore,
    connection: Connection,
    poolAccount: PublicKey
  ) => {
    let tokenAmount = await getStakeAccountAmount(
      connection,
      poolAccount,
      wallet.publicKey!
    );

    amount = Number(tokenAmount) / LAMPORTS_PER_SOL;
  };

  // Unstake
  const unstakeFromPool = async (
    wallet: WalletStore,
    connection: Connection,
    poolAccount: PublicKey
  ) => {
    // Create tx
    let withdrawTx = await withdrawStake(
      connection,
      poolAccount,
      wallet.publicKey!,
      amount
    );

    let max_per_tx = 3;
    let transactions: Transaction[] = [];
    let instructions = withdrawTx.instructions;

    withdrawTx.signers.map((val) => console.log(val.publicKey.toBase58()));

    for (let i = 0; i < (instructions.length - 1) / 2; i += max_per_tx) {
      if (i == 0) {
        let transaction = new Transaction();
        // INSERT YOUR CODE HERE TO SIGN A TRANSACTION WITH A WALLET
        // transaction = await signTransaction(transaction)
        transaction.add(...instructions.slice(0, 1 + max_per_tx * 2));
        transaction.feePayer = wallet.publicKey!;
        transaction.recentBlockhash = (
          await connection.getLatestBlockhash("max")
        ).blockhash;

        let signers = [...withdrawTx.signers.slice(0, 1 + max_per_tx)];
        if (signers.length > 0) {
          transaction.partialSign(...signers);
        }
        transactions.push(transaction);
      } else {
        let transaction = new Transaction();
        transaction.add(
          ...instructions.slice(i * 2 + 1, i * 2 + 1 + max_per_tx * 2)
        );

        // INSERT YOUR CODE HERE TO SIGN A TRANSACTION WITH A WALLET
        // transaction = await signTransaction(transaction)
        transaction.feePayer = wallet.publicKey!;
        transaction.recentBlockhash = (
          await connection.getLatestBlockhash("max")
        ).blockhash;

        let signers = [
          withdrawTx.signers[0],
          ...withdrawTx.signers.slice(i + 1, i + 1 + max_per_tx),
        ];
        if (signers.length > 0) {
          transaction.partialSign(...signers);
        }
        transactions.push(transaction);
      }
    }
    unstakeSignature = await signAndSendTx(connection, wallet, transactions[0]);
  };
</script>

<section
  class="w-2/3 p-4 space-y-4 text-black rounded-md bg-dark dark:text-white"
>
  <h1>Staking</h1>
  <div class="grid grid-cols-1 space-y-4">
    <!-- User Input -->
    <Select
      label="Pool Account"
      options={poolAcccountSymbols}
      bind:bindValue={poolAccountSymbolSelected}
      {onChange}
    />
    <div>
      <label for="Amount">Amount</label>
      <input
        class="w-full text-black"
        bind:value={amount}
        placeholder="Specify amount"
      />
    </div>
    <div>
      <Button
        label="Get Pool Amount"
        onClick={() =>
          getAmount(
            $walletStore,
            $connectedCluster,
            poolAccountAddressSelected
          )}
      />
      <Button
        label="Unstake"
        styling="bg-blue-600"
        onClick={() =>
          unstakeFromPool(
            $walletStore,
            $connectedCluster,
            poolAccountAddressSelected
          )}
      />
    </div>
    <!-- Response Output -->
    <div>
      {#await unstakeSignature}
        <p>waiting for signature</p>
      {:then value}
        {#if value}
          <a
            class="hover:text-primary"
            href="https://solscan.io/tx/{value}"
            target="_blank"
            rel="noopener noreferrer">-> SUCCESS</a
          >
        {/if}
      {:catch error}
        <p>Error</p>
      {/await}
    </div>
  </div>
</section>
