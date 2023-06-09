import type {
    Connection,
    Transaction,
    Signer
} from '@solana/web3.js';

import type { WalletStore } from "@svelte-on-solana/wallet-adapter-core";



export default async function signAndSendTx(connection: Connection, wallet: WalletStore, tx: Transaction) {

    if (tx.signatures.length == 0) {
        let latestBlockHash = await connection.getLatestBlockhash();
        tx.recentBlockhash = latestBlockHash.blockhash;
        tx.lastValidBlockHeight = latestBlockHash.lastValidBlockHeight
    }

    console.log(JSON.stringify(tx))
    const sig = await wallet.sendTransaction(tx, connection)

    return sig

}





