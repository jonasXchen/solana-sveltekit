"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bs58 = require("bs58");
var web3_js_1 = require("@solana/web3.js");
var args = process.argv.slice(2);
var secret = bs58.decode(args[0]);
console.log(web3_js_1.Keypair.fromSecretKey(new Uint8Array(secret)).publicKey.toString());
console.log(web3_js_1.Keypair.fromSecretKey(new Uint8Array(secret)).secretKey.toString());
