<script lang="ts">
  import {
    walletStore,
    type WalletStore,
  } from "@svelte-on-solana/wallet-adapter-core";
  import {
    signMessage,
    createMessageWithTimestamp,
  } from "$lib/utils/web3Authorize";
  import Button from "$lib/components/Button.svelte";

  let verified: boolean;
  const signIn = async (wallet: WalletStore, orignalMessage: string) => {
    let { message, authorizedDate } = await createMessageWithTimestamp(
      "devnet",
      orignalMessage,
      1
    );

    const { publicKey, signature } = await signMessage(wallet, message);

    const response = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({
        message,
        publicKey,
        signature,
        authorizedDate,
        action: "signin",
      }),
    });

    console.log(response.body);
    const data = await response.json();
    verified = data.verified;
  };

  let signOut = async () => {
    const response = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({
        action: "signout",
      }),
    });
    console.log(response);
  };

  $: console.log(verified);
</script>

<Button
  label="Sign In"
  onClick={() =>
    signIn($walletStore, `Authorized on ${window.location.hostname} until `)}
/>

<Button label="Sign Out" onClick={signOut} />
