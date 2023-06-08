<script lang=ts>

    // Import Wallet
	import { walletStore, type WalletStore } from "@svelte-on-solana/wallet-adapter-core";

    // Import cluster environment
	import { cluster, connectedCluster } from "$lib/stores";

    // UI Component 
    import Button from '../components/Button.svelte';

    // Web3.js library and transactions
    import type { PublicKey, Connection } from '@solana/web3.js'
    import { createMint2Tx, MintConfigData, getAta, checkAtaExist, createAtaTx, createMintTokenTx, createSplTransferTx } from '../utils/tokenProgram2022'
    import signAndSendTx from '../utils/signAndSendTransaction'
    import { TOKEN_PROGRAM_ID } from "@solana/spl-token";


    // States of Signatures
    let mintSignature : string
    let createTokenAccountSignature : string
    let mintTokenSignature : string
    let transferTokenSignature : string

    // States of Accounts
    let mint :  PublicKey | string
    let tokenOwner :  PublicKey | string 
    let ata : PublicKey
    let recipientOfTransfer :  PublicKey | string
    let programId = TOKEN_PROGRAM_ID

    // States of Token Operations
    let transferAmount : number = 1000  
    let mintAmount : number = 1000000

    // States of Checkboxes for Mint
    let decimals : number = 0


    // Create Mint
    async function createMint(wallet: WalletStore, connection : Connection) {
        
         // Create tx to create mint and sign with wallet and send Transaction
        let configData = new MintConfigData(decimals)
        let tx = await createMint2Tx(connection, wallet.publicKey!, configData, undefined, programId)
        mintSignature = await signAndSendTx(connection, wallet, tx)

        // Set mint
        mint = tx.instructions[0].keys[1].pubkey.toString()        

    }


    // Get or create Associated Token Account
    async function getOrcreateTokenAccount(wallet : WalletStore, connection : Connection, mint: PublicKey | string, tokenOwner : PublicKey | string) {

        // Get ata
        ata = getAta(mint, tokenOwner, programId)

        // Check if ata exists
        let ataExist = await checkAtaExist(connection, ata, undefined, programId)
        if (ataExist == false) {
            // Create tx to create token account and sign with wallet and send Transaction
            let tx = createAtaTx(mint, tokenOwner, wallet.publicKey!, programId)
            createTokenAccountSignature = await signAndSendTx(connection, wallet, tx)
        }

	}



    // Mint to Token Account
    async function mintTokenToAccount(wallet: WalletStore, connection: Connection, mint : PublicKey | string, ata: PublicKey | string, tokenAmount: number) {

        // Create tx to mint token and sign with wallet and send Transaction
        let tx = await createMintTokenTx(connection, mint, ata, wallet.publicKey!, tokenAmount, programId)
        mintTokenSignature = await signAndSendTx(connection, wallet, tx)
	}


    // Transfer Token
    async function transferToken(wallet : WalletStore, connection: Connection, mint: PublicKey | string, recipient: PublicKey | string, tokenAmount: number) {

        // Create tx to transfer token and sign with wallet and send Transaction
        let tx = await createSplTransferTx(connection, mint, wallet.publicKey!, tokenAmount, recipient, wallet.publicKey!, undefined, undefined, programId)
        transferTokenSignature = await signAndSendTx(connection, wallet, tx)

    }



</script>



