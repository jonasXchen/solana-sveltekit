<script lang="ts">
    export let options : string[] = []
    export let styling : string = ''
    export let bindValue : string
    export let label : string
    export let onChange: () => Promise<any> | any = () => undefined;
    
    async function handleChange(): Promise<any> {
        await onChange()
    }


</script>

<div>
    <label for="{label}">{label}</label>
    <select 
        class="{styling} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        bind:value={bindValue} 
        on:change="{handleChange}"    
    >
        {#each options as option}
        <option value={option}>
            {option}
        </option>
        {/each}
    </select>
</div>
