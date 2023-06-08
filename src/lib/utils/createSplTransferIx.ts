import type {
    Connection,
    PublicKey,
    TransactionInstruction,
} from "@solana/web3.js";

import {
    getAccount,
    getMint,
    createTransferCheckedInstruction,
    TOKEN_PROGRAM_ID
} from '@solana/spl-token'

import { getAta, checkAtaExist, createAtaTx } from '../utils/tokenProgram2022'

import * as dotenv from 'dotenv'

dotenv.config()

export async function createSplTransferIx(connection: Connection, splToken: PublicKey, sender : PublicKey, amount: number, recipient: PublicKey, payer: PublicKey = sender, references?: PublicKey[], programId: PublicKey = TOKEN_PROGRAM_ID)  {

    let transferIxArray : TransactionInstruction[] = []

    // Get the sender's ATA and check that the account exists and can send tokens
    const senderAta = getAta(splToken, sender, programId);
    const senderAccount = await getAccount(connection, senderAta, undefined, programId);
    if (!senderAccount.isInitialized) throw new Error('merchant not initialized');
    if (senderAccount.isFrozen) throw new Error('merchant frozen');


    // Get the merchant's ATA and check that the account exists and can receive tokens
    const recipientAta = getAta(splToken, recipient, programId);
    console.log(recipientAta.toString())
    const recipientAtaExist = await checkAtaExist(connection, recipientAta, undefined, programId);
    if (!recipientAtaExist) { 
        let createRecipientAtaIx = createAtaTx(splToken, recipient, payer, programId).instructions[0]
        transferIxArray.push(createRecipientAtaIx)
    }

    // Check that the token provided is an initialized mint
    let mint = await getMint(connection, splToken, undefined, programId);
    if (!mint.isInitialized) throw new Error('mint not initialized');

    // You should always calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    amount = amount * (10 ** mint.decimals);

    // Check that the sender has enough tokens
    const tokens = BigInt(String(amount));
    if (tokens > senderAccount.amount) throw new Error('insufficient funds');

    // Create an instruction to transfer SPL tokens, asserting the mint and decimals match
    const splTransferIx = createTransferCheckedInstruction(
        senderAta,
        splToken,
        recipientAta,
        sender,
        tokens,
        mint.decimals,
        [],
        programId
    );


    // add references to the instruction
    if (!(references === undefined)) {
        for (const pubkey of references) {
            splTransferIx.keys.push({ pubkey, isWritable: false, isSigner: false });
        }
    }

    transferIxArray.push(splTransferIx)
    console.log(JSON.stringify(transferIxArray, undefined, 4))

    return transferIxArray;
}

