
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createSplTransferIx } from '$lib/utils/createSplTransferIx'
import { json } from '@sveltejs/kit';
import { PUBLIC_HTTPS_RPC_ENDPOINT, PUBLIC_USDC_DEV_MINT, PUBLIC_MERCHANT_PUBKEY } from '$env/static/public'
import { PRIVATE_MERCHANT_PRIVATE_KEY } from '$env/static/private'
import { createTransfer } from '@solana/pay'
import BigNumber from 'bignumber.js';

const connection = new Connection(`${PUBLIC_HTTPS_RPC_ENDPOINT}`, 'confirmed')
const splToken = new PublicKey(PUBLIC_USDC_DEV_MINT as String);
const MERCHANT_PUBKEY = new PublicKey(PUBLIC_MERCHANT_PUBKEY);
const MERCHANT_PRIVATE_KEY = new Uint8Array(JSON.parse(PRIVATE_MERCHANT_PRIVATE_KEY))

/** @type {import('@sveltejs/kit').RequestHandler} */
export function GET( event : any ) {

  const label = "Metacamp"; 
  const icon = 'https://uploads-ssl.webflow.com/628b99344f25667e77da83cf/62c3a95fc598e35cf796a1f2_Asset%209%403x.png'

  return json(
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        label,
        icon,
        splToken,
        MERCHANT_PUBKEY
      }
    }
  )
}


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST( event : any ) {


  const body = await event.request.json()
  const urlParams = event.url.searchParams
  console.log(event)
  console.log(event.url)

  const recipientField = urlParams.get('recipient');
  if (!recipientField) throw new Error('missing recipient');
  if (typeof recipientField !== 'string') throw new Error('invalid recipient');
  const recipient = new PublicKey(recipientField);

  const amountField = urlParams.get('amount');
  if (!amountField) throw new Error('missing amount');
  if (typeof amountField !== 'string') throw new Error('invalid amount');
  const amount = new BigNumber(amountField);

  const splTokenField = urlParams.get('spl-token');
  if (splTokenField && typeof splTokenField !== 'string') throw new Error('invalid spl-token');
  const splToken = splTokenField ? new PublicKey(splTokenField) : undefined;

  const referenceField = urlParams.get('reference');
  if (!referenceField) throw new Error('missing reference');
  if (typeof referenceField !== 'string') throw new Error('invalid reference');
  const reference = new PublicKey(referenceField);

  const memoParam = urlParams.get('memo');
  if (memoParam && typeof memoParam !== 'string') throw new Error('invalid memo');
  const memo = memoParam || undefined;

  const messageParam = urlParams.get('message');
  if (messageParam && typeof messageParam !== 'string') throw new Error('invalid message');
  const message = messageParam || undefined;

  // Account provided in the transaction request body by the wallet.
  const accountField = body.account;
  if (!accountField) throw new Error('missing account');
  if (typeof accountField !== 'string') throw new Error('invalid account');
  const account = new PublicKey(accountField);



  // const splTransferIx = await createSplTransferIx(connection, splToken, sender, amount, MERCHANT_WALLET);
  const tx = await createTransfer(
    connection,
    account, 
    {
      recipient,
      splToken,
      amount,
      reference,
      memo
    }
  )

  // Update fee payer
  tx.feePayer = MERCHANT_PUBKEY

  // Get latest blockchash and block height
  let latestBlockHash = await connection.getLatestBlockhash();
  tx.recentBlockhash = latestBlockHash.blockhash;
  tx.lastValidBlockHeight = latestBlockHash.lastValidBlockHeight

  // Partially sign to take on fees
  let signer = Keypair.fromSecretKey( MERCHANT_PRIVATE_KEY )
  tx.partialSign( signer );


  // Serialize and return the unsigned transaction.
  const serializedTransaction = tx.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
  });

  const base64Transaction = serializedTransaction.toString('base64');

  return json(
    { 
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        transaction: base64Transaction,
        message: message
      }
    }
  )
}
