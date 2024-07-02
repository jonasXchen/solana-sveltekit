import {
    Connection,
    Transaction,
    SystemProgram,
    PublicKey,
    sendAndConfirmRawTransaction,
    Keypair,
  } from '@solana/web3.js';
  import { withdrawStake } from './index'
  
  const connection = new Connection('RPC_URL');
  const STAKE_POOL = new PublicKey('AZGSr2fUyKkPLMhAW6WUEKEsQiRMAFKf8Fjnt4MFFaGv');
  const secret = [];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = Keypair.fromSecretKey(secretKey);
  
  describe('StakePoolProgram', () => {
    it('should successfully withdraw a stake account', async () => {
      let wallet = new PublicKey('');
  
      let amount = 0.683361986;
  
      let withdrawTx = await withdrawStake(connection, STAKE_POOL, wallet, amount, false);
  
      let max_per_tx = 2;
      let transactions: Transaction[] = [];
      let instructions = withdrawTx.instructions;
  
      withdrawTx.signers.map((val) => console.log(val.publicKey.toBase58()));
  
      for (let i = 0; i < (instructions.length - 1) / 2; i += max_per_tx) {
        if (i == 0) {
          let transaction = new Transaction();
          // INSERT YOUR CODE HERE TO SIGN A TRANSACTION WITH A WALLET
          // transaction = await signTransaction(transaction)
          transaction.add(...instructions.slice(0, 1 + max_per_tx * 2));
          transaction.feePayer = keypairFromSecretKey.publicKey;
          transaction.recentBlockhash = (await connection.getLatestBlockhash('max')).blockhash;
          transaction.sign(keypairFromSecretKey);
  
          let signers = [...withdrawTx.signers.slice(0, 1 + max_per_tx)];
          if (signers.length > 0) {
            transaction.partialSign(...signers);
          }
          transactions.push(transaction);
        } else {
          let transaction = new Transaction();
          transaction.add(...instructions.slice(i * 2 + 1, i * 2 + 1 + max_per_tx * 2));
  
          // INSERT YOUR CODE HERE TO SIGN A TRANSACTION WITH A WALLET
          // transaction = await signTransaction(transaction)
          transaction.feePayer = keypairFromSecretKey.publicKey;
          transaction.recentBlockhash = (await connection.getLatestBlockhash('max')).blockhash;
          transaction.sign(keypairFromSecretKey);
  
          let signers = [
            withdrawTx.signers[0],
            ...withdrawTx.signers.slice(i + 1, i + 1 + max_per_tx),
          ];
          if (signers.length > 0) {
            transaction.partialSign(...signers);
          }
          transactions.push(transaction);
        }
      }
  
      let txids = await Promise.all(
        transactions.map(async (transaction) => {
          return await sendAndConfirmRawTransaction(connection, transaction.serialize());
        }),
      );
      console.log(txids);
    }, 60000);
  });
  