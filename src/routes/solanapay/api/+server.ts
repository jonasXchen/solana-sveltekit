
import { Connection, Keypair, PublicKey, Transaction, clusterApiUrl, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { createSplTransferTx } from '$lib/utils/tokenProgram2022'

import { json } from '@sveltejs/kit';
import { PUBLIC_MERCHANT_PUBKEY } from '$env/static/public'
import { PRIVATE_MERCHANT_PRIVATE_KEY } from '$env/static/private'

const MERCHANT_PUBKEY = new PublicKey(PUBLIC_MERCHANT_PUBKEY);
const MERCHANT_PRIVATE_KEY = new Uint8Array(JSON.parse(PRIVATE_MERCHANT_PRIVATE_KEY))

/** @type {import('@sveltejs/kit').RequestHandler} */
export function GET( event : any ) {

  let label = "Metacamp"; 
  let icon = 'https://uploads-ssl.webflow.com/628b99344f25667e77da83cf/64808c645294d986358b6b19_Metacamp%20Logo.png'

  return json(
    {
      label,
      icon
    }
  )
}


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST( event : any ) {

  let body = await event.request.json()
  let urlParams = event.url.searchParams

  // Get and make checks on parameters
  const clusterParam = urlParams.get('cluster');
  if (!(clusterParam === ('devnet' || 'mainnet-beta' || 'testnet'))) throw new Error('invalid cluster');
  const cluster = clusterParam || undefined;
  const connection = new Connection(clusterApiUrl(cluster))
  
  const splTokenParam = urlParams.get('splToken');
  let splToken : PublicKey | undefined
  if (splTokenParam === '') { 
    splToken = undefined 
  } else {
    splToken = new PublicKey(splTokenParam) || undefined ;
  }
  
  const programParam = urlParams.get('programId');
  if (programParam && typeof programParam !== 'string') throw new Error('invalid program');
  const programId = new PublicKey(programParam) || TOKEN_PROGRAM_ID;


  const labelParam = urlParams.get('label');
  if (labelParam && typeof labelParam !== 'string') throw new Error('invalid label');
  const label = labelParam || undefined;

  const messageParam = urlParams.get('message');
  if (messageParam && typeof messageParam !== 'string') throw new Error('invalid message');
  const message = messageParam || undefined;

  const amountParam = urlParams.get('amount');
  if (!amountParam) throw new Error('missing amount');
  if (typeof amountParam !== ('string' || 'number')) throw new Error('invalid amount');
  const amount = amountParam ;

  const recipientParam = urlParams.get('recipient');
  if (!recipientParam) throw new Error('missing recipient');
  if (typeof recipientParam !== 'string') throw new Error('invalid recipient');
  const recipient = new PublicKey(recipientParam);

  const referenceParam = urlParams.get('reference');
  if (typeof referenceParam !== 'string') throw new Error('invalid reference');
  const reference = new PublicKey(referenceParam);

  const memoParam = urlParams.get('memo');
  if (memoParam && typeof memoParam !== 'string') throw new Error('invalid memo');
  const memo = memoParam || undefined;



  // Account provided in the transaction request body by the wallet.
  const accountField = body.account;
  if (!accountField) throw new Error('missing account');
  if (typeof accountField !== 'string') throw new Error('invalid account');
  const account = new PublicKey(accountField);
  
  // Create Transfer Instruction based on provided token, if not then SOL Transfer
  let transferIxArray: TransactionInstruction[] = []
  if (!(splToken === undefined)) {
    transferIxArray = (await createSplTransferTx(connection, splToken, account, amount, recipient, MERCHANT_PUBKEY, [reference], undefined, programId)).instructions
  } else {
    transferIxArray = [ 
      SystemProgram.transfer( {
        fromPubkey: account,
        toPubkey: recipient,
        lamports: amount * LAMPORTS_PER_SOL
      })
    ]
  }

  // Get latest blockchash and block height
  let latestBlockHash = await connection.getLatestBlockhash();

  // Create tx with recent blockhash and splTransferIx
  let tx = new Transaction( 
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      feePayer: MERCHANT_PUBKEY,
    }
  )
  tx.add(...transferIxArray)

  // Partially sign to take on fees
  let signer = Keypair.fromSecretKey( MERCHANT_PRIVATE_KEY )
  tx.partialSign( signer );


  // Serialize partially signed transaction.
  const serializedTransaction = tx.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
  });
  const base64Transaction = serializedTransaction.toString('base64');

  return json(
    { 
      transaction: base64Transaction,
      message: message
    }
  )
}
