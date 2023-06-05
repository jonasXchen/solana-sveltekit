import { json } from '@sveltejs/kit';

import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import * as dotenv from 'dotenv'
dotenv.config()

const connection = new Connection(`${process.env.HTTPS_RPC_ENDPOINT}`, 'confirmed')

/** @type {import('./$types').RequestHandler} */
export function GET(event) {
    // log all headers
    console.log(...event.request.headers);

    return json({
        // retrieve a specific header
        userAgent: event.request.headers.get('user-agent')
    });
}