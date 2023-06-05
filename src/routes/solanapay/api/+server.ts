import * as dotenv from 'dotenv'
import { clusterApiUrl, Connection, Keypair, PublicKey, Transaction, type Signer } from '@solana/web3.js';
import { createTransferCheckedInstruction, getAccount, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { connectedCluster } from '$lib/stores';
import { createSplTransferIx } from '$lib/utils/createSplTransferIx'
import { json } from '@sveltejs/kit';

dotenv.config()
const connection = new Connection(`${process.env.HTTPS_RPC_ENDPOINT}`, 'confirmed')
const splToken = new PublicKey(process.env.USDC_MINT as String);
const MERCHANT_WALLET = new PublicKey(process.env.MERCHANT_WALLET as String);
const LOCAL_KEYPAIR = Uint8Array.from(process.env.LOCAL_KEYPAIR! as unknown as number[])


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
  const splTransferIx = await createSplTransferIx(sender, connection, splToken, MERCHANT_WALLET);

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
