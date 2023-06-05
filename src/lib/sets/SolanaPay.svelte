<script lang=ts>
    import { cluster, connectedCluster } from '$lib/stores'
    import { encodeURL, createQR, parseURL, type Amount } from '@solana/pay'
    import { PublicKey, Transaction, Keypair } from '@solana/web3.js';
    import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
  
    import BigNumber from 'bignumber.js';
    import Button from '../components/Button.svelte'


    let QR
    // let url : URL = new URL(`solana:${process.env.SOLANAPAY_ENDPOINT}`)
    let url : URL = new URL(`https://solana-sveltekit-jonasxchen.vercel.app/solanapay/api`)
    let recipient : string
    let amount : Amount
    // let splToken : PublicKey = new PublicKey(process.env.USDC_DEV_MINT)
    let splToken : PublicKey = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr')
    let reference = Keypair.generate()
    let label : string
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
            {#if (QR)}
                {@html `${QR_str}`} 
                {url}
            {/if}
        </div>

    </div>

</section>