import type {
    WalletStore,
} from "@svelte-on-solana/wallet-adapter-core";
  import {
    signMessage,
    createMessageWithTimestamp,
  } from "$lib/utils/web3Authorize";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { invalidateAll } from "$app/navigation";


export let signIn = async (wallet: WalletStore) => {
    const connection = new Connection(clusterApiUrl("devnet"))
    const orignalMessage = `Authorized on ${window.location.hostname} until `

    let { message, authorizedDate } = await createMessageWithTimestamp(
        connection,
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
    if (response.status == 200) {
        invalidateAll()
    }
};

export let signOut = async () => {
    const response = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({
        action: "signout",
        }),
    });
    if (response.status == 200) {
        invalidateAll()
    }
};