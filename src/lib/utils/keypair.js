import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58'

// Create a new keypair
const keypair = Keypair.generate();
// @ts-ignore
console.log(bs58.encode(keypair.secretKey))
console.log(keypair.publicKey.toString())
