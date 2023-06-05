<script lang=ts>
    import Button from '../components/Button.svelte'
    import { goto } from "$app/navigation";



</script>


<!-- HTML + SVELTE -->
<section class="text-black dark:text-white" >
    <div class="items-center space-y-2">
        <div>
            <Button label='Solana Operations with Token2022' onClick={() => goto('/solana')}/>
        </div>
        <div>
            <Button label='SolanaPay QR' onClick={() => goto('/solanapay')}/>
        </div>
        <div>
            <Button label='SolanaPay Endpoint' onClick={() => goto('/solanapay/api')}/>
        </div>
        <div>
            <Button label='Solend Pay2Earn (WIP)' onClick={() => goto('/pay2earn')}/>
        </div>
    </div>

</section>
