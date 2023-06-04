import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    Keypair,
    type Signer,
    type Commitment
} from '@solana/web3.js'

// Create Instructions
import {
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    ExtensionType,
    getMintLen,
    getAccountLen,
    createInitializeMintCloseAuthorityInstruction,
    createInitializeInterestBearingMintInstruction,
    createInitializeNonTransferableMintInstruction,
    createInitializeTransferFeeConfigInstruction,
    createInitializeMint2Instruction,
    createCloseAccountInstruction,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
    createTransferCheckedWithFeeInstruction,
    getAssociatedTokenAddressSync,
    getAccount,
    getMint,
    getTransferFeeConfig
} from "@solana/spl-token"

import type { WalletStore } from '@svelte-on-solana/wallet-adapter-core';

       
enum AccountType {
    Mint,
    Token
}

export function getSpace(accountType: AccountType, extensions: ExtensionType[]) : number {
    if (accountType === AccountType.Mint) {
        let mintLen = getMintLen(extensions)
        return mintLen
    }
    if (accountType === AccountType.Token) {
        let tokenLen = getAccountLen(extensions);
        return tokenLen
    }
    return 0
}

export class MintConfigData {
    decimals: number;
    closeAuthority: boolean;
    nonTransferable: boolean;
    feeConfig: {
        feeBasisPoints: number,
        maxFee: number
    };
    interestConfig: {
        interestRate: number
    };
    constructor(decimals: number, closeAuthority?: boolean, nonTransferable?: boolean, feeBasisPoints?: number, maxFee?: number, interestRate?: number) {
        this.decimals = decimals;
        this.closeAuthority = closeAuthority || false;
        this.nonTransferable = nonTransferable || false;
        this.feeConfig = { 
            feeBasisPoints: feeBasisPoints || 0,
            maxFee: maxFee || 0
        }
        this.interestConfig = {
            interestRate: interestRate || 0
        };
    }
}

export async function createMintWithExtensionsTx(connection: Connection, signerPubkey: PublicKey, configData: MintConfigData, mintKeypair?: Signer) : Promise<Transaction> {


    let programId = TOKEN_2022_PROGRAM_ID // New Token-2022 Program Id

    // Set extensions
    let extensions : ExtensionType[] = []
    if (configData.closeAuthority) { extensions.push(ExtensionType.MintCloseAuthority) }
    if (configData.nonTransferable) { extensions.push(ExtensionType.NonTransferable) }
    if (configData.interestConfig.interestRate > 0) { extensions.push(ExtensionType.InterestBearingConfig) }
    if (configData.feeConfig.feeBasisPoints > 0 && configData.feeConfig.maxFee > 0 ) { extensions.push(ExtensionType.TransferFeeConfig) }
    
    // Get space and rent deposit
    let space = getSpace(AccountType.Mint, extensions)
    let lamports = await connection.getMinimumBalanceForRentExemption(space);

    // Build transaction
    let latestBlockHash = await connection.getLatestBlockhash();
    let tx = new Transaction(
        {
            feePayer: signerPubkey,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
        }
    )

    // If no keypair provided, generate one
    mintKeypair? mintKeypair : mintKeypair = Keypair.generate()

    // Instruction to create account
    let createAccountIx = SystemProgram.createAccount({
        fromPubkey: signerPubkey,
        newAccountPubkey: mintKeypair.publicKey,
        space: space,
        lamports: lamports,
        programId: programId
    })
    tx.add(createAccountIx)

    // Instruction for Close Authority of Mint
    if (extensions.includes(ExtensionType.MintCloseAuthority)) {
        let initializeMintCloseAuthorityIx = createInitializeMintCloseAuthorityInstruction(
            mintKeypair.publicKey,
            signerPubkey,
            programId
        )
        tx.add(initializeMintCloseAuthorityIx)
    }

    // Set Transfer Fee
    if (extensions.includes(ExtensionType.TransferFeeConfig)) {
        let initializeTransferFeeConfigIx = createInitializeTransferFeeConfigInstruction(
            mintKeypair.publicKey,
            signerPubkey, // feeUpdateAuthority
            signerPubkey, // withdrayAuthority
            configData.feeConfig.feeBasisPoints, // fee basis point
            BigInt(configData.feeConfig.maxFee), // maximum fee
            programId
        )
        tx.add(initializeTransferFeeConfigIx)
    }


    // Set Non-Transferable Mint
    if (extensions.includes(ExtensionType.NonTransferable)) {
        let nonTransferableMintIx = createInitializeNonTransferableMintInstruction(
            mintKeypair.publicKey,
            programId
        )
        tx.add(nonTransferableMintIx)
    }

    if (extensions.includes(ExtensionType.InterestBearingConfig)) {
        let interestBearingIx = createInitializeInterestBearingMintInstruction(
            mintKeypair.publicKey,
            signerPubkey,
            configData.interestConfig?.interestRate? configData.interestConfig.interestRate : 0,
            programId
        )
        tx.add(interestBearingIx)
    }

    // Intruction to Initialize Mint
    let initializeMint = createInitializeMint2Instruction(
        mintKeypair.publicKey, // mintAccount
        configData.decimals, // decimals
        signerPubkey, // mintAuthority
        signerPubkey, // freezeAuthority
        programId
    )
    tx.add(initializeMint)

    tx.partialSign( mintKeypair )

    return tx

}

