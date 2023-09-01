
import { Connection, Keypair, PublicKey, Transaction, clusterApiUrl, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { sendSoulboundNftIx } from './sendSoulboundNftIx';

import { json } from '@sveltejs/kit';
import { PUBLIC_MERCHANT_PUBKEY } from '$env/static/public'
import { PRIVATE_MERCHANT_PRIVATE_KEY, PRIVATE_SOL_RPC } from '$env/static/private'

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
  let clusterParam = urlParams.get('cluster') || undefined;
  let connection : Connection
  if (clusterParam === 'mainnet-beta') {
    connection = new Connection(PRIVATE_SOL_RPC, 'confirmed')
  } else if (clusterParam === ('devnet'|| 'testnet')) {
    connection = new Connection(clusterApiUrl(clusterParam), 'confirmed')
  } else throw new Error('invalid cluster');
  
  let splTokenParam = urlParams.get('splToken');
  let splToken : PublicKey | undefined
  if (splTokenParam === '') { 
    splToken = undefined 
  } else {
    splToken = new PublicKey(splTokenParam) || undefined ;
  }
  
  let programParam = urlParams.get('programId');
  if (programParam && typeof programParam !== 'string') throw new Error('invalid program');
  let programId = new PublicKey(programParam) || TOKEN_PROGRAM_ID;


  let labelParam = urlParams.get('label');
  if (labelParam && typeof labelParam !== 'string') throw new Error('invalid label');
  let label = labelParam || undefined;

  let messageParam = urlParams.get('message');
  if (messageParam && typeof messageParam !== 'string') throw new Error('invalid message');
  let message = messageParam || undefined;

  let amountParam = urlParams.get('amount');
  if (!amountParam) throw new Error('missing amount');
  if (typeof amountParam !== ('string' || 'number')) throw new Error('invalid amount');
  let amount = amountParam ;

  let recipientParam = urlParams.get('recipient');
  if (!recipientParam) throw new Error('missing recipient');
  if (typeof recipientParam !== 'string') throw new Error('invalid recipient');
  let recipient = new PublicKey(recipientParam);

  let referenceParam = urlParams.get('reference');
  if (typeof referenceParam !== 'string') throw new Error('invalid reference');
  let reference = new PublicKey(referenceParam);

  let memoParam = urlParams.get('memo');
  if (memoParam && typeof memoParam !== 'string') throw new Error('invalid memo');
  let memo = memoParam || undefined;


  let signer = Keypair.fromSecretKey( MERCHANT_PRIVATE_KEY )

  // Account provided in the transaction request body by the wallet.
  let accountField = body.account;
  if (!accountField) throw new Error('missing account');
  if (typeof accountField !== 'string') throw new Error('invalid account');
  let account = new PublicKey(accountField);
  
  // Create Transfer Instruction based on provided token, if not then SOL Transfer
  let transferIxArray: TransactionInstruction[] = sendSoulboundNftIx(
    connection,
    new PublicKey("4pDX2Gp9w83BtUez6TTu3xn8jh4QBETH8qwD6jNJjqNd"),
    MERCHANT_PUBKEY,
    MERCHANT_PUBKEY,
    recipient,
    signer
  )

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
  tx.partialSign( signer );


  // Serialize partially signed transaction.
  const serializedTransaction = tx.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
  });
  const base64Transaction = serializedTransaction.toString('base64');

}


