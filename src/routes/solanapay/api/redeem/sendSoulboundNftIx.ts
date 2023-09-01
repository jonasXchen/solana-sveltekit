import { PublicKey, Cluster, Connection, clusterApiUrl, Signer, Transaction } from "@solana/web3.js"
import { 
    Metaplex, 
    freezeDelegatedNftBuilder,
    approveTokenDelegateAuthorityBuilder,
    transferNftBuilder
} from "@metaplex-foundation/js"
import { createFreezeDelegatedAccountInstruction, createTransferInstruction } from "@metaplex-foundation/mpl-token-metadata"


export let sendSoulboundNftIx = (connection: Connection, mintAddress: PublicKey, delegateAuthority: PublicKey, sender: PublicKey, recipient: PublicKey, signer: Signer) => {
    // Connect to cluster, rpc node, and set up metaplex client
    const metaplex = Metaplex.make(connection)

    let approveFreezeAuthorityIx = approveTokenDelegateAuthorityBuilder(
        metaplex,
        {
            mintAddress,
            delegateAuthority
        }
    ).getInstructions()

    createFreezeDelegatedAccountInstruction
    createTransferInstruction

    let sendNftIx = transferNftBuilder(metaplex,
        {
            nftOrSft: {
                address: mintAddress,
                tokenStandard: 0
            },
            authority: signer,
            fromOwner: sender,
            toOwner: recipient
        }
    ).getInstructions()

    let freezeNftIx = freezeDelegatedNftBuilder(
        metaplex,
        {
            mintAddress,
            delegateAuthority: signer
        }
    ).getInstructions()

    let ixArray = [ ...sendNftIx]

    return ixArray

}
