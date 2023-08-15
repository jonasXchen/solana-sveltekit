import {
    SystemProgram,
    Connection,
    Transaction,
    LAMPORTS_PER_SOL, 
    PublicKey,
    type TransactionSignature
} from '@solana/web3.js'


import { 
    AccountLayout
} from "@solana/spl-token";


// Airdrop
export let getAirdrop = async (connection: Connection, recipient: PublicKey, solAmount: number) : Promise<TransactionSignature> => {

    // Request Airdrop
    let airDropSignature = await connection.requestAirdrop(
        recipient,
        solAmount * LAMPORTS_PER_SOL
    )
    return airDropSignature
}


// Sol Transfer Tx
export let createSolTransferTx = (connection: Connection, source: PublicKey, recipient : PublicKey, solAmount : number) : Transaction => {


    // Create Transaction with instruction
    let tx = new Transaction()  
    tx.add(
        SystemProgram.transfer({
            fromPubkey: source,
            toPubkey: recipient,
            lamports: solAmount * LAMPORTS_PER_SOL
        })
    )

    return tx
}


// Get AccountInfo function
export let getAccountInfo = async (connection: Connection, pubKey : PublicKey) => {
    
    // Get AccountInfo
    let accountInfo = await connection.getAccountInfo(pubKey, connection.commitment);
    return accountInfo
};


// Get ParsedAccountData function
export let getParsedAccountInfo = async (connection: Connection, pubKey : PublicKey) => {
    
    // Get parsed AccountInfo
    let parsedAccountInfo = await connection.getParsedAccountInfo(pubKey, connection.commitment);
    return parsedAccountInfo

};


// Subscribe AccountData function
export let subscribeAccountInfo = (connection: Connection, pubKey : PublicKey) => {
    
    // Subscribe accountInfo
    let subscribedAccountChange = connection.onAccountChange(
        pubKey, 
        (accountInfo, context) => {
            if (accountInfo!.data.length > 0) {
                console.log("Token                                         Balance");
                console.log("------------------------------------------------------------");
                let subscribedAccountInfoData = AccountLayout.decode(accountInfo!.data);
                console.log(`${new PublicKey(subscribedAccountInfoData.mint)}   ${Number(subscribedAccountInfoData.amount) / LAMPORTS_PER_SOL}`);
            }
            console.log('Context: ', context, '\n', 'Lamports: ', accountInfo.lamports)
        }, 
        connection.commitment)

    return subscribedAccountChange
}