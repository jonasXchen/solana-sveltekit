import { json } from '@sveltejs/kit';

import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { HTTPS_RPC_ENDPOINT } from '$env/static/private'

const connection = new Connection(`${HTTPS_RPC_ENDPOINT}`, 'confirmed')
console.log(connection)

/** @type {import('./$types').RequestHandler} */
export function GET(event) {
    // log all headers
    console.log(...event.request.headers);

    return json({
        // retrieve a specific header
        userAgent: event.request.headers.get('user-agent')
    });
}