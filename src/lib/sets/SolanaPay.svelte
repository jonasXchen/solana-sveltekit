<script lang=ts>
    import { encodeURL, createQR, type Amount } from '@solana/pay'
    import { PublicKey, Keypair } from '@solana/web3.js';
  
    import BigNumber from 'bignumber.js';
    import Button from '../components/Button.svelte'

    import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
    import { PUBLIC_SOLANAPAY_ENDPOINT, PUBLIC_USDC_DEV_MINT, PUBLIC_MERCHANT_WALLET } from '$env/static/public'



    let QR
    let url : URL = new URL(PUBLIC_SOLANAPAY_ENDPOINT)
    let recipient : PublicKey | string = new PublicKey(PUBLIC_MERCHANT_WALLET as String);
    let amount : Amount = BigNumber(1)
    let splToken : PublicKey = new PublicKey(PUBLIC_USDC_DEV_MINT as String);
    let reference = Keypair.generate()
    let label : string = 'Product A'
    let message : string = "Thank you very much!"
    let memo : string


    async function displayQR() {

        url =  encodeURL( {
            link: url,
            label: label,
            recipient: new PublicKey(recipient),
            amount: new BigNumber(amount),
            message: message,
            memo: "test" as string,
            // splToken: splToken,
            // reference: reference
        }
        )

        QR = createQR(url, 200)
        await QR._getElement()
        QR_str = QR._svg?.outerHTML as string


        return QR
    }

    let QR_str: string


</script>

<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
    <div class="grid grid-cols-1 space-y-4">

		<!-- User Input -->
		<div>
			<label for="Product">Product</label>
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
            <Button label='Create QR' onClick={() => displayQR()}/>
            <Button label='Copy Wallet' styling='bg-blue-600' onClick={() => recipient = $walletStore.publicKey || ''}/>
            {#if (QR)}
                {@html `${QR_str}`} 
                {url}
            {/if}
        </div>

    </div>

</section>