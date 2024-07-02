import {
    PublicKey, Connection,
    type Transaction,
    clusterApiUrl
} from '@solana/web3.js';

import type { WalletStore } from "@svelte-on-solana/wallet-adapter-core";
import nacl from 'tweetnacl';


export let signAndSendTx = async (connection: Connection, wallet: WalletStore, tx: Transaction) => {
    if (tx.signatures.length == 0) {
        let latestBlockHash = await connection.getLatestBlockhash();
        tx.recentBlockhash = latestBlockHash.blockhash;
        tx.lastValidBlockHeight = latestBlockHash.lastValidBlockHeight
    }

    console.log(tx)
    const sig = await wallet.sendTransaction(tx, connection)

    return sig
}

export let signMessage = async (wallet: WalletStore, message: string = '') => {

    // `publicKey` will be null if the wallet isn't connected
    if (!wallet.publicKey) throw new Error('Wallet not connected!');
    // `signMessage` will be undefined if the wallet doesn't support it
    if (!wallet.signMessage) throw new Error('Wallet does not support message signing!');

    const msg = new TextEncoder().encode(message)
    const sig = await wallet.signMessage!(msg)
    const signature = Buffer.from(sig).toString('hex')
    const publicKey = wallet.publicKey.toString()

    const { verified } = verifyMessageSignature(message, signature, publicKey)

    return { verified, signature, message, publicKey }
}

export let verifyMessageSignature = ( message: string, signature: string, publicKey: string) => {
    const msg = new TextEncoder().encode(message)
    const sig = Buffer.from(signature, 'hex')
    const pubkey = new PublicKey(publicKey)
    const verified = nacl.sign.detached.verify(msg, sig, pubkey.toBuffer())
    return { verified, message, signature, publicKey }
}

export let getCurrentTimestamp = async (connection: Connection) => {
    let slot = await connection.getSlot();
    let currentTimestamp = await connection.getBlockTime(slot);
    return currentTimestamp
}

export let createMessageWithTimestamp = async (connection: Connection, message: string, hours: number) => {
    let currentTimestamp = await getCurrentTimestamp(connection);
    let authorizedTimestamp = currentTimestamp! * 1000 + 60 * 60 * 1000 * hours;
    let authorizedDate = new Date(authorizedTimestamp)
    message = message + authorizedDate
    return { message, authorizedDate }
}

export let verifyTimestampInMessage = async (message: string) => {
    let connection = new Connection(clusterApiUrl('mainnet-beta'))
    let currentTimestamp = await getCurrentTimestamp(connection);
    currentTimestamp ? currentTimestamp = currentTimestamp : currentTimestamp = 0
    let regex = /until (.+? \(.+?\))/;
    let authorizedDate = message.match(regex)?.[1];
    let authorizedTimestamp = Date.parse(authorizedDate!) / 1000
    return currentTimestamp < authorizedTimestamp
}

export let verifyCookie = async (cookie: any) => {
    let { verified } = await verifyMessageSignature(cookie.message, cookie.signature, cookie.publicKey)
    let verifiedTimestamp = await verifyTimestampInMessage(cookie.message)
    return verified && verifiedTimestamp
}