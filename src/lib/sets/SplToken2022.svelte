<script lang=ts>

    // Import Wallet
	import { walletStore, type WalletStore } from "@svelte-on-solana/wallet-adapter-core";

    // Import cluster environment
	import { cluster, connectedCluster } from "$lib/stores";

    // UI Component 
    import Button from '../components/Button.svelte';

    // Web3.js library and transactions
    import type { PublicKey, Connection } from '@solana/web3.js'
    import { createMint2Tx, MintConfigData, createCloseMintTx, getAta, checkAtaExist, createAtaTx, createMintTokenTx, createTokenTransferTx } from '../utils/tokenProgram2022'
    import signAndSendTx from '../utils/signAndSendTransaction'
    import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";


    // States of Signatures
    let mintSignature : string
    let createTokenAccountSignature : string
    let mintTokenSignature : string
    let transferTokenSignature : string
    let closeMintSignature : string

    // States of Accounts
    let mint :  PublicKey | string
    let tokenOwner :  PublicKey | string
    let ata : PublicKey
    let recipientOfTransfer :  PublicKey | string
    let programId = TOKEN_2022_PROGRAM_ID

    // States of Token Operations
    let transferAmount : number = 1000  
    let mintAmount : number = 1000000

    // States of Checkboxes for Mint
    let decimals : number = 0
    let isNonTransferable = false
    let feeBasisPoints : number
    let maxFee : number
    let isCloseAuthority = false
    let interestRate : number 


    // Create Mint
    async function createMint(wallet: WalletStore, connection : Connection) {
        
         // Create tx to create mint and sign with wallet and send Transaction
        let configData = new MintConfigData(decimals, isCloseAuthority, isNonTransferable, feeBasisPoints, maxFee, interestRate)
        let tx = await createMint2Tx(connection, wallet.publicKey!, configData, undefined, programId)
        mintSignature = await signAndSendTx(connection, wallet, tx)

        // Set mint
        mint = tx.instructions[0].keys[1].pubkey.toString()        

    }


    // Close Mint
    async function closeMint(wallet: WalletStore, connection: Connection, mint: PublicKey | string) {
        
        // Create tx to close mint and sign with wallet and send Transaction
        let tx = await createCloseMintTx(wallet.publicKey!, mint, programId)
        closeMintSignature = await signAndSendTx(connection, wallet, tx)

    }


    // Get or create Associated Token Account
    async function getOrcreateTokenAccount(wallet : WalletStore, connection : Connection, mint: PublicKey | string, tokenOwner : PublicKey | string) {

        // Get ata
        ata = getAta(mint, tokenOwner)

        // Check if ata exists
        let ataExist = await checkAtaExist(connection, ata, undefined, programId)
        if (ataExist == false) {
            // Create tx to create token account and sign with wallet and send Transaction
            let tx = createAtaTx(mint, tokenOwner, wallet.publicKey!, programId)
            createTokenAccountSignature = await signAndSendTx(connection, wallet, tx)
        }

	}



    // Mint to Token Account
    async function mintTokenToAccount(wallet : any, connection: Connection, mint : PublicKey | string, ata: PublicKey | string, tokenAmount: number) {

        // Create tx to mint token and sign with wallet and send Transaction
        let tx = await createMintTokenTx(connection, mint, ata, wallet.publicKey!, tokenAmount, programId)
        mintTokenSignature = await signAndSendTx(connection, wallet, tx)
	}


        // Transfer Token
    async function transferToken(wallet : any, connection: Connection, mint: PublicKey | string, recipient: PublicKey | string, tokenAmount: number) {

        // Create tx to transfer token and sign with wallet and send Transaction
        let tx = await createTokenTransferTx(connection, wallet, mint, recipient, tokenAmount, undefined, programId)
        transferTokenSignature = await signAndSendTx(connection, wallet, tx)

    }



</script>



<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-11/12 rounded-md text-black dark:text-white">
    <h1>Token-2022</h1>
    <div class="grid grid-cols-1 space-y-8">

        <!-- Create Mint -->
        <div>
            <!-- User Input -->
            <div class="grid grid-cols-2 gap-x-4">
                <div>
                    <label for="Decimals" class="text-xs">Decimals</label>
                    <input class="text-black w-full" type="number" min="0" step="1" max="9" bind:value={decimals} placeholder="Enter decimals (Optional) ...">
                </div>
                <div>
                    <label for="Fee Basis Points" class="text-xs">Fee Basis Points</label>
                    <input class="text-black w-full" type="number" min="0" step="100" max="10000" bind:value={feeBasisPoints} placeholder="Enter fee basis points (Optional) ...">
                </div>
                <div>
                    <label for="Maximum Fee" class="text-xs">Max Fee</label>
                    <input class="text-black w-full" type="number" min="0" bind:value={maxFee} placeholder="Enter max. fee (Optional) ...">
                </div>
                <div>
                    <label for="Interest Rate" class="text-xs">Interest Rate</label>
                    <input class="text-black w-full" type="number" min="0" bind:value={interestRate} max="100" placeholder="Enter interest rate (Optional) ...">
                </div>
            </div>
            <div class="flex flex-wrap items-center space-x-2">
                <div class="flex items-center border border-gray-200 rounded dark:border-gray-700">
                    <input type="checkbox" bind:checked={isNonTransferable} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="bordered-checkbox-1" class="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Non-Transferable</label>
                </div>
                <div class="flex items-center border border-gray-200 rounded dark:border-gray-700">
                    <input type="checkbox" bind:checked={isCloseAuthority} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="bordered-checkbox-2" class="w-full py-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Close Authority</label>
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
            <div>
                <Button label='Close Mint' onClick={() => closeMint($walletStore, $connectedCluster, mint)}/>
            </div>
            <div>
                
                <!-- Response Output -->
                <div>
                    {#await closeMintSignature}
                    <p>waiting for closing Mint</p>
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