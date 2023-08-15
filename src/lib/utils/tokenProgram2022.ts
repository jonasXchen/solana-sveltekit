import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    Keypair,
    type Signer,
    type Commitment,
    TransactionInstruction
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
    createMintToCheckedInstruction,
    createTransferCheckedWithFeeInstruction,
    getAssociatedTokenAddressSync,
    getAccount,
    getMint,
    getTransferFeeConfig,
    createTransferCheckedInstruction
} from "@solana/spl-token"

       
enum AccountType {
    Mint,
    Token
}

export let getSpace = (accountType: AccountType, extensions: ExtensionType[]) : number => {
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

export let createMint2Tx = async (connection: Connection, signerPubkey: PublicKey, configData: MintConfigData, mintKeypair?: Signer, programId: PublicKey = TOKEN_2022_PROGRAM_ID) : Promise<Transaction> => {


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


export let createCloseMintTx = async (authority: PublicKey, mint: PublicKey | string, programId: PublicKey = TOKEN_2022_PROGRAM_ID) => {

    
    if (typeof mint == 'string') {
        mint = new PublicKey(mint)
    }

    let tx = new Transaction()
    tx.add(
        createCloseAccountInstruction(mint, authority, authority, [], programId)
    )

    return tx
}


export let getAta = (mint: PublicKey | string, tokenOwner: PublicKey | string, programId: PublicKey = TOKEN_2022_PROGRAM_ID) => {
    if (typeof mint == 'string') {
        mint = new PublicKey(mint)
    }
    if (typeof tokenOwner == 'string') {
        tokenOwner = new PublicKey(tokenOwner)
    }

    // Check Ata and find Ata if needed
    let ata
    if(PublicKey.isOnCurve(tokenOwner.toBuffer())) {
        ata = getAssociatedTokenAddressSync(
            mint as PublicKey,
            tokenOwner as PublicKey,
            false, // false : Allow the owner account to be a PDA (Program Derived Address)
            programId, // programId : SPL Token program account
            ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId : SPL Associated Token program account
        );
    } else {
        ata = tokenOwner
    }


    return ata
}


export let createAtaTx = (mint: PublicKey | string, tokenOwner: PublicKey | string, payer: PublicKey | string, programId: PublicKey = TOKEN_2022_PROGRAM_ID) => {

    if (typeof mint == 'string') {
        mint = new PublicKey(mint)
    }
    if (typeof tokenOwner == 'string') {
        tokenOwner = new PublicKey(tokenOwner)
    }
    if (typeof payer == 'string') {
        payer = new PublicKey(payer)
    }

    let ata = getAta(mint, tokenOwner, programId)

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


export let checkAtaExist = async (connection: Connection, ata: PublicKey, commitment: Commitment = 'confirmed', programId: PublicKey = TOKEN_2022_PROGRAM_ID) => {
    
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



export let createMintTokenTx = async (connection: Connection, mint: PublicKey | string, recipient: PublicKey | string, mintAuthority: PublicKey, amount: number, programId: PublicKey = TOKEN_2022_PROGRAM_ID) => {

    if (typeof mint == 'string') {
        mint = new PublicKey(mint)
    }
    if (typeof recipient == 'string') {
        recipient = new PublicKey(recipient)
    }

    // Create New Transaction
    let tx = new Transaction()
    let mintInfo = await getMint(connection, mint, undefined, programId)
    let ata : PublicKey = recipient


    // Check ata, create ata if needed
    if (PublicKey.isOnCurve(recipient)) {
        ata = getAta(mint, recipient, programId)
        tx.add(
            createAssociatedTokenAccountInstruction(
                mintAuthority, // PublicKey of payer
                ata, // PublicKey of associatedToken
                recipient, // PublicKey of owner
                mint, // PublicKey of mintAccount
                programId, // programId : SPL Token program account,
                ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId : SPL Associated Token program account
            )
        )
    } 


    // Add createMintToInstruction
    tx.add(
        createMintToCheckedInstruction(
            mint, // PublicKey of mintAccount
            ata, // PublicKey of recipient token account
            mintAuthority, // PublicKey of mintAuthority
            amount * (10**mintInfo.decimals), // amount
            mintInfo.decimals, // decimals
            [], // no other signers
            programId, // programId : SPL Token program account,
        )
    )

    return tx

}


export let createSplTransferTx = async (connection: Connection, mint: PublicKey | string, sender: PublicKey, amount: number, recipient: PublicKey | string, payer: PublicKey = sender, references? : PublicKey[], commitment: Commitment = 'confirmed', programId: PublicKey = TOKEN_2022_PROGRAM_ID) => {

    if (typeof mint == 'string') {
        mint = new PublicKey(mint)
    }
    if (typeof recipient == 'string') {
        recipient = new PublicKey(recipient)
    }

    // Create New Transaction
    let tx = new Transaction()

    // Get source ATA
    let tokenSource = getAta(mint, sender, programId)

    // Get recipient ATA
    let tokenRecipient = getAta(mint, recipient, programId)
    let recipientAtaExist = await checkAtaExist(connection, tokenRecipient, commitment, programId)
    if (!recipientAtaExist) {
        tx.add(
            createAssociatedTokenAccountInstruction(
                payer, // PublicKey of payer
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
    let transferCheckedIx : TransactionInstruction

    if (feeConfig === null) {
        transferCheckedIx = createTransferCheckedInstruction(
            tokenSource,
            mint,
            tokenRecipient,
            sender,
            transferAmount,
            mintInfo.decimals,
            [],
            programId
        )

        // add references to the instruction
        if (!(references === undefined)) {
            for (const pubkey of references) {
                transferCheckedIx.keys.push({ pubkey, isWritable: false, isSigner: false });
            }
        }
                
        tx.add(
            transferCheckedIx
        )

    } else {
        let fee = ((transferAmount * BigInt(feeConfig!.newerTransferFee.transferFeeBasisPoints)) / BigInt(10_000) > feeConfig!.newerTransferFee.maximumFee) ? (feeConfig!.newerTransferFee.maximumFee) : ((transferAmount * BigInt(feeConfig!.newerTransferFee.transferFeeBasisPoints)) / BigInt(10_000))

        transferCheckedIx = createTransferCheckedWithFeeInstruction(
            tokenSource,
            mint,
            tokenRecipient,
            sender,
            transferAmount,
            mintInfo.decimals,
            fee,
            undefined,
            programId
        )
        
        tx.add(
            transferCheckedIx
        )
    }

    return tx

}