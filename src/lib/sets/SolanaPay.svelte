<script lang=ts>
    import type { Amount, References, Memo, TransactionRequestURLFields, TransferRequestURLFields } from '@solana/pay';
    import { createTransferRequestQr, createTxRequestQr, type ExtendedTxRequestURLFields } from '../utils/createSolanaPayQR'
    import type QRCodeStyling from '@solana/qr-code-styling';
    import { PublicKey, Keypair } from '@solana/web3.js';
  
    import BigNumber from 'bignumber.js';
    import Button from '../components/Button.svelte'

    import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
    import { PUBLIC_SOLANAPAY_ENDPOINT, PUBLIC_USDC_DEV_MINT, PUBLIC_MERCHANT_WALLET } from '$env/static/public'

    let link : URL = new URL(PUBLIC_SOLANAPAY_ENDPOINT)
    let recipient : PublicKey | string = new PublicKey(PUBLIC_MERCHANT_WALLET as String);
    let amount : Amount = BigNumber(1)
    let splToken : PublicKey = new PublicKey(PUBLIC_USDC_DEV_MINT as String);
    let reference : References = Keypair.generate().publicKey
    let label : string = "Product A"
    let message : string = "Thank you very much!"
    let memo : string = "test memo"


    let transferFields : TransferRequestURLFields = {
        recipient,
        amount,
        splToken,
        reference,
        label,
        message,
        memo
    }

    let txFields : ExtendedTxRequestURLFields = {
        link,
        label,
        message,
        recipient,
        amount,
        splToken,
        // reference,
        // memo
    }

    let QR: string | URL | QRCodeStyling
    let QR_str: string | URL | QRCodeStyling
    let url: string | URL | QRCodeStyling
    async function displayQR() {
        [ QR, QR_str, url ] = await createTxRequestQr(txFields, 200)
        // [ QR, QR_str, url ] = await createTransferRequestQr(transferFields, 200)
    }

    console.log(url)
    


</script>

<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
    <div class="grid grid-cols-1 space-y-4">

		<!-- User Input -->
		<div>
			<label for="Product">Label</label>
			<input class="text-black w-full" bind:value={label} placeholder="Specify product">
		</div>
        <div>
			<label for="Amount">Amount</label>
			<input class="text-black w-full" bind:value={amount} placeholder="Specify amount">
		</div>
        <div>
			<label for="Recipient">Recipient</label>
			<input class="text-black w-full" bind:value={recipient} placeholder="Specify recipient">
		</div>
        <div>
			<label for="Recipient">Message</label>
			<input class="text-black w-full" bind:value={message} placeholder="Specify recipient">
		</div>
        <div>
            <Button label='Create QR' onClick={() => displayQR()}/>
            <Button label='Copy Wallet' styling='bg-blue-600' onClick={() => recipient = $walletStore.publicKey || ''}/>
            <div class="mt-2">
                {#if (QR)}
                {@html `${QR_str}`} 
                {url}
            {/if}
            </div>
        </div>

    </div>

</section>