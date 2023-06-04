<script lang="ts">

    import { fade } from 'svelte/transition'
    import { notifications } from '../stores'

    export let styling : string

</script>

{#if $notifications}
    <div class="space-y-4 {styling}">
        {#each $notifications as notification}
            <div
                role="alert"
                class=" p-2 px-4 bg-slate-200 rounded text-black"
                transition:fade
            >
            🔥 {notification} 
            </div>
        {/each}
    </div>    
{/if}