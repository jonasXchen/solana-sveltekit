<script lang=ts>

    export let label : string;
    export let onClick: () => Promise<any> | any = () => undefined;

    async function handleClick(){
        await onClick()
    }


</script>

<button class="p-2 bg-primary rounded-md" on:click={() => handleClick()}>
    {label}
</button>