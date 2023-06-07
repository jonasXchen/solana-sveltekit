
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { createSplTransferIx } from '$lib/utils/createSplTransferIx'
import { json } from '@sveltejs/kit';
import { PUBLIC_HTTPS_RPC_ENDPOINT, PUBLIC_USDC_DEV_MINT, PUBLIC_MERCHANT_WALLET } from '$env/static/public'
import { PRIVATE_LOCAL_KEYPAIR } from '$env/static/private'

const connection = new Connection(`${PUBLIC_HTTPS_RPC_ENDPOINT}`, 'confirmed')
const splToken = new PublicKey(PUBLIC_USDC_DEV_MINT as String);
const MERCHANT_WALLET = new PublicKey(PUBLIC_MERCHANT_WALLET as String);
const LOCAL_KEYPAIR = Uint8Array.from(PRIVATE_LOCAL_KEYPAIR! as unknown as number[])


/** @type {import('@sveltejs/kit').RequestHandler} */
export function GET( event : any ) {

  const label = "Metacamp"; 
  const icon = 'https://uploads-ssl.webflow.com/628b99344f25667e77da83cf/62c3a95fc598e35cf796a1f2_Asset%209%403x.png'

  return json(
    {
      status: 200,
      headers: {
      },
      body: {
        label,
        icon,
        splToken,
        MERCHANT_WALLET
      }
    }
  )
}


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST( event : any ) {

  // Account provided in the transaction request body by the wallet.
  const accountField = event.request.body?.account;
  if (!accountField) throw new Error('missing account');

  const sender = new PublicKey(accountField);

  // create spl transfer instruction
  let amount = 1
  const splTransferIx = await createSplTransferIx(connection, splToken, sender, amount, MERCHANT_WALLET);

  console.log(splTransferIx)

  // create the transaction
  const latestBlockhash = await connection.getLatestBlockhash()
  const transaction = new Transaction(
    {
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      feePayer: MERCHANT_WALLET
    }
  );

  // add the instruction to the transaction
  transaction.add(splTransferIx);
  transaction.partialSign( Keypair.fromSecretKey( LOCAL_KEYPAIR ) );


  // Serialize and return the unsigned transaction.
  const serializedTransaction = transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
  });

  const base64Transaction = serializedTransaction.toString('base64');
  const message = 'Thank you!';

  return json(
    { status: 201 }
  )
}
