import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  ComputeBudgetProgram,
  Transaction,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Connection,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  IDL as SoulBoundIdl,
  type SoulBoundAuthority,
} from "./_idls/soulBoundAuthority";
import {
  IDL as CardinalStakePoolIdl,
  type CardinalStakePool,
} from "./_idls/cardinalStakePool";
import {
  IDL as CardinalRewardDistributorIdl,
  type CardinalRewardDistributor,
} from "./_idls/cardinalRewardDistributor";


const BN = anchor.BN;

//
// Mainnet stake constants.
//
const STAKE_POOL = new PublicKey(
"7xmGGtuNNvjKLDwbYWBYGPpAjRqftJnrTyzSRK92yku8"
);
//const STAKE_POOL_IDENTIFIER = new PublicKey(
//"E43L3VCJcDqN4pPhhPBiQjSr5A9cBJreTdMDVhWxXVCZ"
//);
const REWARD_DISTRIBUTOR = new PublicKey(
"6DBnpqRm1szSz25dD1aWEmYzgGoMB59Y1GMv2gtWUSM4"
);
const GOLD_MINT = new PublicKey(
"5QPAPkBvd2B7RQ6DBGvCxGdAcyWitdvRAP58CdvBiuf7"
);

//
// Program ids.
//
const SOUL_BOUND_PROGRAM_ID = new PublicKey(
"7DkjPwuKxvz6Viiawtbmb4CqnMKP6eGb1WqYas1airUS"
);
const CARDINAL_REWARD_DISTRIBUTOR_PROGRAM_ID = new PublicKey(
"H2yQahQ7eQH8HXXPtJSJn8MURRFEWVesTd8PsracXp1S"
);
const CARDINAL_STAKE_POOL_PROGRAM_ID = new PublicKey(
"2gvBmibwtBnbkLExmgsijKy6hGXJneou8X6hkyWQvYnF"
);
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

//
// Misc program constants.
//
const AUTHORIZATION_RULES_PROGRAM_ID = new PublicKey(
"auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg"
);
const AUTHORIZATION_RULES = new PublicKey(
"eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9"
);


const connection = new Connection("mainnet-beta");
const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
});
//
// Stake program clients.
//
const SOUL_BOUND_PROGRAM = new Program<SoulBoundAuthority>(
    SoulBoundIdl,
    SOUL_BOUND_PROGRAM_ID,
    provider
);

const REWARD_DISTRIBUTOR_PROGRAM = new Program<CardinalRewardDistributor>(
    CardinalRewardDistributorIdl,
    CARDINAL_REWARD_DISTRIBUTOR_PROGRAM_ID,
    provider
);
    
const STAKE_POOL_PROGRAM = new Program<CardinalStakePool>(
    CardinalStakePoolIdl,
    CARDINAL_STAKE_POOL_PROGRAM_ID,
    provider
);


// Supply is the token supply of the nft mint.
function getStakeSeed(supply: number, user: PublicKey): PublicKey {
if (supply > 1) {
    return user;
} else {
    return PublicKey.default;
}
}



