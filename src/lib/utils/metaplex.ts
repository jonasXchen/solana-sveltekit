import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { PROGRAM_ID, createBurnNftInstruction, type BurnNftInstructionAccounts } from "@metaplex-foundation/mpl-token-metadata";
import { TOKEN_PROGRAM_ID, createBurnInstruction } from "@solana/spl-token";
import { PublicKey, type Connection } from "@solana/web3.js";



export let getNftsByUser = async (connection: Connection, user: PublicKey) => {

  const metaplex = new Metaplex(connection);

  let allTokenAccountsByOwner = await connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    {
      filters: [
        {
          dataSize: 165,
        },
        {
          memcmp: {
            offset: 32,
            bytes: user.toString(),
          },
        },
        {
          memcmp: {
            offset: 64,
            bytes: "2",
          },
        },
      ],
    }
  );
  console.log(allTokenAccountsByOwner)
  let nftDetailsArray = []
  for (let tokenAccount of allTokenAccountsByOwner) {
    console.log(tokenAccount)
    let token = tokenAccount.pubkey as PublicKey;
    let nft = await metaplex.nfts().findByToken({ token });
    let response = await fetch(nft.uri);
    let json = await response.json();
    let nftDetails = {
        nft,
        json
    }
    nftDetailsArray.push(nftDetails)

  }

  return nftDetailsArray;
};


export let getBurnNftIx = async (connection: Connection, token: PublicKey) => {

    let metaplex = new Metaplex(connection);
    let nft = await metaplex.nfts().findByToken( { token } )

    let accounts : BurnNftInstructionAccounts = {
        metadata: new PublicKey(nft.metadataAddress),
        mint: new PublicKey(nft.mint.address),
        owner: new PublicKey(nft.token.ownerAddress),
        tokenAccount: new PublicKey(nft.token.address),
        masterEditionAccount: new PublicKey(nft.mint.mintAuthorityAddress!),
        splTokenProgram: TOKEN_PROGRAM_ID
    }

    let burnIx = createBurnNftInstruction(accounts)

    return burnIx

}