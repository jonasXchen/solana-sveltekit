
import { Connection, Keypair, PublicKey, Transaction, clusterApiUrl, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { sendSoulboundNftIx } from './sendSoulboundNftIx';
import { json } from '@sveltejs/kit';
import { PUBLIC_MERCHANT_PUBKEY } from '$env/static/public'
import { PRIVATE_MERCHANT_PRIVATE_KEY, PRIVATE_SOL_RPC } from '$env/static/private'
import { createSplTransferTx } from '$lib/utils/tokenProgram2022';
import { getFirstValueInArray, verifyMintInJson } from './jsonVerifications';

const MERCHANT_PUBKEY = new PublicKey(PUBLIC_MERCHANT_PUBKEY);
const MERCHANT_PRIVATE_KEY = new Uint8Array(JSON.parse(PRIVATE_MERCHANT_PRIVATE_KEY))
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")

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

  // Account provided in the transaction request body by the wallet.
  let accountField = body.account;
  if (!accountField) throw new Error('missing account');
  if (typeof accountField !== 'string') throw new Error('invalid account');
  let account = new PublicKey(accountField);


  let connection = new Connection("https://rpc.helius.xyz/?api-key=72d348d8-4037-4fe1-a4d3-fe9e271be940", 'processed')
  let filePath = "static/collections/3XnRrwPUDZ7bSGs8MJDzUzXZ1MnuKze1M6T7RvjAmrp5.json"
  let mintKey = "mints"
  let signerKey = "signers"
  // let mintAddress = getFirstValueInArray(filePath, mintKey, signerKey, account.toString())
  let mintAddress = "4UbLfhxZTQASUa1xP6u24BY4RVJLCPHAt7Px4ydw8Nvs"

  let mint = new PublicKey(mintAddress)

  let signer = Keypair.fromSecretKey( MERCHANT_PRIVATE_KEY )

  console.log(`Signer: ${signer.publicKey.toString()}, Account: ${account}, Mint: ${mint}, Recipient: ${recipient}, amount: ${amount}, Merchant: ${MERCHANT_PUBKEY}` )


  // Create Transfer Instruction based on provided token, if not then SOL Transfer
  let transferIxArray: TransactionInstruction[] = (await createSplTransferTx(connection, mint, account, amount, recipient, MERCHANT_PUBKEY, undefined, undefined, TOKEN_PROGRAM_ID)).instructions
  // let transferIxArray: TransactionInstruction[] = await sendSoulboundNftIx(
  //   mint,
  //   MERCHANT_PUBKEY,
  //   account,
  //   [ account ]
  // )

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
  
  // // create memo
  // let memoPubkey = (new Keypair()).publicKey
  // let memoString = JSON.stringify({
  //   identifier: memoPubkey,
  //   signer_pubkey: account
  // })
  // let createMemoIx = new TransactionInstruction(
  //   {
  //     keys: [],
  //     data: Buffer.from(memoString, 'utf8'),
  //     programId: MEMO_PROGRAM_ID
  //   }
  // )
  // tx.add(createMemoIx)

  // Partially sign to take on fees
  tx.partialSign( signer );


  // Serialize partially signed transaction.
  const serializedTransaction = tx.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
  });
  const base64Transaction = serializedTransaction.toString('base64');

  // subscribeAndVerifyOnchain(
  //   connection, 
  //   account, 
  //   memoString, 
  //   undefined, 
  //   () => console.log('done'))

  return json(
    { 
      transaction: base64Transaction,
      message: message
    }
  )
}


let subscribeAndVerifyOnchain = (connection: Connection, account: PublicKey, memoString: string, timer: number = 1000 * 60 * 2, callback: (...args: any) => any) => {

  // Execution Time Start
  const startTime = new Date().getTime();

  // Status of verification 
  let status : boolean = false

  let logId = connection.onLogs(account, (logs) => {

    console.log(logs)
    status = logs.logs.some(item => item.replace(/\\/g, '').includes(memoString));

    if (status) {
      connection.removeOnLogsListener(logId)
      const executionTime = new Date().getTime() - startTime
      console.log(`Verified listening in ${executionTime}ms, closing listening on ${account.toString()}: `, logId)
      callback()
    }
  });
  // Indicate listening of account logs
  console.log(`Listening logs on ${account.toString()}: `, logId)

  // If status still false, remove Listener after timer
  setTimeout(() => {
    if (!status) {
      connection.removeOnLogsListener(logId)
      console.log(`${timer}ms timeout over: Closing listening logs on ${account.toString()}: ${logId}`)
    }
  }, timer)
 

}