export async function createTransferRewardsTx({
    amount,
    fromUser, // fromUser should be the client payer/signer.
    fromNft,
    toNft,
    goldMint = GOLD_MINT,
    stakePool = STAKE_POOL,
    rewardDistributor = REWARD_DISTRIBUTOR,
    soulboundProgram = SOUL_BOUND_PROGRAM,
    stakePoolProgram = STAKE_POOL_PROGRAM,
    rewardDistributorProgram = REWARD_DISTRIBUTOR_PROGRAM,
  }: {
    amount?: anchor.BN;
    fromUser: PublicKey;
    fromNft: {
      mintAddress: PublicKey;
      metadataAddress: PublicKey;
    };
    toNft: {
      mintAddress: PublicKey;
      metadataAddress: PublicKey;
    };
    goldMint?: PublicKey;
    stakePool?: PublicKey;
    rewardDistributor?: PublicKey;
    soulboundProgram?: Program<SoulBoundAuthority>;
    stakePoolProgram?: Program<CardinalStakePool>;
    rewardDistributorProgram?: Program<CardinalRewardDistributor>;
  }): Promise<Transaction> {




    const toUser = fromUser; // Transfers only allowed between same wallet.
    const [fromSbaUser] = PublicKey.findProgramAddressSync(
      [Buffer.from("sba-scoped-user"), fromUser.toBuffer()],
      soulboundProgram.programId
    );
    const fromScopedSbaUserAuthority = PublicKey.findProgramAddressSync(
      [
        Buffer.from("sba-scoped-user-nft-program"),
        fromUser.toBuffer(),
        fromNft.mintAddress.toBuffer(),
        rewardDistributorProgram.programId.toBuffer(),
      ],
      soulboundProgram.programId
    )[0];
    const fromStakeEntry = PublicKey.findProgramAddressSync(
      [
        Buffer.from("stake-entry"),
        stakePool.toBuffer(),
        fromNft.mintAddress.toBuffer(),
        getStakeSeed(1, fromUser).toBuffer(),
      ],
      stakePoolProgram.programId
    )[0];
    const fromRewardEntry = PublicKey.findProgramAddressSync(
      [
        Buffer.from("reward-entry"),
        rewardDistributor.toBuffer(),
        fromStakeEntry.toBuffer(),
      ],
      rewardDistributorProgram.programId
    )[0];
    const fromScopedSbaUserAuthorityAta = await getAssociatedTokenAddress(
      goldMint,
      fromScopedSbaUserAuthority,
      true
    );

    const toScopedSbaUserAuthority = PublicKey.findProgramAddressSync(
      [
        Buffer.from("sba-scoped-user-nft-program"),
        toUser.toBuffer(),
        toNft.mintAddress.toBuffer(),
        rewardDistributorProgram.programId.toBuffer(),
      ],
      soulboundProgram.programId
    )[0];
    const toStakeEntry = PublicKey.findProgramAddressSync(
      [
        Buffer.from("stake-entry"),
        stakePool.toBuffer(),
        toNft.mintAddress.toBuffer(),
        getStakeSeed(1, toUser).toBuffer(),
      ],
      stakePoolProgram.programId
    )[0];
    const toRewardEntry = PublicKey.findProgramAddressSync(
      [
        Buffer.from("reward-entry"),
        rewardDistributor.toBuffer(),
        toStakeEntry.toBuffer(),
      ],
      rewardDistributorProgram.programId
    )[0];
    const toScopedSbaUserAuthorityAta = await getAssociatedTokenAddress(
      goldMint,
      toScopedSbaUserAuthority,
      true
    );

    const fromNftToken = await getAssociatedTokenAddress(
      fromNft.mintAddress,
      fromUser
    );

    let { data, keys } = await rewardDistributorProgram.methods
      .transferRewards(amount ?? null)
      .accounts({
        rewardEntryA: fromRewardEntry,
        rewardEntryB: toRewardEntry,
        stakeEntryA: fromStakeEntry,
        stakeEntryB: toStakeEntry,
        rewardDistributor,
        stakePool,
        originalMintA: fromNft.mintAddress,
        originalMintB: toNft.mintAddress,
        rewardMint: goldMint,
        user: fromUser,
        userRewardMintTokenAccountA: fromScopedSbaUserAuthorityAta,
        userRewardMintTokenAccountB: toScopedSbaUserAuthorityAta,
        authorityA: fromScopedSbaUserAuthority,
        authorityB: toScopedSbaUserAuthority,
      })
      .instruction();

    // Need to set the signer on the PDA to false so that we can serialize
    // the transaction without error. The CPI in the program will flip this
    // back to true before signging with PDA seeds.
    keys = keys.map((k) => {
      return {
        ...k,
        isSigner: k.pubkey.equals(fromScopedSbaUserAuthority)
          ? false
          : k.isSigner,
      };
    });

    const tx = await soulboundProgram.methods
      .executeTxScopedUserNftProgram(data)
      .accounts({
        sbaUser: fromSbaUser,
        nftToken: fromNftToken,
        nftMint: fromNft.mintAddress,
        authority: fromUser,
        delegate: PublicKey.default, // None.
        authorityOrDelegate: fromUser,
        scopedAuthority: fromScopedSbaUserAuthority,
        program: rewardDistributorProgram.programId,
      })
      .remainingAccounts(keys)
      .transaction();

    // @ts-ignore
    return tx
  }
