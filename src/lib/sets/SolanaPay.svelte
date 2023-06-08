<script lang=ts>
    import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
    import { PublicKey, Keypair } from '@solana/web3.js';
    import type { Amount, References } from '@solana/pay';
    import type QRCodeStyling from '@solana/qr-code-styling';
    import BigNumber from 'bignumber.js';
    
    import { createTxRequestQr } from '../utils/createSolanaPayQR';

    import Button from '../components/Button.svelte';
    import Select from '../components/Select.svelte';
    import { cluster } from '$lib/stores'

    
    import { PUBLIC_SOLANAPAY_ENDPOINT, PUBLIC_USDC_DEV_MINT, PUBLIC_MERCHANT_PUBKEY } from '$env/static/public'
    import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

    let programs = [ TOKEN_PROGRAM_ID.toString(), TOKEN_2022_PROGRAM_ID.toString()]
    
    let link : URL = new URL(PUBLIC_SOLANAPAY_ENDPOINT)
    let recipient : PublicKey | string = new PublicKey(PUBLIC_MERCHANT_PUBKEY as String);
    let amount : Amount = BigNumber(1)
    let splToken : PublicKey = new PublicKey(PUBLIC_USDC_DEV_MINT as String);
    let reference : References = Keypair.generate().publicKey
    let label : string = "Product A"
    let message : string = "Thank you very much!"
    let memo : string = "test memo"

    let programSelected : string = programs[0]
    function updateProgram(){
        programSelected = programSelected
    }


    let txFields : any = {
        link,
        label,
        message,
        recipient,
        amount,
        splToken,
        reference,
        memo,
        cluster: $cluster,
        programId: programSelected
    }

    let QR: string | URL | QRCodeStyling
    let QR_str: string | URL | QRCodeStyling
    let url: string | URL | QRCodeStyling
    async function displayQR() {
        txFields = {
            link,
            label,
            message,
            recipient,
            amount,
            splToken,
            reference,
            memo,
            cluster: $cluster,
            programId: programSelected
        };
        [ QR, QR_str, url ] = await createTxRequestQr(txFields, 200)
        // [ QR, QR_str, url ] = await createTransferRequestQr(transferFields, 200)
    }


</script>

<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
    <h1>Transfer Tokens with SolanaPay QR</h1>
    <div class="grid grid-cols-1 space-y-4">
		<!-- User Input -->
        <Select label='Program' options={programs} bind:bindValue={programSelected} onChange={updateProgram} />
		<div>
			<label for="Product">Label</label>
			<input class="text-black w-full" bind:value={label} placeholder="Specify product">
		</div>
        <div>
			<label for="Amount">Token Mint</label>
			<input class="text-black w-full" bind:value={splToken} placeholder="Specify mint address">
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