<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-11/12 rounded-md text-black dark:text-white">
    <h1>Interact with Token Program</h1>
    <div class="grid grid-cols-1 space-y-8">
        <!-- Create Mint -->
        <div class="grid grid-cols-1 space-y-4 ">
            <!-- User Input -->
            <div class="grid grid-cols-2 gap-x-4">
                <div>
                    <label for="Decimals" class="text-xs">Decimals</label>
                    <input class="text-black w-full" type="number" min="0" step="1" max="9" bind:value={decimals} placeholder="Enter decimals (Optional) ...">
                </div>
            </div>
            <div>
                <Button label='Create Mint' onClick={() => createMint($walletStore, $connectedCluster)}/>
                <!-- Response Output -->
                {#await mintSignature}
                <p>waiting for Mint</p>
                {:then value}
                    {#if value}
                        <a class="hover:text-primary" href='https://solscan.io/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">-> SUCCESS</a>
                    {/if}
                {:catch error}
                    <p>Error</p>
                {/await}
            </div>
        </div>

        <!-- Close Mint -->
        <div class="grid grid-cols-1 space-y-4 ">
            <!-- User Input -->
            <div>
                <label for="Mint">Mint:</label>
                <input class="text-black w-full" bind:value={mint} placeholder="Enter mint account address ...">
            </div>
        </div>



        <!-- Create Associated Token Account -->
        <div class="grid grid-cols-1 space-y-4 ">
            <div>
                <label for="TokenAccountOwner">Token Account Owner:</label>
                <input class="text-black w-full" bind:value={tokenOwner} placeholder="Enter recipient token owner address ...">
            </div>
            <div>
                <Button label='Create Token Account' onClick={() => getOrcreateTokenAccount($walletStore, $connectedCluster, mint, tokenOwner)}/>
                <Button label='Copy Wallet' styling='bg-blue-600' onClick={() => tokenOwner = $walletStore.publicKey || ''}/>
                <!-- Response Output -->
                <div>
                    {#await createTokenAccountSignature}
                    <p>waiting for Token Account</p>
                    {:then value}
                        {#if value}
                            <a class="hover:text-primary" href='https://solscan.io/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">-> SUCCESS</a>
                        {/if}
                    {:catch error}
                        <p>Error</p>
                    {/await}
                </div>
            </div>
        </div>

        

        <!-- Mint to Associated Token Account -->
        <div>
            <!-- User Input -->
            <div>
                <label for="AssociatedTokenAccount">Associated Token Account:</label>
                <input class="text-black w-full mb-4" bind:value={ata} placeholder="Enter recipient associated token account address ...">
                <label for="MintAmount">Mint Amount:</label>
                <input class="text-black w-full mb-4" type="number" min="0" step="1" bind:value={mintAmount} placeholder="Enter mint amount...">
                <Button label='Mint Token to Token Account' onClick={() => mintTokenToAccount($walletStore, $connectedCluster, mint, ata, mintAmount)}/>
                <!-- Response Output -->
                <div>
                    {#await mintTokenSignature}
                    <p>waiting for minting to Token Account</p>
                    {:then value}
                        {#if value}
                            <a class="hover:text-primary" href='https://solscan.io/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">-> SUCCESS</a>
                        {/if}
                    {:catch error}
                        <p>Error</p>
                    {/await}
                </div>
            </div>
        </div>


        <!-- Transfer Token -->
        <div>
            <!-- User Input -->
            <div>
                <label for="DestinationAccount">Destination Token Account:</label>
                <input class="text-black w-full mb-4" bind:value={recipientOfTransfer} placeholder="Enter destination token account address ...">
                <label for="TransferAmount">Transfer Amount:</label>
                <input class="text-black w-full mb-4" type="number" min="0" step="1" bind:value={transferAmount} placeholder="Enter token amount...">
                <Button label='Transfer Token' onClick={() => transferToken($walletStore, $connectedCluster, mint, recipientOfTransfer, transferAmount)}/>
                <Button label='Copy Wallet' styling='bg-blue-600' onClick={() => recipientOfTransfer = $walletStore.publicKey || ''}/>
                <Button label='Copy Ata' styling='bg-blue-600' onClick={() => recipientOfTransfer = ata}/>
                <!-- Response Output -->
                <div>
                    {#await transferTokenSignature}
                    <p>waiting for Token Transfer</p>
                    {:then value}
                        {#if value}
                            <a class="hover:text-primary" href='https://solscan.io/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">-> SUCCESS</a>
                        {/if}
                    {:catch error}
                        <p>Error</p>
                    {/await}
                </div>
            </div>
        </div>
    </div>
</section>