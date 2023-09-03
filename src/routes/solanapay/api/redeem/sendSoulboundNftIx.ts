import type { PublicKey} from "@solana/web3.js"
import { createSetAuthorityTx, getAta } from "$lib/utils/tokenProgram2022"
import { AuthorityType, TOKEN_PROGRAM_ID } from "@solana/spl-token"


export let sendSoulboundNftIx = (mint: PublicKey, sender: PublicKey, recipient: PublicKey, multiSigners: PublicKey[] = []) => {

    let ata = getAta(mint, sender, TOKEN_PROGRAM_ID)
    let createSetOwnershipIx = createSetAuthorityTx(ata, sender, AuthorityType.AccountOwner, recipient, multiSigners, TOKEN_PROGRAM_ID).instructions

    let ixArray = [ 
        ...createSetOwnershipIx
    ]

    return ixArray

}