export async function createCloseMintTx(authority: PublicKey, mint: PublicKey | string) {

    
    if (typeof mint == 'string') {
        mint = new PublicKey(mint)
    }
    
    let programId = TOKEN_2022_PROGRAM_ID // New Token-2022 Program Id

    let tx = new Transaction()
    tx.add(
        createCloseAccountInstruction(mint, authority, authority, [], programId)
    )

    return tx
}

export function getAta(mint: PublicKey | string, tokenOwner: PublicKey | string) {
    if (typeof mint == 'string') {
        mint = new PublicKey(mint)
    }
    if (typeof tokenOwner == 'string') {
        tokenOwner = new PublicKey(tokenOwner)
    }

    let programId = TOKEN_2022_PROGRAM_ID

    let ata = getAssociatedTokenAddressSync(
        mint as PublicKey,
        tokenOwner as PublicKey,
        false, // false : Allow the owner account to be a PDA (Program Derived Address)
        programId, // programId : SPL Token program account
        // ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId : SPL Associated Token program account
    );


    return ata
}

export function createAtaTx(mint: PublicKey | string, tokenOwner: PublicKey | string, payer: PublicKey | string) {

    if (typeof mint == 'string') {
        mint = new PublicKey(mint)
    }
    if (typeof tokenOwner == 'string') {
        tokenOwner = new PublicKey(tokenOwner)
    }
    if (typeof payer == 'string') {
        payer = new PublicKey(payer)
    }

    let programId = TOKEN_2022_PROGRAM_ID

    let ata = getAta(mint, tokenOwner)

    // Create New Transaction
    let tx = new Transaction()

    tx.add(
        createAssociatedTokenAccountInstruction(
            payer, // PublicKey of payer
            ata, // PublicKey of associatedToken
            tokenOwner, // PublicKey of owner
            mint, // PublicKey of mintAccount
            programId, // programId : SPL Token program account,
            ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId : SPL Associated Token program account
        )
    )

    return tx
}

export async function checkAtaExist(connection: Connection, ata: PublicKey, commitment: Commitment = 'confirmed') {

    let programId = TOKEN_2022_PROGRAM_ID
    
    try {
        await getAccount(connection, ata, commitment, programId);
        return true
    } catch (error: unknown) {
        // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
        // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
        // TokenInvalidAccountOwnerError in this code path.
        return false
    }
}


export async function createMintTokenTx(connection: Connection, mint: PublicKey | string, ata: PublicKey | string, mintAuthority: PublicKey, amount: number){

    if (typeof mint == 'string') {
        mint = new PublicKey(mint)
    }
    if (typeof ata == 'string') {
        ata = new PublicKey(ata)
    }

    let programId = TOKEN_2022_PROGRAM_ID

    // Create New Transaction
    let tx = new Transaction()
    let mintInfo = await getMint(connection, mint, undefined, programId)

    // Add createMintToInstruction
    tx.add(
        createMintToInstruction(
            mint, // PublicKey of mintAccount
            ata, // PublicKey of recipient token account
            mintAuthority, // PublicKey of mintAuthority
            amount * (10**mintInfo.decimals), // number
            [], // no other signers
            programId, // programId : SPL Token program account,
        )
    )

    return tx

}

export async function createTokenTransferTx(connection: Connection, wallet: WalletStore, mint: PublicKey | string, recipient: PublicKey | string, amount: number, commitment: Commitment = 'confirmed'){

    if (typeof mint == 'string') {
        mint = new PublicKey(mint)
    }
    if (typeof recipient == 'string') {
        recipient = new PublicKey(recipient)
    }

    let programId = TOKEN_2022_PROGRAM_ID

    // Create New Transaction
    let tx = new Transaction()

    // Get source ATA
    let tokenSource = getAta(mint, wallet.publicKey!)

    // Get recipient ATA
    let tokenRecipient = getAta(mint, recipient)
    let recipientAtaExist = await checkAtaExist(connection, tokenRecipient)
    if (!recipientAtaExist) {
        tx.add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey!, // PublicKey of payer
                tokenRecipient, // PublicKey of associatedToken
                recipient, // PublicKey of owner
                mint, // PublicKey of mintAccount
                programId, // programId : SPL Token program account,
                ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId : SPL Associated Token program account
            )
        )
    } 

    // Get MintInfo
    let mintInfo = await getMint(
        connection,
        mint,
        commitment,
        programId
    )

    // Check FeeConfig and get transfer amount and fee basis points 
    let feeConfig = getTransferFeeConfig(mintInfo)
    let transferAmount = BigInt(amount * 10**mintInfo.decimals)
    let fee = (transferAmount * BigInt(feeConfig!.newerTransferFee.transferFeeBasisPoints)) / BigInt(10000)

    let transferCheckedIx = createTransferCheckedWithFeeInstruction(
        tokenSource,
        mint,
        tokenRecipient,
        wallet.publicKey!,
        transferAmount,
        mintInfo.decimals,
        fee,
        [],
        programId
    )


    // Add createMintToInstruction
    tx.add(
        transferCheckedIx
    )

    return tx

}